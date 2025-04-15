import { StatementHandler, mapErrorResponse } from './conn.ts';
import {
  Configuration,
  DefaultConfig,
  DataplaneApi,
  ResultSet,
  StatementStatusFromJSON,
  ResponseError,
} from './dpapiv2/index.ts';
import { AuthenticationError, SQLError, SqlState } from './error.ts';

export class DPAPIConnection implements StatementHandler {
  token: string;
  serverUrl: string;
  sessionID?: string;
  timezone: string;

  api: DataplaneApi;

  constructor(
    dsn: string,
    token: string,
    timezone: string,
    sessionID?: string
  ) {
    const url = new URL(dsn);
    if (token == null) {
      throw new AuthenticationError('Invalid DSN: missing token');
    }

    this.token = token;
    this.serverUrl = `${url.protocol}//${url.host}${url.pathname}`;
    if (url.searchParams.has('sessionID')) {
      this.sessionID = url.searchParams.get('sessionID')!;
    }
    this.timezone = timezone;

    let config = new Configuration({
      ...DefaultConfig,
      basePath: this.serverUrl,
      accessToken: this.token,
    });
    this.api = new DataplaneApi(config);
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
          let statementStatus = StatementStatusFromJSON(await resp.value());
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
}
