export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR';

/** Public user object returned by the API (no password) */
export interface SafeUserResponse {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Returned by POST /auth/login and POST /auth/register */
export interface AuthTokenResponse {
  access_token: string;
  user: Pick<SafeUserResponse, 'id' | 'email' | 'name' | 'role'>;
}

/** Shape of a NestJS validation / HTTP error */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
