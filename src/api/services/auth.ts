import { getApiUrl } from '../config';
import { APIException, getAuthHeaders } from '../client';

interface LogoutResponse {
  status: string;
  message: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface LoginResponseData {
  token: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  };
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginResponse {
  status: string;
  data: LoginResponseData;
  message: string;
  errors: null | string;
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const url = getApiUrl('/auth/login');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let detail = 'Invalid username or password';
      try {
        const err = await response.json();
        detail = err.detail || err.message || detail;
      } catch {
        // keep default message
      }
      throw new APIException(response.status, detail);
    }

    const json: LoginResponse = await response.json();
    const { token, username, email, firstName, lastName, role } = json.data;

    return {
      username,
      email,
      firstName,
      lastName,
      role,
      accessToken: token.accessToken,
      tokenType: token.tokenType,
      expiresIn: token.expiresIn,
    };
  },

  async logout(): Promise<LogoutResponse> {
    const url = getApiUrl('/auth/logout');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      let detail = 'Logout failed';
      try {
        const err = await response.json();
        detail = err.detail || err.message || detail;
      } catch {
        // keep default
      }
      throw new APIException(response.status, detail);
    }

    return response.json() as Promise<LogoutResponse>;
  },
};
