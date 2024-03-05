export class Column {
    public name: string
    public nullable: boolean
    public type: string
    public length?: number
    public precision?: number
    public scale?: number

    constructor(name: string, type: string, nullable: boolean, length?: number, precision?: number, scale?: number) {
        this.name = name
        this.type = type
        this.nullable = nullable
    }
}

export function castRowData(rowDataStrings: (string | null)[], columns: Column[]): any[] {
    let rowData: any[] = []
    for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        if (rowDataStrings[i] == null) {
            rowData.push(null);
            continue;
        }

        const colsTypeParts = column.type.split(new RegExp(`[<>()]`))
        switch (colsTypeParts[0]) {
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
                rowData.push(new Date(Date.parse(String(rowDataStrings[i]))))
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
            default:
                console.log("Unknown type: " + column.type) 
        }
    }
    return rowData
}
