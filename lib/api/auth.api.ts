import { apiClient } from './client';
import type { AuthTokenResponse, SafeUserResponse } from '@/types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export const authApi = {
  /** POST /auth/login — returns JWT + user info */
  login: (payload: LoginPayload) =>
    apiClient.post<AuthTokenResponse>('/auth/login', payload),

  /** POST /auth/register — creates account, returns JWT + user info */
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthTokenResponse>('/auth/register', payload),

  /** GET /auth/me — returns the authenticated user's profile */
  me: () => apiClient.get<SafeUserResponse>('/auth/me'),
};
