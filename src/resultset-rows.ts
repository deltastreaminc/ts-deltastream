import { ResultSet } from "./apiv2";
import { StatementHandler, Rows } from "./conn";
import { InterfaceError } from "./error";
import { castRowData, Column } from "./rows";

export class ResultsetRows implements Rows{
    currentRowIdx: number
    currentPartitionIdx: number
    currentResultSet: ResultSet
    stmtHandler: StatementHandler
    isOpen: boolean

    cached_columns?: Column[]

    constructor(stmtHandler: StatementHandler, resultSet: ResultSet) {
        this.currentRowIdx = -1;
        this.currentPartitionIdx = 0;
        this.currentResultSet = resultSet;
        this.stmtHandler = stmtHandler;
        this.isOpen = true;
    }

    async close(): Promise<void> {
        this.isOpen = false;
        return;
    }

    [Symbol.asyncIterator](): AsyncIterator<any[] | null, any, undefined> {
        return {
            next: async () => {
                if (!this.isOpen) {
                    return { value: null, done: true };
                }

                let [rowIdx, partIdx] = this.calcPartitionIdx(this.currentRowIdx + 1);
                if (partIdx == -1) {
                    return { value: null, done: true };
                }

                if (partIdx != this.currentPartitionIdx) {
                    this.currentResultSet = await this.stmtHandler.getStatementStatus(this.currentResultSet.statementID, partIdx);
                    this.currentPartitionIdx = partIdx;
                }
                this.currentRowIdx = rowIdx;
                const row = castRowData(this.currentResultSet.data![this.currentRowIdx] as (string | null)[], this.columns());
                return { value: row, done: false };
            }
        }
    }

    // Columns returns the names and types of the columns returned by the query.
    columns(): Array<Column> {
        if (!this.isOpen) {
            return [];
        }
        if (this.cached_columns != undefined) {
            return this.cached_columns;
        }
        if (this.currentResultSet.metadata.columns == undefined) {
            throw new InterfaceError("invalid result set metadata");
        }

        var columns = Array<Column>();
        for (let i = 0; i < this.currentResultSet.metadata.columns.length; i++) {
            let column = this.currentResultSet.metadata.columns[i];
            columns.push(new Column(column.name, column.type, column.nullable));
        }
        this.cached_columns = columns;
        return columns;
    }

    private calcPartitionIdx(rowIdx: number): [row: number, part: number] {
        if (this.currentResultSet.metadata.partitionInfo == undefined) {
            throw new InterfaceError("invalid result set metadata");
        }

        for (let i = 0; i < this.currentResultSet.metadata.partitionInfo.length; i++) {
            let p = this.currentResultSet.metadata.partitionInfo[i];
            if (rowIdx < p.rowCount) {
                return [rowIdx, i];
            }
            rowIdx = rowIdx - p.rowCount;
        }
        return [-1, -1];
    }
}

