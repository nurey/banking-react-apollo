import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './useAuth';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  vi.restoreAllMocks();
  // Default: GET /session returns 401 (not logged in)
  global.fetch = vi.fn().mockResolvedValue({ ok: false });
});

describe('useAuth', () => {
  it('isAuthenticated is false when session check fails', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('isAuthenticated is true when session check succeeds', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { email_address: 'test@example.com' } }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.email_address).toBe('test@example.com');
  });

  it('login sets user on success', async () => {
    const loginResponse = {
      ok: true,
      json: () => Promise.resolve({ user: { email_address: 'test@example.com' } }),
    };
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: false }) // initial session check
      .mockResolvedValueOnce(loginResponse); // login call

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login throws on invalid credentials', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: false }) // initial session check
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid email address or password.' }),
      });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(
      act(async () => {
        await result.current.login('bad@example.com', 'wrong');
      })
    ).rejects.toThrow('Invalid email address or password.');
  });

  it('logout clears user', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: { email_address: 'test@example.com' } }),
      }) // initial session check succeeds
      .mockResolvedValueOnce({ ok: true }); // logout call

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
