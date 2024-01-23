import { ResultSet } from "./apiv2";
import { Connection, getStatementStatus } from "./conn";

export class Rows {
    currentRowIdx: number
    currentPartitionIdx: number
    currentResultSet: ResultSet
    conn: Connection

    constructor(conn: Connection, resultSet: ResultSet) {
        this.currentRowIdx = -1
        this.currentPartitionIdx = 0
        this.currentResultSet = resultSet
        this.conn = conn
    }

    // Columns returns the names and types of the columns returned by the query.
    columns(): Array<Column> {
        var columns = Array<Column>()
        for (let i = 0; i < this.currentResultSet.metadata.columns.length; i++) {
            let column = this.currentResultSet.metadata.columns[i]
            columns.push(new Column(column.name, column.type, column.nullable))
        }
        return columns
    }

    hasNext(): boolean {
        let [rowIdx, partIdx] = this.calcPartitionIdx(this.currentRowIdx + 1)
        if (partIdx == -1) {
            return false
        }
        return true
    }

    // Returns the next result row or null if there is no next result row.
    async fetchRow(): Promise<any[] | null> {
        let [rowIdx, partIdx] = this.calcPartitionIdx(this.currentRowIdx + 1)
        if (partIdx == -1) {
            return null
        }
        if (partIdx != this.currentPartitionIdx) {
            this.currentResultSet = await getStatementStatus(this.conn, this.currentResultSet.statementID, partIdx)
            this.currentPartitionIdx = partIdx
        }
        this.currentRowIdx = rowIdx

        let rowDataStrings = this.currentResultSet.data[this.currentRowIdx]
        let rowData:any[] = []
        for (let i = 0; i < this.currentResultSet.metadata.columns.length; i++) {
            let column = this.currentResultSet.metadata.columns[i]
            if (rowDataStrings[i] == null) {
                rowData.push(null)
                continue
            }

            switch (column.type) {
                case "VARCHAR":
                    rowData.push(rowDataStrings[i])
                    break;
                case "TINYINT":
                case "SMALLINT":
                case "INTEGER":
                    rowData.push(parseInt(String(rowDataStrings[i])))
                    break;
                case "BIGINT":
                    rowData.push(BigInt(String(rowDataStrings[i])))
                    break;
                case "FLOAT":
                case "DOUBLE":
                case "DECIMAL":
                    rowData.push(parseFloat(String(rowDataStrings[i])))
                    break;
                case "TIMESTAMP":
                case "TIMESTAMP_TZ":
                case "DATE":
                case "TIME":
                case "TIMESTAMP_LTZ":
                    rowData.push(Date.parse(String(rowDataStrings[i])))
                    break;
                case "VARBINARY":
                case "BYTES":
                    rowData.push(rowDataStrings[i])
                    break;
                case "ARRAY":
                case "MAP":
                case "STRUCT":
                    rowData.push(rowDataStrings[i])
                    break;
                case "BOOLEAN":
                    rowData.push(JSON.parse(String(rowDataStrings[i])))
                    break;
            }
        }
        return rowData
    }

    // For a multi-statement query, NextResultSet prepares the next result set for reading.
    // Returns trye if there are further result sets, if there is an error advancing to it.
    // After calling NextResultSet, the Next method should always be called.
    async NextResultSet(): Promise<boolean> {
        throw new Error("Not implemented");
    }

    private calcPartitionIdx(rowIdx: number): [row: number, part: number] {
        for (let i = 0; i < this.currentResultSet.metadata.partitionInfo.length; i++) {
            let p = this.currentResultSet.metadata.partitionInfo[i]
            if (rowIdx < p.rowCount) {
                return [rowIdx, i]
            }
            rowIdx = rowIdx - p.rowCount
        }
        return [-1, -1]
    }
}

export class Column {
    public readonly name: string
    public readonly type: string
    public readonly nullable: boolean

    constructor(name: string, type: string, nullable: boolean) {
        this.name = name
        this.type = type
        this.nullable = nullable
    }
}
