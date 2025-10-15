/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hooks for API integration - REFACTORED FOR CLIENT-SIDE
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { getApiClient } from '@/services/api-client';
import wsService from '@/services/websocket';
import { useRequireAuth } from './useAuth';
import { useRouter } from 'next/navigation';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Types for messaging
import { Message } from '@/types/chat';

interface ConversationSummary {
  id: string; // matchId
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string; // ISO date string
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: (() => Promise<T>) | null, // Allow null for conditional calls
  dependencies: unknown[] = [],
  options: {
    immediate?: boolean;
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
  } = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { showError, showSuccess } = useToast();
  const router = useRouter();
  const { immediate = true, showErrorToast = true, showSuccessToast = false } = options;

  const execute = useCallback(async () => {
    if (!apiCall) {
      // If there's no apiCall function (e.g., no token yet), do nothing.
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });

      if (showSuccessToast) {
        showSuccess('Operation completed successfully');
      }

      return data;
    } catch (error: any) {
      // Check for auth error and redirect
      if (error.statusCode === 401) {
        showError('Your session has expired. Please log in again.', 'Authentication Error');
        router.push('/login');
        return; // Stop further execution
      }

      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      if (showErrorToast) {
        showError(errorMessage, 'API Error');
      }

      throw error;
    }
  }, [apiCall, showError, showSuccess, showErrorToast, showSuccessToast, router]);

  useEffect(() => {
    if (immediate && apiCall) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, execute, ...dependencies]);

  return {
    ...state,
    execute,
    refetch: execute,
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

  return useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
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
    { immediate: isAuthenticated }
  );
}

// Hook for matches
export function useMatches() {
  const { accessToken, isAuthenticated } = useRequireAuth();

  // For now, return mock data until backend endpoint is available
  const mockMatches: any[] = [
    {
      id: 'match-1',
      matchedUserId: 'user-1',
      matchedUser: {
        id: 'user-1',
        name: 'Sarah Johnson',
        age: 26,
        location: { address: 'Lagos, Nigeria' },
        denomination: 'Pentecostal',
        profilePhotos: { photo1: '/default-avatar.png' },
        isActive: true
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'match-2',
      matchedUserId: 'user-2',
      matchedUser: {
        id: 'user-2',
        name: 'David Chen',
        age: 29,
        location: { address: 'Abuja, Nigeria' },
        denomination: 'Catholic',
        profilePhotos: { photo1: '/default-avatar.png' },
        isActive: false
      },
      createdAt: new Date().toISOString()
    }
  ];

  return useApi(
    isAuthenticated ? () => Promise.resolve(mockMatches) : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
}

// Hook for liking/passing users
export function useMatching() {
  const { accessToken } = useRequireAuth();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  const { showSuccess, showError } = useToast();

  const likeUser = useCallback(async (userId: string) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      const result = await apiClient.Match.likeUser(userId);
      showSuccess(result.isMatch ? '💕 It\'s a match!' : '👍 Like sent!');
      return result;
    } catch (error) {
      showError('Failed to like user', 'Error');
      throw error;
    }
  }, [apiClient, showSuccess, showError, accessToken]);

  const passUser = useCallback(async (userId: string) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      await apiClient.Match.passUser(userId);
      return true;
    } catch (error) {
      showError('Failed to pass user', 'Error');
      throw error;
    }
  }, [apiClient, showError, accessToken]);

  return { likeUser, passUser };
}

// Hook for completing onboarding
export function useOnboarding() {
  const { accessToken } = useRequireAuth();
  const { update: updateSession } = useSession(); // Rename to avoid conflict
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  const { showSuccess, showError } = useToast();

  const completeOnboarding = useCallback(async (
    onboardingData: FormData
  ) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      const result = await apiClient.Auth.completeOnboarding(onboardingData);
      
      // Update the session to reflect onboarding completion and new profile picture
      await updateSession({ 
        onboardingCompleted: true,
        picture: result.profilePhotos?.photo1 // Assuming the backend returns the new user data with photo URLs
      });

      // Add a small delay to allow session to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      showSuccess('Profile setup complete! Welcome to FaithBliss! 🎉', 'Ready to Find Love');
      return result;
    } catch (error) {
      showError('Failed to complete profile setup. Please try again.', 'Setup Error');
      throw error;
    }
  }, [apiClient, showSuccess, showError, updateSession, accessToken]);

  return { completeOnboarding };
}

// Hook for WebSocket connection
export function useWebSocket() {
  const { user } = useRequireAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (user?.id) {
      wsService.connect().then(() => {
        setConnected(wsService.isConnected());
      });

      return () => {
        wsService.disconnect();
        setConnected(false);
      };
    }
  }, [user?.id]);

  return {
    connected,
    joinMatch: wsService.joinMatch.bind(wsService),
    leaveMatch: wsService.leaveMatch.bind(wsService),
    sendMessage: wsService.sendMessage.bind(wsService),
    sendTyping: wsService.sendTyping.bind(wsService),
    onMessage: wsService.onMessage.bind(wsService),
    onTyping: wsService.onTyping.bind(wsService),
    onUnreadCount: wsService.onUnreadCount.bind(wsService),
    onNotification: wsService.onNotification.bind(wsService),
    onError: wsService.onError.bind(wsService),
    off: wsService.off.bind(wsService),
  };
}

// Hook for conversations
export function useConversations() {
  const { accessToken, isAuthenticated } = useRequireAuth();

  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    return apiClient.Message.getConversations();
  }, [apiClient, accessToken]);

  return useApi(
    isAuthenticated ? apiCall : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
}



// Hook for conversation messages
export function useConversationMessages(matchId: string) {
  const { accessToken, isAuthenticated } = useRequireAuth();

  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);

  const apiCall = useCallback(() => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    return apiClient.Message.getMatchMessages(matchId);
  }, [apiClient, accessToken, matchId]);

  return useApi(
    isAuthenticated && matchId ? apiCall : null,
    [accessToken, isAuthenticated, matchId],
    { immediate: !!(isAuthenticated && matchId) }
  );
}