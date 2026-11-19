import { describe, it, expect } from 'vitest';
import type { ResultSet } from './apiv2/index.ts';
import { createConnection } from './index.ts';
import { blobData } from './fixtures/handlers.ts';
import { ResultsetRows } from './resultset-rows.ts';

describe('resultset', () => {
  it('should support single resultset', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    let rows = await c.query('SINGLE PARTITION WITH ONE ROW;');
    let numRows = 0;
    for await (let row of rows) {
      expect(row).toEqual([
        '0e0e3617-3cd6-4407-a189-97daf226c4d4',
        'o1',
        null,
        null,
        new Date(`2023-12-30T03:37:45.000Z`),
      ]);
      numRows++;
    }
    await rows.close();
    expect(numRows).toEqual(1);
  });

  it('should support single resultset', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    let rows = await c.query('NO PARTITION WITH NO ROWS;');
    let numRows = 0;
    for await (let row of rows) {
      numRows++;
    }
    await rows.close();
    expect(numRows).toEqual(0);
  });

  it('should support resultset with multiple partitions', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    let rows = await c.query('MULTI PARTITION WITH 4 ROWS;');
    let numRows = 0;
    for await (let row of rows) {
      numRows++;
    }
    await rows.close();
    expect(numRows).toEqual(4);
  });

  it('advances through partition metadata without rescanning earlier partitions', async () => {
    const bodyPartitions = 64;
    const rowsPerPartition = 4;
    const partitionSizes = [
      0,
      ...Array<number>(bodyPartitions).fill(rowsPerPartition),
      0,
    ];
    let rowCountReads = 0;
    const partitionInfo = partitionSizes.map((size) => ({
      get rowCount() {
        rowCountReads++;
        return size;
      },
    }));
    const result = (partition: number): ResultSet => ({
      sqlState: '00000',
      statementID: 'fixture-statement',
      createdOn: 0,
      metadata: {
        encoding: 'json',
        partitionInfo,
        columns: [{ name: 'id', type: 'INTEGER', nullable: false }],
      },
      data: Array.from({ length: partitionSizes[partition] }, (_, row) => [
        String((partition - 1) * rowsPerPartition + row),
      ]),
    });
    const fetched: number[] = [];
    let shouldFailFetch = true;
    const rows = new ResultsetRows(
      {
        async getStatementStatus(_statementID, partition) {
          fetched.push(partition);
          if (partition === 2 && shouldFailFetch) {
            shouldFailFetch = false;
            throw new Error('temporary fetch failure');
          }
          return result(partition);
        },
      },
      result(0)
    );
    const iterator = rows[Symbol.asyncIterator]();
    const values: number[] = [];
    for (let row = 0; row < rowsPerPartition; row++) {
      values.push((await iterator.next()).value[0]);
    }
    await expect(iterator.next()).rejects.toThrow('temporary fetch failure');
    for (
      let row = await iterator.next();
      !row.done;
      row = await iterator.next()
    ) {
      values.push(row.value![0]);
    }
    expect(values).toEqual(
      Array.from({ length: bodyPartitions * rowsPerPartition }, (_, row) => row)
    );
    expect(fetched).toEqual([
      1,
      2,
      ...Array.from({ length: bodyPartitions - 1 }, (_, part) => part + 2),
    ]);
    expect(rowCountReads).toBeLessThanOrEqual(
      values.length + partitionSizes.length + 3
    );
  });

  it('should support delayed single resultset', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    let rows = await c.query('DELAYED SINGLE PARTITION WITH ONE ROW;');
    let numRows = 0;
    for await (let row of rows) {
      expect(row).toEqual([
        '0e0e3617-3cd6-4407-a189-97daf226c4d4',
        'o1',
        null,
        null,
        new Date(`2023-12-30T03:37:45.000Z`),
      ]);
      numRows++;
    }
    await rows.close();
    expect(numRows).toEqual(1);
  });

  it('should support simple exec query', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    await c.exec('SINGLE PARTITION WITH ONE ROW;');
  });

  it('should support query with attachments', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    await c.exec('TEST ATTACHMENT;', [
      new Blob([blobData], { type: 'text/plain' }),
    ]);
  });

  it('should support query with all data types', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    let rows = await c.query('ALL DATA TYPES;');
    let numRows = 0;
    for await (let row of rows) {
      expect(row!.length).toEqual(39);
      numRows++;
    }
    await rows.close();
    expect(numRows).toEqual(4);
  });
});
