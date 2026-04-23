const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

// ─── Error class ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Token helpers (browser-only) ────────────────────────────────────────────

export const tokenStorage = {
  get: (): string | null =>
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null,

  set: (token: string): void =>
    typeof window !== 'undefined'
      ? localStorage.setItem('access_token', token)
      : undefined,

  clear: (): void =>
    typeof window !== 'undefined'
      ? localStorage.removeItem('access_token')
      : undefined,
};

// ─── Core request ────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = tokenStorage.get();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // Empty response (e.g. 204 No Content)
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (data as { message?: string }).message ?? 'Une erreur est survenue',
    );
  }

  return data as T;
}

// ─── Public API client ────────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
