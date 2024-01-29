import { describe, it, expect } from 'vitest';
import { Connection } from './conn';
import { AuthenticationError } from './error';
const { setGlobalDispatcher, MockAgent } = require('undici');

describe('driver', () => {
  it('should throw auth error if no token provided', async () => {
    // missing token
    expect(() => new Connection("https://api.deltastream.io/v2?sessionID=123")).toThrowError(AuthenticationError)
  });
  
  it('should throw auth error if invalid token provided', async () => {
    const agent = new MockAgent();
    agent.disableNetConnect();
    setGlobalDispatcher(agent);

    // invalid token
    agent.get('https://api.deltastream.io').intercept({
      method: 'GET',
      path: '/v2/version',
      headers(headers: any) {
        return headers['authorization'] === 'Bearer xx';
      }
    }).reply(401, { message: 'no token' });

    let c = new Connection("https://_:xx@api.deltastream.io/v2?sessionID=123");
    await expect(() => c.ping()).rejects.toThrowError(AuthenticationError);
    agent.close();
  });

  it('should succeed if valid token provided', async () => {
    const agent = new MockAgent();
    agent.disableNetConnect();
    setGlobalDispatcher(agent);

    // valid token
    agent.get('https://api.deltastream.io').intercept({
      method: 'GET',
      path: '/v2/version',
      headers(headers: any) {
        return headers['authorization'] === 'Bearer sometoken';
      }
    }).reply(200, { major: 2, minor: 0, patch: 0 });

    let c = new Connection("https://_:sometoken@api.deltastream.io/v2?sessionID=123");
    await c.ping().catch((err: any) => {
      expect(err).toBeUndefined();
    });
    agent.close();
  });
});
