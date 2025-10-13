/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hooks for API integration - REFACTORED FOR CLIENT-SIDE
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { getApiClient } from '@/services/api-client';
import wsService from '@/services/websocket';
import { useRequireAuth } from './useAuth';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Types for messaging
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  matchId: string;
  match: {
    matchedUser: {
      id: string;
      name: string;
      profilePhotos?: {
        photo1?: string;
      };
    };
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      if (showErrorToast) {
        showError(errorMessage, 'API Error');
      }

      throw error;
    }
  }, [apiCall, showError, showSuccess, showErrorToast, showSuccessToast]);

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
  const { update } = useSession();
  const apiClient = useMemo(() => getApiClient(accessToken ?? null), [accessToken]);
  const { showSuccess, showError } = useToast();

  const completeOnboarding = useCallback(async (
    onboardingData: any
  ) => {
    if (!accessToken) {
      throw new Error('Authentication required. Please log in.');
    }
    try {
      const result = await apiClient.Auth.completeOnboarding(onboardingData);
      
      // Update the session to reflect onboarding completion
      await update({ onboardingCompleted: true });

      // Add a small delay to allow session to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      showSuccess('Profile setup complete! Welcome to FaithBliss! 🎉', 'Ready to Find Love');
      return result;
    } catch (error) {
      showError('Failed to complete profile setup. Please try again.', 'Setup Error');
      throw error;
    }
  }, [apiClient, showSuccess, showError, update, accessToken]);

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
    onMatchUpdate: wsService.onMatchUpdate.bind(wsService),
    off: wsService.off.bind(wsService),
  };
}

// Hook for conversations
export function useConversations() {
  const { accessToken, isAuthenticated } = useRequireAuth();

  // For now, return mock data until backend endpoint is available
  const mockConversations: Conversation[] = [
    {
      matchId: 'mock-match-1',
      match: {
        matchedUser: {
          id: 'user-1',
          name: 'Sarah Johnson',
          profilePhotos: {
            photo1: '/default-avatar.png'
          }
        }
      },
      lastMessage: {
        content: 'Hey! How are you doing?',
        createdAt: new Date().toISOString()
      },
      unreadCount: 2
    },
    {
      matchId: 'mock-match-2',
      match: {
        matchedUser: {
          id: 'user-2',
          name: 'Michael Chen',
          profilePhotos: {
            photo1: '/default-avatar.png'
          }
        }
      },
      lastMessage: {
        content: 'Thanks for the match!',
        createdAt: new Date().toISOString()
      },
      unreadCount: 0
    }
  ];

  return useApi(
    isAuthenticated ? () => Promise.resolve(mockConversations) : null,
    [accessToken, isAuthenticated],
    { immediate: isAuthenticated }
  );
}

// Hook for messaging
export function useMessaging() {
  const { showError } = useToast();

  const sendMessage = useCallback(async (matchId: string, content: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await apiClient.Message.sendMessage(matchId, { content });
      console.log('Sending message:', { matchId, content });
      return { success: true };
    } catch (error) {
      showError('Failed to send message', 'Error');
      throw error;
    }
  }, [showError]);

  return { sendMessage };
}

// Hook for conversation messages
export function useConversationMessages(matchId: string) {
  const { accessToken, isAuthenticated } = useRequireAuth();

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      content: 'Hi there! Nice to match with you.',
      senderId: 'other-user',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    },
    {
      id: 'msg-2',
      content: 'Thanks! You too. How has your day been?',
      senderId: 'current-user',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      isRead: true
    },
    {
      id: 'msg-3',
      content: 'It\'s been great! Just finished reading a good book.',
      senderId: 'other-user',
      createdAt: new Date(Date.now() - 900000).toISOString(),
      isRead: false
    }
  ];

  return useApi(
    isAuthenticated && matchId ? () => Promise.resolve(mockMessages) : null,
    [accessToken, isAuthenticated, matchId],
    { immediate: !!(isAuthenticated && matchId) }
  );
}