import { describe, it, expect } from 'vitest';
import { Connection } from './conn';
import { fail } from 'assert';
import { Configuration, DefaultConfig, DeltastreamApi, StatementRequestFromJSON, StatementRequest } from './apiv2';
import { readFile, readFileSync } from 'fs';
import { AuthenticationError } from './error';
const { setGlobalDispatcher, MockAgent } = require('undici');


describe('query', () => {
  it('should support single resultset', async () => {
    mockSubmitStatementsResponder('src/fixtures/list-organizations-200-00000-1.json', 200, 'LIST ORGANIZATIONS;');

    let c = new Connection("https://_:sometoken@api.deltastream.io/v2?sessionID=123");
    let rows = await c.query('LIST ORGANIZATIONS;')
    let numRows = 0
    do {
      let row = await rows.fetchRow()
      expect(row).toEqual(['0e0e3617-3cd6-4407-a189-97daf226c4d4', 'o1', null, null, 1703907465000])
      numRows++;
    } while (rows.hasNext())
    expect(numRows).toEqual(1)
  });

  it('should support empty resultset', async () => {
  });

  it('should support selayed single resultset', async () => {
  });

  it('should support multi statement resultset', async () => {
  });

  it('should support simple exec query', async () => {
  });

  it('should support query with attachments', async () => {
  });

  it('should support multi statement exec query', async () => {
  });

  it('should support query with all data types', async () => {
  });
});

function mockSubmitStatementsResponder(fixture: string, statusCode: number = 200, expectedStatement: string, expectedAttachments: string[] = []) {
  const agent = new MockAgent();
  agent.disableNetConnect();
  setGlobalDispatcher(agent);

  agent.get('https://api.deltastream.io').intercept({
    method: 'POST',
    path: '/v2/statements',
    headers: function(headers: any) : boolean {
      let headersMatch = headers['authorization'] === 'Bearer sometoken' && headers['content-type'].startsWith('multipart/form-data; boundary=');
      return headersMatch;
    },
    body: function(body: any) : boolean {
      let attachments: string[] = [];
      let requestPresent = false
      for (const pair of body.entries()) {
        if (pair[0] === 'request') {
          let data = pair[1];
          requestPresent = true;
          data.text().then((text: string) => {
            let request = StatementRequestFromJSON(JSON.parse(text));
            if (request.statement !== expectedStatement) {
              throw new Error(`Expected statement ${expectedStatement}, got ${request.statement}`);
            }
          });
        }
        if (pair[0] === 'attachments') {
          let data = pair[1];
          attachments.push(data.name);
        }
      }
      if (JSON.stringify(expectedAttachments) !== JSON.stringify(attachments)) {
        return false
      }
      return requestPresent;
    },
  }).reply(
    statusCode,
    JSON.parse(readFileSync(fixture, 'utf8')),
    {headers: {'content-type': 'application/json'}},
  );
}
