import { DefaultConfig, Configuration, DeltastreamApi, ResultSet, ResultSetContext, StatementStatusFromJSON, ErrorResponseFromJSONTyped, ErrorResponseFromJSON, ResultSetContextFromJSON, ResponseError } from "./apiv2"
import { Rows } from "./rows"
import { Result } from "./result"
import { error, time } from "console"
import { AuthenticationError, InterfaceError, SQLError, ServerError, ServiceUnavailableError, SqlState, TimeoutError } from "./error"

export class Connection {
    token: string
    serverUrl: string
    sessionID?: string
    timezone: string

    api: DeltastreamApi
    rsctx: ResultSetContext

    // dsn := "https://_:token@api.deltastream.io/v2?sessionID=sessionID"
    constructor(dsn: string) {
        const url = new URL(dsn);
        if (url.password == "") {
            throw new AuthenticationError("Invalid DSN: missing token")
        }

        this.token = url.password
        this.serverUrl = `${url.protocol}//${url.host}${url.pathname}`
        if (url.searchParams.has("sessionID")) {
            this.sessionID = url.searchParams.get("sessionID")!
        }
        this.timezone = "UTC"
        if (url.searchParams.has("timezone")) {
            this.timezone = url.searchParams.get("timezone")!
        }
        let config = new Configuration({
            ...DefaultConfig,
            basePath: this.serverUrl,
            accessToken: this.token,
        })
        this.api = new DeltastreamApi(config)
        this.rsctx = ResultSetContextFromJSON({})
    }

    // Ping the database to verify DSN provided by the user is valid and the server accessible.
    async ping() {
        try {
            let resp = await this.api.getVersionRaw()
        } catch (err) {
            if (err instanceof ResponseError) {
                switch (err.response.status) {
                    case 200: {
                        return
                    }
                    case 401: {
                        let error = ErrorResponseFromJSON(err.response.body)
                        throw new AuthenticationError(error.message)
                    }
                    case 403: {
                        let error = ErrorResponseFromJSON(err.response.body)
                        throw new AuthenticationError(error.message)
                    }
                    case 500: {
                        let error = ErrorResponseFromJSON(err.response.body)
                        throw new ServerError(error.message)
                    }
                    case 503: {
                        let error = ErrorResponseFromJSON(err.response.body)
                        throw new ServiceUnavailableError(error.message)
                    }
                    default:
                        throw new Error("Unknown error")
                }
            }
        }
    }

    // Exec executes a query without returning any rows.
    async exec(query: string, attachments?: Blob[]): Promise<Result> {
        await submitStatement(this, this.rsctx, query, attachments)
        return new Result()
    }

    // Query executes a query that returns rows, typically a SELECT.
    async query(query: string, attachments?: Blob[]): Promise<Rows> {
        let rs = await submitStatement(this, this.rsctx, query, attachments)
        return new Rows(this, rs)
    }
}

export function createConnection(dsn: string): Connection {
    return new Connection(dsn);
}


export async function submitStatement(conn: Connection, rsctx: ResultSetContext, query: string, attachments?: Blob[]): Promise<ResultSet> {
    try {
        let resp = await conn.api.submitStatementRaw({
            request: {
                statement: query,
                organization: rsctx.organizationID,
                role: rsctx.roleName,
                database: rsctx.databaseName,
                schema: rsctx.schemaName,
                store: rsctx.storeName,
                parameters: { sessionID: conn.sessionID, timezone: conn.timezone }
            },
            attachments: attachments,
        })
        switch (resp.raw.status) {
            default:
            case 200: {
                let resultSet = await resp.value()
                if (resultSet.sqlState == SqlState.SqlStateSuccessfulCompletion) {
                    return resultSet
                }
                throw new SQLError(resultSet.message ?? '', resultSet.sqlState, resultSet.statementID)
            }
            case 202: {
                let statementStatus = StatementStatusFromJSON(resp.raw.body)
                return await getStatementStatus(conn, statementStatus.statementID, 0)
            }
        }
    } catch (err) {
        if (err instanceof ResponseError) {
            switch (err.response.status) {
                case 400: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new InterfaceError(error.message)
                }
                case 401: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new AuthenticationError(error.message)
                }
                case 403: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new AuthenticationError(error.message)
                }
                case 404: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new InterfaceError(`path not found: ${error.message}`)
                }
                case 408: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new TimeoutError(error.message)
                }
                case 500: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new ServerError(error.message)
                }
                case 503: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new ServiceUnavailableError(error.message)
                }
            }
        }
        throw err
    }
}

export async function getStatementStatus(conn: Connection, statementID: string, partitionID: number): Promise<ResultSet> {
    try {
        let resp = await conn.api.getStatementStatusRaw({
            statementID: statementID,
            partitionID: partitionID,
        })
        switch (resp.raw.status) {
            default:
            case 200: {
                let resultSet = await resp.value()
                if (resultSet.sqlState == SqlState.SqlStateSuccessfulCompletion) {
                    return resultSet
                }
                throw new SQLError(resultSet.message ?? '', resultSet.sqlState, resultSet.statementID)
            }
            case 202: {
                let statementStatus = StatementStatusFromJSON(resp.raw.body)
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await getStatementStatus(conn, statementStatus.statementID, partitionID)
            }
        }
    } catch (err) {
        if (err instanceof ResponseError) {
            switch (err.response.status) {
                case 400: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new InterfaceError(error.message)
                }
                case 401: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new AuthenticationError(error.message)
                }
                case 403: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new AuthenticationError(error.message)
                }
                case 404: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new InterfaceError(`path not found: ${error.message}`)
                }
                case 408: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new TimeoutError(error.message)
                }
                case 500: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new ServerError(error.message)
                }
                case 503: {
                    let error = ErrorResponseFromJSON(err.response.body)
                    throw new ServiceUnavailableError(error.message)
                }
            }
        }
        throw err
    }
}
