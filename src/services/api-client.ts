/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api-client.ts
// This file contains a version of the API service designed to be used exclusively on the client-side.
// It is initialized with an access token obtained from the client's session.

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev';

// Generic API request function for the client
const apiClientRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  accessToken: string | null
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if provided
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  // Note: We don't throw an error here for missing tokens
  // Let the backend handle authentication requirements

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
      const apiError = new Error(errorMessage) as Error & { statusCode: number };
      apiError.statusCode = response.status;
      throw apiError;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return response as T;
  } catch (error) {
    console.error(`API Client Error [${endpoint}]:`, error);
    throw error;
  }
};

// We create a factory function that will produce an API client instance.
// This instance will be configured with the user's access token.
export const getApiClient = (accessToken: string | null) => ({
  Match: {
    getPotentialMatches: () =>
      apiClientRequest<any[]>('/matches/potential', { method: 'GET' }, accessToken),
    likeUser: (userId: string) =>
      apiClientRequest<any>(`/matches/like/${userId}`, { method: 'POST' }, accessToken),
    passUser: (userId: string) =>
      apiClientRequest<void>(`/matches/pass/${userId}`, { method: 'POST' }, accessToken),
  },
  // Add other API namespaces here as needed, for example:
  User: {
    getMe: () => 
      apiClientRequest<any>('/users/me', { method: 'GET' }, accessToken),
  },
  Auth: {
    completeOnboarding: (onboardingData: any) =>
      apiClientRequest<any>('/auth/complete-onboarding', {
        method: 'PUT',
        body: JSON.stringify(onboardingData),
      }, accessToken),
  },
});
