import { describe, it, expect } from 'vitest';
import { Connection, createConnection } from './index.ts';
import { AuthenticationError } from './error.ts';
// const { setGlobalDispatcher, MockAgent } = require('undici');

describe('driver', () => {
  it('should throw auth error if no token provided', async () => {
    expect(() =>
      createConnection('https://api.deltastream.io/v2?sessionID=123')
    ).toThrowError(AuthenticationError);
  });

  it('should throw auth error if invalid token provided', async () => {
    let c = createConnection(
      'https://_:xx@api.deltastream.io/v2?sessionID=123'
    );
    await expect(() => c.version()).rejects.toThrowError(AuthenticationError);
  });

  it('should succeed if valid token provided', async () => {
    let c = createConnection(
      'https://_:sometoken@api.deltastream.io/v2?sessionID=123'
    );
    let version = await c.version();
    expect(version).toEqual({ major: 2, minor: 0, patch: 0 });
  });

  it('should succeed if valid token provided', async () => {
    let c = createConnection(
      'https://api.deltastream.io/v2?sessionID=123',
      async () => 'sometoken'
    );
    let version = await c.version();
    expect(version).toEqual({ major: 2, minor: 0, patch: 0 });
  });
});
