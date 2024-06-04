import { DataplaneRequest } from './apiv2/index.ts';
import { Rows } from './conn.ts';
import { Deferred } from './deferred.ts';
import { DPAPIConnection } from './dpconn.ts';
import { InterfaceError, SQLError } from './error.ts';
import { castRowData, Column } from './rows.ts';
import WebSocket from 'isomorphic-ws';

interface PrintTopicMetadata {
  type: string;
  headers: Map<string, string>;
  columns: Column[];
}

interface DataMessge {
  type: string;
  headers: Map<string, string>;
  data: string[];
}

interface ErrorMessage {
  type: string;
  headers: Map<string, string>;
  message: string;
  sqlCode: string;
}

export class StreamingRows implements Rows {
  conn: DPAPIConnection;
  req: DataplaneRequest;

  ws?: WebSocket;
  metadata?: PrintTopicMetadata;
  rows: any[][];
  deferredRow?: Deferred<any[], null>;
  error?: any;

  constructor(conn: DPAPIConnection, req: DataplaneRequest) {
    this.conn = conn;
    this.req = req;

    this.ws = new WebSocket(this.req.uri);
    console.log('xxx', this.ws);

    this.rows = [];
  }

  // internal function used by the connection to authenticate and open the websocket
  async open(): Promise<void> {
    let ws = this.ws!;
    this.rows = [];

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'auth',
          accessToken: this.conn.token,
          sessionId: this.conn.sessionID,
        })
      );
    };

    let deferredReady: Deferred<void, ErrorMessage> | undefined = new Deferred<
      void,
      ErrorMessage
    >();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      switch (data.type) {
        case 'metadata':
          if (deferredReady != undefined) {
            this.metadata = data;
            deferredReady.resolve();
            deferredReady = undefined;
          }
          break;
        case 'data':
          const row = castRowData(
            data!.data as (string | null)[],
            this.columns()
          );
          if (this.deferredRow != undefined) {
            this.deferredRow.resolve(row);
            this.deferredRow = undefined;
            break;
          }
          this.rows.push(row);
          break;
        case 'error':
          const err = data.error as ErrorMessage;
          this.error = err;
          ws.close();
          if (this.deferredRow != undefined) {
            this.deferredRow.reject();
            this.deferredRow = undefined;
            break;
          }
          if (deferredReady != undefined) {
            deferredReady.reject(err);
            deferredReady = undefined;
          }
          break;
      }
    };

    await deferredReady.promise;
  }

  columns(): Array<Column> {
    if (this.metadata == undefined) {
      return [];
    }
    var columns = Array<Column>();
    for (let i = 0; i < this.metadata.columns.length; i++) {
      let column = this.metadata.columns[i];
      columns.push(
        new Column(
          column.name,
          column.type,
          column.nullable,
          column.length,
          column.precision,
          column.scale
        )
      );
    }
    return columns;
  }

  async close(): Promise<void> {
    if (this.ws != undefined) {
      this.ws.close();
      this.ws = undefined;
    }
    return;
  }

  [Symbol.asyncIterator](): AsyncIterator<any[] | null, any, undefined> {
    return {
      next: async () => {
        if (this.error != undefined) {
          throw new SQLError(
            this.error.message,
            this.error.sqlCode,
            this.req.statementID
          );
        }
        if (this.ws == undefined || this.ws.readyState !== WebSocket.OPEN) {
          return { value: null, done: true };
        }

        if (this.rows.length > 0) {
          const row = this.rows.shift();
          if (row != undefined) {
            return { value: row, done: false };
          }

          // should not happen
          throw new InterfaceError('client error: undefined row');
        }

        this.deferredRow = new Deferred<any[], null>();
        const row = await this.deferredRow.promise;
        if (row == undefined) {
          return { value: null, done: true };
        }
        return { value: row, done: false };
      },
    };
  }
}
