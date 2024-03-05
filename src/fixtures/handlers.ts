import { http, HttpResponse } from 'msw';
import { StatementRequest, Version } from '../apiv2';
import { log } from 'console';

//#region Response data

export const blobData = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Vivamus accumsan purus quis neque rutrum, ut efficitur ipsum congue.
Proin accumsan diam non lacus facilisis, at dignissim felis mollis.
Phasellus blandit lectus at nisi placerat viverra.
Donec eu est sed magna finibus consectetur tristique at elit.
Cras ornare sapien quis purus elementum, sit amet dignissim justo varius.
`;

const delayedSingleResponsePartition0 = {
  sqlState: '03000',
  statementID: 'd789687d-4e1b-4649-846e-4f10b722f3ad',
  createdOn: 1703907114,
};

const singleResponsePartition0 = {
  sqlState: '00000',
  statementID: 'd789687d-4e1b-4649-846e-4f10b722f3ad',
  createdOn: 1703907114,
  metadata: {
    encoding: 'json',
    partitionInfo: [{ rowCount: 1 }],
    columns: [
      { name: 'id', type: 'VARCHAR', nullable: false },
      { name: 'name', type: 'VARCHAR', nullable: false },
      { name: 'description', type: 'VARCHAR', nullable: true },
      { name: 'profileImageURI', type: 'VARCHAR', nullable: true },
      { name: 'createdAt', type: 'TIMESTAMP_TZ', nullable: false },
    ],
    context: {},
  },
  data: [
    [
      '0e0e3617-3cd6-4407-a189-97daf226c4d4',
      'o1',
      null,
      null,
      '2023-12-30 03:37:45Z',
    ],
  ],
};

const noRowsResponse = {
  sqlState: '00000',
  statementID: '402c9a30-bc27-402e-8c52-bb2f82d19fd2',
  createdOn: 1703907114,
  metadata: {
    encoding: 'json',
    partitionInfo: [],
    columns: [
      { name: 'id', type: 'VARCHAR', nullable: false },
      { name: 'name', type: 'VARCHAR', nullable: false },
      { name: 'description', type: 'VARCHAR', nullable: true },
      { name: 'profileImageURI', type: 'VARCHAR', nullable: true },
      { name: 'createdAt', type: 'TIMESTAMP_TZ', nullable: false },
    ],
    context: {},
  },
  data: [],
};

const multiResponsePartition0 = {
  sqlState: '00000',
  statementID: '6d6b9e67-1faf-41d1-96cc-b559621fc8ae',
  createdOn: 1703907114,
  metadata: {
    encoding: 'json',
    partitionInfo: [{ rowCount: 2 }, { rowCount: 2 }],
    columns: [
      { name: 'id', type: 'VARCHAR', nullable: false },
      { name: 'name', type: 'VARCHAR', nullable: false },
      { name: 'description', type: 'VARCHAR', nullable: true },
      { name: 'profileImageURI', type: 'VARCHAR', nullable: true },
      { name: 'createdAt', type: 'TIMESTAMP_TZ', nullable: false },
    ],
    context: {},
  },
  data: [
    [
      '0e0e3617-3cd6-4407-a189-97daf226c4d4',
      'o1',
      null,
      null,
      '2023-12-30 03:37:45Z',
    ],
    [
      'fa58cd4d-5c17-466a-97f4-0fc8b0adc2ca',
      'o2',
      null,
      null,
      '2023-12-30 03:37:45Z',
    ],
  ],
};

const multiResponsePartition1 = {
  sqlState: '00000',
  statementID: '6d6b9e67-1faf-41d1-96cc-b559621fc8ae',
  createdOn: 1703907114,
  metadata: {
    encoding: 'json',
    partitionInfo: [{ rowCount: 2 }, { rowCount: 2 }],
    columns: [
      { name: 'id', type: 'VARCHAR', nullable: false },
      { name: 'name', type: 'VARCHAR', nullable: false },
      { name: 'description', type: 'VARCHAR', nullable: true },
      { name: 'profileImageURI', type: 'VARCHAR', nullable: true },
      { name: 'createdAt', type: 'TIMESTAMP_TZ', nullable: false },
    ],
    context: {},
  },
  data: [
    [
      '776d2269-63f9-4bff-af48-1d2bc4184c29',
      'o3',
      null,
      null,
      '2023-12-30 03:37:45Z',
    ],
    [
      'c88d1c56-c33b-419b-8390-f11ba7f529ca',
      'o4',
      null,
      null,
      '2023-12-30 03:37:45Z',
    ],
  ],
};

const dataTypesResponse = {
  sqlState: '00000',
  statementID: 'd789687d-4e1b-4649-846e-4f10b722f3ad',
  createdOn: 1703907114,
  metadata: {
    encoding: 'json',
    partitionInfo: [{ rowCount: 4 }],
    columns: [
      { name: 'VARCHAR', type: 'VARCHAR', nullable: false },
      { name: 'TINYINT', type: 'TINYINT', nullable: false },
      { name: 'SMALLINT', type: 'SMALLINT', nullable: false },
      { name: 'INTEGER', type: 'INTEGER', nullable: false },
      { name: 'BIGINT', type: 'BIGINT', nullable: false },
      { name: 'FLOAT', type: 'FLOAT', nullable: false },
      { name: 'DOUBLE', type: 'DOUBLE', nullable: false },
      { name: 'DECIMAL', type: 'DECIMAL(4, 3)', nullable: false },
      { name: 'TIMESTAMP', type: 'TIMESTAMP(3)', nullable: false },
      { name: 'TIMESTAMP_TZ', type: 'TIMESTAMP_TZ', nullable: false },
      { name: 'DATE', type: 'DATE', nullable: false },
      { name: 'TIME', type: 'TIME', nullable: false },
      { name: 'TIMESTAMP_LTZ', type: 'TIMESTAMP_LTZ', nullable: false },
      { name: 'VARBINARY', type: 'VARBINARY', nullable: false },
      { name: 'BYTES', type: 'BYTES', nullable: false },
      { name: 'ARRAY', type: 'ARRAY<INTEGER>', nullable: false },
      { name: 'MAP', type: 'MAP<VARCHAR, VARCHAR>', nullable: false },
      {
        name: 'STRUCT',
        type: 'STRUCT<k VARCHAR, v VARCHAR>',
        nullable: false,
      },
      { name: 'BOOLEAN', type: 'BOOLEAN', nullable: false },
      { name: 'VARCHAR_NULLABLE', type: 'VARCHAR', nullable: true },
      { name: 'TINYINT_NULLABLE', type: 'TINYINT', nullable: true },
      { name: 'SMALLINT_NULLABLE', type: 'SMALLINT', nullable: true },
      { name: 'INTEGER_NULLABLE', type: 'INTEGER', nullable: true },
      { name: 'BIGINT_NULLABLE', type: 'BIGINT', nullable: true },
      { name: 'FLOAT_NULLABLE', type: 'FLOAT', nullable: true },
      { name: 'DOUBLE_NULLABLE', type: 'DOUBLE', nullable: true },
      { name: 'DECIMAL_NULLABLE', type: 'DECIMAL(4, 3)', nullable: true },
      {
        name: 'TIMESTAMP_NULLABLE',
        type: 'TIMESTAMP(3)',
        nullable: true,
      },
      {
        name: 'TIMESTAMP_TZ_NULLABLE',
        type: 'TIMESTAMP_TZ',
        nullable: true,
      },
      { name: 'DATE_NULLABLE', type: 'DATE', nullable: true },
      { name: 'TIME_NULLABLE', type: 'TIME', nullable: true },
      {
        name: 'TIMESTAMP_LTZ_NULLABLE',
        type: 'TIMESTAMP_LTZ',
        nullable: true,
      },
      { name: 'VARBINARY_NULLABLE', type: 'VARBINARY', nullable: true },
      { name: 'BYTES_NULLABLE', type: 'BYTES', nullable: true },
      { name: 'ARRAY_NULLABLE', type: 'ARRAY<INTEGER>', nullable: true },
      {
        name: 'MAP_NULLABLE',
        type: 'MAP<VARCHAR, VARCHAR>',
        nullable: true,
      },
      {
        name: 'STRUCT_NULLABLE',
        type: 'STRUCT<k VARCHAR, v VARCHAR>',
        nullable: true,
      },
      { name: 'BOOLEAN_NULLABLE', type: 'BOOLEAN', nullable: true },
    ],
    context: {},
  },
  data: [
    [
      'VARCHAR',
      '255',
      '32767',
      '2147483647',
      '9223372036854775807',
      '-1.79E+308',
      '-1.79E+308',
      '123.00',
      '2007-04-30 13:10:02.0474381',
      '2007-04-30 13:10:02.0474381Z',
      '2007-04-30',
      '13:10:02.0474381',
      '2007-04-30 13:10:02.0474381Z',
      'YmluYXJ5',
      'YmluYXJ5',
      '[1,2,3,4]',
      '{"k": "v"}',
      '{"k": "v"}',
      'true',
      'VARCHAR',
      '255',
      '32767',
      '2147483647',
      '9223372036854775807',
      '-1.79E+308',
      '-1.79E+308',
      '123.00',
      '2007-04-30 13:10:02.0474381',
      '2007-04-30 13:10:02.0474381Z',
      '2007-04-30',
      '13:10:02.0474381',
      '2007-04-30 13:10:02.0474381Z',
      'YmluYXJ5',
      'YmluYXJ5',
      '[1,2,3,4]',
      '{"k": "v"}',
      '{"k": "v"}',
      'true',
    ],
    [
      'VARCHAR',
      '0',
      '-32768',
      '-2147483648',
      '-9223372036854775808',
      '-2.23E-308',
      '-2.23E-308',
      '123.00',
      '2007-04-30 13:10:02.0474381',
      '2007-04-30 13:10:02.0474381+0800',
      '2007-04-30',
      '13:10:02.0474381Z',
      '2007-04-30 13:10:02.0474381Z',
      'YmluYXJ5',
      'YmluYXJ5',
      '[1,2,3,4]',
      '{"k": "v"}',
      '{"k": "v"}',
      'false',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      'VARCHAR',
      '0',
      '-32768',
      '-2147483648',
      '-9223372036854775808',
      '2.23E-308',
      '2.23E-308',
      '123.00',
      '2007-04-30 13:10:02.0474381',
      '2007-04-30 13:10:02.0474381-0700',
      '2007-04-30',
      '13:10:02.0474381Z',
      '2007-04-30 13:10:02.0474381Z',
      'YmluYXJ5',
      'YmluYXJ5',
      '[1,2,3,4]',
      '{"k": "v"}',
      '{"k": "v"}',
      'false',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      'VARCHAR',
      '0',
      '-32768',
      '-2147483648',
      '-9223372036854775808',
      '1.79E+308',
      '1.79E+308',
      '123.00',
      '2007-04-30 13:10:02.0474381',
      '2007-04-30 13:10:02.0474381Z',
      '2007-04-30',
      '13:10:02.0474381Z',
      '2007-04-30 13:10:02.0474381Z',
      'YmluYXJ5',
      'YmluYXJ5',
      '[1,2,3,4]',
      '{"k": "v"}',
      '{"k": "v"}',
      'false',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  ],
};

const streamingResultset = {
  createdOn: 1709673115,
  data: [],
  metadata: {
    columns: null,
    context: {
      databaseName: 'db',
      organizationID: '5febb10d-ac4d-466e-8afe-cef669bbb9cd',
      roleName: 'sysadmin',
      schemaName: 'public',
      storeName: 'msk',
    },
    dataplaneRequest: {
      requestType: 'streaming',
      statementID: 'a96a9711-e737-4aa2-9567-2000ed88b361',
      token:
        'eyJhbGciOiJFUzI1NiIsImtpZCI6NywidHlwIjoiSldUIn0.eyJpc3MiOiJkZWx0YXN0cmVhbSIsInN1YiI6ImIxMzFhNjExLTEzMTYtNGY2OS1hNjA1LWRmNGY5ZWFhNTQyZiIsImV4cCI6MTcwOTY3MzQxNSwiaWF0IjoxNzA5NjczMTE1LCJqdGkiOiIxNjJiZGFhMi1iYTY5LTRlYTItYjVkMi1lMGYyZTNhZmY3NDMiLCJ0cmFjZWlkIjoiOGEwZGFkZmEwYWM3OTU4M2NmYzQ0YmFkYmEwYTNkMjgiLCJzdGF0ZW1lbnRJRCI6ImE5NmE5NzExLWU3MzctNGFhMi05NTY3LTIwMDBlZDg4YjM2MSIsInF1ZXJ5VHlwZSI6InByaW50LXRvcGljIn0.EqsEOoIQZPoSdx1ZelSYliexaPkJOY5k0mxixqP2_jhF10EaraNQ-0a4zxihBNRzMOjwzocVI-ZR17UnuvgSgg',
      uri: 'wss://api-aldf0.stage.deltastream.io/v2/print/a96a9711-e737-4aa2-9567-2000ed88b361',
    },
    encoding: 'json',
    partitionInfo: null,
  },
  sqlState: '00000',
  statementID: 'a96a9711-e737-4aa2-9567-2000ed88b361',
};

//#endregion

export const handlers = [
  http.get<any, any, any>('https://api.deltastream.io/v2/version', (r) => {
    if (r.request.headers.get('authorization') !== 'Bearer sometoken') {
      return HttpResponse.json({ message: 'no token' }, { status: 401 });
    }
    return HttpResponse.json({ major: 2, minor: 0, patch: 0 });
  }),

  http.post<any, any, any>('https://api.deltastream.io/v2/statements', async (r) => {
    if (r.request.headers.get('authorization') !== 'Bearer sometoken') {
      return HttpResponse.json({ message: 'no token' }, { status: 401 });
    }
    const body = await r.request.formData();
    const stmtReq = JSON.parse(
      await (body.get('request') as File).text()
    ) as StatementRequest;
    switch (stmtReq.statement) {
      case `DELAYED SINGLE PARTITION WITH ONE ROW;`:
        return HttpResponse.json(delayedSingleResponsePartition0, {
          'status': 202,
        });
      case `SINGLE PARTITION WITH ONE ROW;`:
        return HttpResponse.json(singleResponsePartition0);
      case `NO PARTITION WITH NO ROWS;`:
        return HttpResponse.json(noRowsResponse);
      case `MULTI PARTITION WITH 4 ROWS;`:
        return HttpResponse.json(multiResponsePartition0);
      case `TEST ATTACHMENT;`: {
        const attachments = body.getAll('attachments');
        if (attachments.length !== 1) {
          return HttpResponse.json(
            { 'message': 'expected 1 attachment' },
            { 'status': 500 }
          );
        }
        const f = await attachments[0] as File;
        if (await f.text() !== blobData) {
          return HttpResponse.json(
            { 'message': 'bob content does not match' },
            { 'status': 500 }
          );
        }
        return HttpResponse.json(noRowsResponse);
      }
      case `ALL DATA TYPES;`: {
        return HttpResponse.json(dataTypesResponse);
      }
      case `PRINT ENTITY pageviews;`: {
        return HttpResponse.json(streamingResultset);
      }
      default:
        return HttpResponse.json(
          { 'message': 'unknown statement' },
          { 'status': 500 }
        );
    }
  }),

  http.get<any, any, any>(
    'https://api.deltastream.io/v2/statements/:statementId',
    async (r) => {
      if (r.request.headers.get('authorization') !== 'Bearer sometoken') {
        return HttpResponse.json({ message: 'no token' }, { status: 401 });
      }
      switch (r.params.statementId) {
        case `d789687d-4e1b-4649-846e-4f10b722f3ad`: {
          const url = new URL(r.request.url);
          const partition = url.searchParams.get('partitionID');
          switch (partition) {
            case '0':
              return HttpResponse.json(singleResponsePartition0);
            default:
              return HttpResponse.json(
                { 'message': 'unknown partition' },
                { 'status': 500 }
              );
          }
        }
        case `6d6b9e67-1faf-41d1-96cc-b559621fc8ae`: {
          const url = new URL(r.request.url);
          const partition = url.searchParams.get('partitionID');
          switch (partition) {
            case '0':
              return HttpResponse.json(multiResponsePartition0);
            case '1':
              return HttpResponse.json(multiResponsePartition1);
            default:
              return HttpResponse.json(
                { 'message': 'unknown partition' },
                { 'status': 500 }
              );
          }
        }
        default:
          return HttpResponse.json(
            { 'message': 'unknown statement' },
            { 'status': 500 }
          );
      }
    }
  ),
];
