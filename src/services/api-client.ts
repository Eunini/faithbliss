/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api-client.ts
// This file contains a version of the API service designed to be used exclusively on the client-side.
// It is initialized with an access token obtained from the client's session.
import { GetUsersResponse, UpdateProfileDto, User } from '@/services/api'; // New import

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev';

const refreshSession = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // This sends the httpOnly refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Session refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch (error) {
    // Clear ALL auth state on refresh failure
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Force redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session refresh failed');
  }
};

// Generic API request function for the client
const apiClientRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {};

  // Copy existing headers
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401 && token) {
      console.log('Token expired, attempting refresh...');
      try {
        const newToken = await refreshSession();
        headers['Authorization'] = `Bearer ${newToken}`;
        
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json();
          throw new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`);
        }

        return await retryResponse.json();
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear ALL auth state completely
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Force redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw refreshError;
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// We create a factory function that will produce an API client instance.
// This instance will be configured with the user's access token.
export const getApiClient = (accessToken: string | null) => ({
  Match: {
    getMatches: () =>
      apiClientRequest<any[]>('/matches', { method: 'GET' }, accessToken),
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
    getAllUsers: (filters?: {
      page?: number;
      limit?: number;
      search?: string;
    }) => {
      const queryParams: Record<string, string> = {};
      if (filters?.page) queryParams.page = filters.page.toString();
      if (filters?.limit) queryParams.limit = filters.limit.toString();
      if (filters?.search) queryParams.search = filters.search;

      const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : '';
      return apiClientRequest<GetUsersResponse>(`/users${query}`, { method: 'GET' }, accessToken);
    },
  },
  Auth: {
    completeOnboarding: (onboardingData: FormData) =>
      apiClientRequest<any>('/auth/complete-onboarding', {
        method: 'PUT',
        body: onboardingData,
      }, accessToken),
  },
  Message: {
    sendMessage: (matchId: string, content: string) =>
      apiClientRequest<any>('/messages', { method: 'POST', body: JSON.stringify({ matchId, content }) }, accessToken),
    getMatchMessages: (matchId: string, page: number = 1, limit: number = 50) =>
      apiClientRequest<any[]>(`/messages/${matchId}?page=${page}&limit=${limit}`, { method: 'GET' }, accessToken),
    markMessageAsRead: (messageId: string) =>
      apiClientRequest<void>(`/messages/${messageId}/read`, { method: 'PATCH' }, accessToken),
    getUnreadCount: () =>
      apiClientRequest<{ count: number }>('/messages/unread-count', { method: 'GET' }, accessToken),
    getMatchConversations: () =>
      apiClientRequest<any[]>('/matches/conversations', { method: 'GET' }, accessToken),
  },
});

export async function updateProfileClient(userData: UpdateProfileDto, accessToken: string): Promise<User> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev'}/users/me`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function uploadSpecificPhotoClient(photoNumber: number, photo: FormData, accessToken: string) {
  const url = `${API_BASE_URL}/users/me/photo/${photoNumber}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      // Do NOT set Content-Type for FormData; browser will set it
    },
    body: photo,
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}