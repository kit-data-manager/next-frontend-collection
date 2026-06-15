import { DataResource } from '@/lib/definitions';

// Utility function to create headers with optional authorization
export function createHeaders(
  accessToken?: string | undefined,
  contentType?: string,
  etag?: string
): Record<string, string> {
  const headers: Record<string, string> = {};

  // Always set Accept header
  headers['Accept'] = 'application/json';

    // Set If-Match if provided
    if(etag){
      headers['If-Match'] = etag;
  }

  // Set Content-Type if provided
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  // Add Authorization if token is provided
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
}

// Utility function to get base URL
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_REPO_BASE_URL || 'http://localhost:8080';
}

// Utility function to build API URL
export function buildApiUrl(
  endpoint: string,
  queryParams?: Record<string, string | number | boolean | undefined>,
): string {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}${endpoint}`);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}
