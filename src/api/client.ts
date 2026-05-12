/**
 * HTTP Client
 *
 * Wrapper around fetch API with error handling and type safety.
 */

import { getConfig } from './config';
import type { APIError } from './types';

/**
 * Custom error class for API errors
 */
export class APIException extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'APIException';
    this.status = status;
    this.detail = detail;
  }
}

/**
 * HTTP request options
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Make an HTTP request with error handling
 */
async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const config = getConfig();
  const { timeout = config.timeout, ...fetchOptions } = options;

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let errorDetail = 'An error occurred';
      try {
        const errorData: APIError = await response.json();
        errorDetail = errorData.detail || errorDetail;
      } catch {
        errorDetail = response.statusText || errorDetail;
      }
      throw new APIException(response.status, errorDetail);
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof APIException) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new APIException(408, 'Request timeout');
      }
      throw new APIException(0, error.message);
    }

    throw new APIException(0, 'Unknown error occurred');
  }
}

/**
 * HTTP Client methods
 */
export const client = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: any, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data?: any, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),

  patch: <T>(url: string, data?: any, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export default client;
