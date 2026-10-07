import { describe, it, expect } from 'vitest';
import { graphqlUri } from './graphqlUri';

describe('graphqlUri', () => {
  it('uses the optiplex backend when served from budgetr.lan', () => {
    expect(graphqlUri('budgetr.lan', 'https://fallback/graphql')).toBe('http://budgetr-api.lan/graphql');
  });

  it('falls back for any other host', () => {
    expect(graphqlUri('budgetr-app.nurey.com', 'https://fallback/graphql')).toBe('https://fallback/graphql');
    expect(graphqlUri('localhost', 'http://localhost:4000/graphql')).toBe('http://localhost:4000/graphql');
  });
});
