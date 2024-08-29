import {
  DefaultConfig,
  Configuration,
  DeltastreamApi,
  ResultSet,
  ResultSetContext,
  StatementStatusFromJSON,
  ErrorResponseFromJSONTyped,
  ErrorResponseFromJSON,
  ResultSetContextFromJSON,
  ResponseError,
} from './apiv2/index.ts';
import {
  AuthenticationError,
  InterfaceError,
  SQLError,
  ServerError,
  ServiceUnavailableError,
  SqlState,
  TimeoutError,
} from './error.ts';
import { DPAPIConnection } from './dpconn.ts';
import { ResultsetRows } from './resultset-rows.ts';
import { StreamingRows } from './streaming-rows.ts';
import { Column } from './rows.ts';

export interface StatementHandler {
  // submitStatement(query: string, attachments?: Blob[]): Promise<ResultSet>
  getStatementStatus(
    statementID: string,
    partitionID: number
  ): Promise<ResultSet>;
}

export interface Rows extends AsyncIterable<any[] | null> {
  columns(): Array<Column>;
  close(): Promise<void>;

  // For a multi-statement query, NextResultSet prepares the next result set for reading.
  // Returns trye if there are further result sets, if there is an error advancing to it.
  // After calling NextResultSet, the Next method should always be called.
  // NextResultSet(): Promise<boolean>
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface Connection {
  exec(query: string, attachments?: Blob[]): Promise<null>;
  query(query: string, attachments?: Blob[]): Promise<Rows>;
  version(): Promise<Version>;
}

export class APIConnection implements StatementHandler, Connection {
  token: string;
  serverUrl: string;
  sessionID?: string;
  timezone: string;

  api: DeltastreamApi;
  rsctx: ResultSetContext;

  constructor(dsn: string, tokenProvider?: () => Promise<string>) {
    const url = new URL(dsn);
    if (tokenProvider == null) {
      if (url.password == '') {
        throw new AuthenticationError('Invalid DSN: missing token');
      }
      tokenProvider = async () => url.password;
    }

    this.token = url.password;
    this.serverUrl = `${url.protocol}//${url.host}${url.pathname}`;
    if (url.searchParams.has('sessionID')) {
      this.sessionID = url.searchParams.get('sessionID')!;
    }
    this.timezone = 'UTC';
    if (url.searchParams.has('timezone')) {
      this.timezone = url.searchParams.get('timezone')!;
    }

    let config = new Configuration({
      ...DefaultConfig,
      basePath: this.serverUrl,
      accessToken: tokenProvider,
    });
    this.api = new DeltastreamApi(config);

    this.rsctx = ResultSetContextFromJSON({});
    if (url.searchParams.has('organizationID')) {
      this.rsctx.organizationID = url.searchParams.get('organizationID')!;
    }
    if (url.searchParams.has('roleName')) {
      this.rsctx.roleName = url.searchParams.get('roleName')!;
    }
    if (url.searchParams.has('databaseName')) {
      this.rsctx.databaseName = url.searchParams.get('databaseName')!;
    }
    if (url.searchParams.has('schemaName')) {
      this.rsctx.schemaName = url.searchParams.get('schemaName')!;
    }
    if (url.searchParams.has('storeName')) {
      this.rsctx.storeName = url.searchParams.get('storeName')!;
    }
  }

  async exec(query: string, attachments?: Blob[]): Promise<null> {
    let rs = await this.submitStatement(query, attachments);
    if (rs.metadata.context) {
      let newCtx = rs.metadata.context;
      if (newCtx.organizationID) {
        this.rsctx.organizationID = newCtx.organizationID;
      }
      if (newCtx.roleName) {
        this.rsctx.roleName = newCtx.roleName;
      }
      if (newCtx.databaseName) {
        this.rsctx.databaseName = newCtx.databaseName;
      }
      if (newCtx.schemaName) {
        this.rsctx.schemaName = newCtx.schemaName;
      }
      if (newCtx.storeName) {
        this.rsctx.storeName = newCtx.storeName;
      }
    }
    return null;
  }

  // Query executes a query that returns rows, typically a SELECT.
  async query(query: string, attachments?: Blob[]): Promise<Rows> {
    let rs = await this.submitStatement(query, attachments);
    if (rs.metadata.dataplaneRequest != undefined) {
      let dpconn = new DPAPIConnection(
        rs.metadata.dataplaneRequest.uri.replace(`/statements/${rs.metadata.dataplaneRequest.statementID}`, ''),
        rs.metadata.dataplaneRequest.token,
        this.timezone,
        this.sessionID
      );
      if (rs.metadata.dataplaneRequest.requestType == 'result-set') {
        let dprs = await dpconn.getStatementStatus(
          rs.metadata.dataplaneRequest.statementID,
          0
        );
        return new ResultsetRows(dpconn, dprs);
      }
      let rows = new StreamingRows(dpconn, rs.metadata.dataplaneRequest);
      await rows.open();
      return rows;
    }
    if (rs.metadata.context) {
      let newCtx = rs.metadata.context;
      if (newCtx.organizationID) {
        this.rsctx.organizationID = newCtx.organizationID;
      }
      if (newCtx.roleName) {
        this.rsctx.roleName = newCtx.roleName;
      }
      if (newCtx.databaseName) {
        this.rsctx.databaseName = newCtx.databaseName;
      }
      if (newCtx.schemaName) {
        this.rsctx.schemaName = newCtx.schemaName;
      }
      if (newCtx.storeName) {
        this.rsctx.storeName = newCtx.storeName;
      }
    }
    return new ResultsetRows(this, rs);
  }

  async submitStatement(
    query: string,
    attachments?: Blob[]
  ): Promise<ResultSet> {
    try {
      let resp = await this.api.submitStatementRaw({
        request: {
          statement: query,
          organization: this.rsctx.organizationID,
          role: this.rsctx.roleName,
          database: this.rsctx.databaseName,
          schema: this.rsctx.schemaName,
          store: this.rsctx.storeName,
          parameters: {
            sessionID: this.sessionID,
            timezone: this.timezone,
          },
        },
        attachments: attachments,
      });
      var resultSet: ResultSet;
      switch (resp.raw.status) {
        default:
        case 200:
          resultSet = await resp.value();
          break;
        case 202:
          resultSet = await resp.value();
          resultSet = await this.getStatementStatus(resultSet.statementID, 0);
          break;
      }
      if (resultSet.sqlState == SqlState.SqlStateSuccessfulCompletion) {
        return resultSet;
      }
      throw new SQLError(
        resultSet.message ?? '',
        resultSet.sqlState,
        resultSet.statementID
      );
    } catch (err) {
      if (err instanceof ResponseError) {
        mapErrorResponse(err);
      }
      throw err;
    }
  }

  async getStatementStatus(
    statementID: string,
    partitionID: number
  ): Promise<ResultSet> {
    try {
      let resp = await this.api.getStatementStatusRaw({
        statementID: statementID,
        partitionID: partitionID,
      });
      switch (resp.raw.status) {
        default:
        case 200: {
          let resultSet = await resp.value();
          if (resultSet.sqlState == SqlState.SqlStateSuccessfulCompletion) {
            return resultSet;
          }
          throw new SQLError(
            resultSet.message ?? '',
            resultSet.sqlState,
            resultSet.statementID
          );
        }
        case 202: {
          let statementStatus = StatementStatusFromJSON(resp.raw.body);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return await this.getStatementStatus(
            statementStatus.statementID,
            partitionID
          );
        }
      }
    } catch (err) {
      if (err instanceof ResponseError) {
        mapErrorResponse(err);
      }
      throw err;
    }
  }

  async version(): Promise<Version> {
    try {
      let resp = await this.api.getVersion();
      return resp;
    } catch (err) {
      if (err instanceof ResponseError) {
        mapErrorResponse(err);
      }
      throw err;
    }
  }
}

export function mapErrorResponse(err: ResponseError) {
  switch (err.response.status) {
    case 400: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new InterfaceError(error.message);
    }
    case 401: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new AuthenticationError(error.message);
    }
    case 403: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new AuthenticationError(error.message);
    }
    case 404: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new InterfaceError(`path not found: ${error.message}`);
    }
    case 408: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new TimeoutError(error.message);
    }
    case 500: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new ServerError(error.message);
    }
    case 503: {
      let error = ErrorResponseFromJSON(err.response.body);
      throw new ServiceUnavailableError(error.message);
    }
  }
}

export function createConnection(
  dsn: string,
  tokenProvider?: () => Promise<string>
): Connection {
  return new APIConnection(dsn, tokenProvider);
}
