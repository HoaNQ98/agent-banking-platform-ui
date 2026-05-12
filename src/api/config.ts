/**
 * API Configuration
 *
 * Central configuration for API endpoints and settings.
 * Base URL can be configured via environment variables.
 */

interface APIConfig {
  baseURL: string;
  apiVersion: string;
  timeout: number;
}

const config: APIConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  apiVersion: 'v1',
  timeout: 30000, // 30 seconds
};

/**
 * Get full API URL for a given path
 * @param path - API path (e.g., '/conversations')
 * @returns Full URL with base and version
 */
export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.baseURL}/api/${config.apiVersion}${cleanPath}`;
};

/**
 * Get API configuration
 */
export const getConfig = (): APIConfig => config;

/**
 * Update base URL at runtime (useful for testing)
 */
export const setBaseURL = (url: string): void => {
  config.baseURL = url;
};

export default config;
