import { ResultSet } from './apiv2/index.ts';
import { StatementHandler, Rows } from './conn.ts';
import { InterfaceError } from './error.ts';
import { castRowData, Column } from './rows.ts';

export class ResultsetRows implements Rows {
  currentRowIdx: number;
  currentPartitionIdx: number;
  private currentPartitionStart = 0;
  currentResultSet: ResultSet;
  stmtHandler: StatementHandler;
  isOpen: boolean;

  cached_columns?: Column[];

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

        const [rowIdx, partIdx, partitionStart] = this.calcPartitionIdx(
          this.currentRowIdx + 1
        );
        if (partIdx == -1) {
          return { value: null, done: true };
        }

        if (partIdx != this.currentPartitionIdx) {
          this.currentResultSet = await this.stmtHandler.getStatementStatus(
            this.currentResultSet.statementID,
            partIdx
          );
          this.currentPartitionIdx = partIdx;
          this.currentPartitionStart = partitionStart;
        }
        this.currentRowIdx++;
        const row = castRowData(
          this.currentResultSet.data![rowIdx] as (string | null)[],
          this.columns()
        );
        return { value: row, done: false };
      },
    };
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
      throw new InterfaceError('invalid result set metadata');
    }

    var columns = Array<Column>();
    for (let i = 0; i < this.currentResultSet.metadata.columns.length; i++) {
      let column = this.currentResultSet.metadata.columns[i];
      columns.push(new Column(column.name, column.type, column.nullable));
    }
    this.cached_columns = columns;
    return columns;
  }

  private calcPartitionIdx(
    rowIdx: number
  ): [row: number, part: number, start: number] {
    const partitions = this.currentResultSet.metadata.partitionInfo;
    if (partitions == undefined) {
      throw new InterfaceError('invalid result set metadata');
    }

    // Iteration only moves forward. Retain the global start of the last
    // fetched partition so each row skips metadata already traversed.
    let partitionRow = rowIdx - this.currentPartitionStart;
    for (let i = this.currentPartitionIdx; i < partitions.length; i++) {
      const rowCount = partitions[i].rowCount;
      if (partitionRow < rowCount) {
        return [partitionRow, i, rowIdx - partitionRow];
      }
      partitionRow -= rowCount;
    }
    return [-1, -1, 0];
  }
}
