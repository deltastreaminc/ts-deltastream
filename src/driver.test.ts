import { describe, it, expect } from 'vitest';
import { Connection } from './index';
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
    await expect(() => c.version()).rejects.toThrowError(AuthenticationError);
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
    await c.version().catch((err: any) => {
      expect(err).toBeUndefined();
    });
    agent.close();
  });

  it('should succeed if tokenProvided is set', async () => {
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

    let c = new Connection("https://api.deltastream.io/v2?sessionID=123", async () => 'sometoken');
    await c.version().catch((err: any) => {
      expect(err).toBeUndefined();
    });
    agent.close();
  });
});
