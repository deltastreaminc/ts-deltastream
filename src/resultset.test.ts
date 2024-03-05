import { describe, it, expect } from 'vitest';
import { Connection, createConnection } from './index';
import { blobData } from './fixtures/handlers';

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
      expect(row!.length).toEqual(38);
      numRows++;
    }
    await rows.close();
    expect(numRows).toEqual(4);
  });
});
