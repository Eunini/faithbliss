/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hooks for API integration - REFACTORED FOR CLIENT-SIDE
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { getApiClient } from '@/services/api-client';

import { useRequireAuth } from './useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { GetUsersResponse } from '@/services/api'; // New import

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  cacheTime?: number;
}

export interface ConversationMessagesResponse {
  match: Match;
  messages: Message[];
}

// Global request cache to prevent duplicate requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const activeRequests = new Map<string, Promise<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes


// Types for messaging
import { Match, Conversation, User, Message } from '@/services/api';

interface ConversationSummary {
  id: string; // matchId
  otherUser: {
    id: string;
    name: string;
    profilePhoto1: string;
  };
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string; // ISO date string
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: (() => Promise<T>) | null,
  dependencies: unknown[] = [],
  options: UseApiOptions = { showErrorToast: false }
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { showError, showSuccess } = useToast();
  const router = useRouter();
  const { 
    immediate = true, 
    showErrorToast = false, 
    showSuccessToast = false,
    cacheTime = CACHE_DURATION 
  } = options;

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const cacheKeyRef = useRef<string>('');

  // Generate stable cache key from dependencies
  const cacheKey = useMemo(() => JSON.stringify(dependencies), [dependencies]);

  const execute = useCallback(async () => {
    if (!apiCall) return;

    // Check cache first
    if (requestCache.has(cacheKey)) {
      const cached = requestCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cacheTime) {
        if (isMountedRef.current) {
          setState({ data: cached.data, loading: false, error: null });
        }
        return cached.data;
      }
    }

    // Return existing request if one is in flight
    if (activeRequests.has(cacheKey)) {
      return activeRequests.get(cacheKey);
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (isMountedRef.current) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    // Create the promise for this request
    const requestPromise = (async () => {
      try {
        const data = await apiCall();

        if (!isMountedRef.current) return data;

        // Cache the result
        requestCache.set(cacheKey, { data, timestamp: Date.now() });

        setState({ data, loading: false, error: null });

        if (showSuccessToast) {
          showSuccess('Operation completed successfully');
        }

        return data;
      } catch (error: any) {
        if (!isMountedRef.current) throw error;

        // Check for auth error
        if (error?.statusCode === 401 || error?.status === 401) {
          showError('Your session has expired. Please log in again.', 'Authentication Error');
          router.push('/login');
          throw error;
        }

        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));

        if (showErrorToast) {
          showError(errorMessage, 'API Error');
        }

        throw error;
      } finally {
        // Remove from active requests
        activeRequests.delete(cacheKey);
      }
    })();

    // Track this request
    activeRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }, [apiCall, cacheKey, cacheTime, showError, showSuccess, showErrorToast, showSuccessToast, router]);

  // Effect to run on mount or when dependencies change
  useEffect(() => {
    isMountedRef.current = true;

    if (immediate && apiCall) {
      execute().catch(err => {
        // Silently catch errors as they're handled in execute()
        console.debug('API call error:', err);
      });
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, apiCall, cacheKey, execute]); // Only depend on cacheKey, not individual deps

  const refetch = useCallback(async () => {
    // Clear cache for this specific request
    requestCache.delete(cacheKey);
    activeRequests.delete(cacheKey);
    return execute();
  }, [execute, cacheKey]);

  return {
    ...state,
    execute,
    refetch,
  };
}

// Hook for user profile
export function useUserProfile() {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    return apiClient.User.getMe();
  }, [apiClient, accessToken]);

  const api = useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated, showErrorToast: false, cacheTime: 15 * 60 * 1000 }
  );

  // Re-trigger once authentication becomes ready
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      api.refetch();
    }
  }, [isAuthenticated, accessToken]);

  return api;
}


// Hook for potential matches
export function usePotentialMatches() {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    return apiClient.Match.getPotentialMatches();
  }, [apiClient, accessToken]);

  return useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated, showErrorToast: true, cacheTime: 3 * 60 * 1000 }
  );
}

// Hook for matches
export function useMatches() {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    return apiClient.Match.getMatches();
  }, [apiClient, accessToken]);

  return useApi<Match[]>(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
}

// Hook for liking/passing users
export function useMatching() {
  const { accessToken } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  const { showSuccess, showError, showInfo } = useToast();

  // Store toast refs to avoid adding them to dependencies
  const toastRef = useRef({ showSuccess, showError, showInfo });

  // Update refs when they change, but don't trigger callback recreation
  useEffect(() => {
    toastRef.current = { showSuccess, showError, showInfo };
  }, [showSuccess, showError, showInfo]);

  const likeUser = useCallback(async (userId: string) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      const result = await apiClient.Match.likeUser(userId);
      toastRef.current.showSuccess(result.isMatch ? '💕 It\'s a match!' : '👍 Like sent!');
      return result;
    } catch (error: any) {
      if (error.message && error.message.includes('User already liked')) {
        toastRef.current.showInfo('You\'ve already liked this profile!', 'Already Liked');
        return; // Do not re-throw, just inform the user
      }
      toastRef.current.showError('Failed to like user', 'Error');
      throw error; // Re-throw other errors
    }
  }, [apiClient, accessToken]);

  const passUser = useCallback(async (userId: string) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      await apiClient.Match.passUser(userId);
      return true;
    } catch (error) {
      toastRef.current.showError('Failed to pass user', 'Error');
      throw error;
    }
  }, [apiClient, accessToken]);

  return { likeUser, passUser };
}

// Hook for completing onboarding
export function useOnboarding() {
  const { accessToken, refetchUser } = useRequireAuth();
  const { update: updateSession } = useSession();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  const { showSuccess, showError } = useToast();

  // Store toast and session refs to avoid dependency issues
  const toastRef = useRef({ showSuccess, showError });
  const sessionRef = useRef(updateSession);

  // Update refs when they change
  useEffect(() => {
    toastRef.current = { showSuccess, showError };
  }, [showSuccess, showError]);

  useEffect(() => {
    sessionRef.current = updateSession;
  }, [updateSession]);

  const completeOnboarding = useCallback(async (onboardingData: FormData) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      const result = await apiClient.Auth.completeOnboarding(onboardingData);

      // Refresh user data after successful onboarding
      if (refetchUser) {
        await refetchUser();
      }

      // Update NextAuth session if user is using Google OAuth
      if (sessionRef.current) {
        await sessionRef.current({
          onboardingCompleted: true,
          picture: result.profilePhotos?.photo1,
        });
      }

      // Add a small delay to allow user state to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      toastRef.current.showSuccess('Profile setup complete! Welcome to FaithBliss! 🎉', 'Ready to Find Love');
      return result;
    } catch (error: any) {
      console.error('Onboarding error:', error);
      
      // Handle authentication errors
      if (error?.message?.includes('Session refresh failed') || 
          error?.message?.includes('Unauthorized') ||
          error?.message?.includes('token')) {
        toastRef.current.showError('Your session has expired. Please login again.', 'Authentication Error');
        // Clear auth state and redirect will be handled by api-client
      } else {
        toastRef.current.showError('Failed to complete profile setup. Please try again.', 'Setup Error');
      }
      
      throw error;
    }
  }, [apiClient, accessToken, refetchUser]);

  return { completeOnboarding };
}


// Hook for WebSocket connection
export function useConversations() {
  const pathname = usePathname();
  console.log("useConversations")
  const { accessToken, isAuthenticated } = useRequireAuth();
  
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  
  const apiCall = useCallback(async (): Promise<ConversationSummary[]> => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    const resp = await apiClient.Message.getMatchConversations();
    console.log("useConversations: ",resp)
    return resp;
  }, [apiClient, accessToken]);

  const { data, loading, error, refetch } = useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: true }
  );

  // 👇 Re-fetch when user navigates back to `/messages`
  useEffect(() => {
    if (pathname === '/messages') {
      refetch();
    }
  }, [pathname, refetch]);

  return { data, loading, error, refetch };
}

// Hook for conversation messages
export function useConversationMessages(
  matchId: string,
  otherUserId?: string,
  page: number = 1,
  limit: number = 50
): {
  execute: () => Promise<ConversationMessagesResponse>;
  refetch: () => Promise<ConversationMessagesResponse>;
  data: ConversationMessagesResponse | null;
  loading: boolean;
  error: string | null;
} {
  console.log("useConversationMessages: ", otherUserId)
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  
  const apiCall = useCallback(async (): Promise<ConversationMessagesResponse> => {
    if (!accessToken) throw new Error('Authentication required');
    
    // Return the full response from backend
    const response = await apiClient.Message.getCreateMatchMessages(matchId, otherUserId, page, limit);
    console.log("useConversationMessages: ", response)
    return response; // should be { match: ..., messages: [...] }
  }, [apiClient, accessToken, matchId, otherUserId, page, limit]);

  return useApi<ConversationMessagesResponse>(
    isAuthenticated && matchId ? apiCall : null,
    [accessToken, isAuthenticated, matchId, otherUserId, page, limit],
    { immediate: !!(isAuthenticated && matchId) }
  );
}

// Hook for notifications (using message conversations as a proxy for now)

import { useNotificationWebSocket } from './useNotificationWebSocket'; // New import
import { NotificationPayload } from '../services/notification-websocket'; // New import

export function useNotifications() {
  const { isAuthenticated } = useRequireAuth();
  const notificationWebSocketService = useNotificationWebSocket();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track handlers for proper cleanup
  const handlersRef = useRef<{
    handleNotification?: (payload: NotificationPayload) => void;
    handleError?: (err: any) => void;
  }>({});

  useEffect(() => {
    if (!isAuthenticated || !notificationWebSocketService) {
      return;
    }

    // Subscribe to notifications
    notificationWebSocketService.subscribeToNotifications();

    // Define handlers
    const handleNotification = (payload: NotificationPayload) => {
      setNotifications(prev => [...prev, payload]);
    };

    const handleError = (err: any) => {
      setError(err?.message || 'Notification WebSocket error');
    };

    // Store handlers in ref for cleanup
    handlersRef.current = { handleNotification, handleError };

    // Subscribe to events
    notificationWebSocketService.onNotification(handleNotification);
    notificationWebSocketService.onError(handleError);

    // Proper cleanup
    return () => {
      if (handlersRef.current.handleNotification) {
        notificationWebSocketService.off('notification', handlersRef.current.handleNotification);
      }
      if (handlersRef.current.handleError) {
        notificationWebSocketService.off('error', handlersRef.current.handleError);
      }
      // Don't unsubscribe immediately - let WebSocket manage its own lifecycle
    };
  }, [isAuthenticated, notificationWebSocketService]);

  return {
    data: notifications,
    loading: !isAuthenticated || !notificationWebSocketService,
    error,
  };
}

// Hook for fetching all users
export function useAllUsers(filters?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }

    const normalizedFilters = {
      page: filters?.page || 1,
      limit: Math.min(filters?.limit || 20, 20), // Cap at 20 to reduce memory
      search: filters?.search || undefined,
    };

    return apiClient.User.getAllUsers(normalizedFilters);
  }, [apiClient, accessToken, filters?.page, filters?.limit, filters?.search]);

  return useApi<GetUsersResponse>(
    isAuthenticated ? apiCall : null,
    [filters?.page, filters?.limit, filters?.search],
    { immediate: isAuthenticated, showErrorToast: true, cacheTime: 10 * 60 * 1000 }
  );
}

// Hook for unread message count
export function useUnreadCount() {
  const { accessToken, isAuthenticated } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    return apiClient.Message.getUnreadCount();
  }, [apiClient, accessToken]);

  return useApi<{ count: number }>(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
}

export function useClearApiCache() {
  return useCallback(() => {
    requestCache.clear();
    activeRequests.clear();
  }, []);
}