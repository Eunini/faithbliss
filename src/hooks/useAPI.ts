/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hooks for API integration - CLEANED VERSION
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import API from '@/services/api';
import wsService from '@/services/websocket';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
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
    if (immediate) {
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

// Hook for user data
export function useUser() {
  const { data: session } = useSession();
  
  return useApi(
    () => API.User.getMe(),
    [session?.user?.email],
    { immediate: !!session?.user }
  );
}

// Hook for potential matches
export function usePotentialMatches() {
  const { data: session } = useSession();
  
  return useApi(
    () => API.Match.getPotentialMatches(),
    [session?.user?.email],
    { immediate: !!session?.user }
  );
}

// Hook for user matches
export function useMatches() {
  const { data: session } = useSession();
  
  return useApi(
    () => API.Match.getMatches(),
    [session?.user?.email],
    { immediate: !!session?.user }
  );
}

// Hook for conversations
export function useConversations() {
  const { data: session } = useSession();
  
  return useApi(
    () => API.Message.getConversations(),
    [session?.user?.email],
    { immediate: !!session?.user }
  );
}

// Hook for conversation messages
export function useConversationMessages(conversationId: string) {
  const { data: session } = useSession();
  
  return useApi(
    () => API.Message.getMessages(conversationId),
    [session?.user?.email, conversationId],
    { immediate: !!session?.user && !!conversationId }
  );
}

// Hook for community posts
export function useCommunityPosts() {
  const { data: session } = useSession();
  
  return useApi(
    () => API.Community.getPosts(),
    [session?.user?.email],
    { immediate: !!session?.user }
  );
}

// Hook for discovery stats
export function useDiscoveryStats() {
  const { data: session } = useSession();
  
  return useApi(
    () => API.Discovery.getStats(),
    [session?.user?.email],
    { immediate: !!session?.user, showErrorToast: false }
  );
}

// Hook for WebSocket connection
export function useWebSocket() {
  const { data: session } = useSession();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (session?.user) {
      wsService.connect().then(() => {
        setConnected(wsService.isConnected());
      });

      return () => {
        wsService.disconnect();
        setConnected(false);
      };
    }
  }, [session?.user]);

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

// Hook for liking/passing users
export function useMatching() {
  const { showSuccess, showError } = useToast();

  const likeUser = useCallback(async (userId: string) => {
    try {
      const result = await API.Match.likeUser(userId);
      showSuccess(result.isMatch ? '💕 It\'s a match!' : '👍 Like sent!');
      return result;
    } catch (error) {
      showError('Failed to like user', 'Error');
      throw error;
    }
  }, [showSuccess, showError]);

  const passUser = useCallback(async (userId: string) => {
    try {
      await API.Match.passUser(userId);
      return true;
    } catch (error) {
      showError('Failed to pass user', 'Error');
      throw error;
    }
  }, [showError]);

  return { likeUser, passUser };
}

// Hook for sending messages
export function useMessaging() {
  const { showError } = useToast();

  const sendMessage = useCallback(async (matchId: string, content: string) => {
    try {
      const message = await API.Message.sendMessage({ matchId, content });
      return message;
    } catch (error) {
      showError('Failed to send message', 'Error');
      throw error;
    }
  }, [showError]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await API.Message.markAsRead(messageId);
      return true;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      return false;
    }
  }, []);

  return { sendMessage, markAsRead };
}

// Hook for profile updates
export function useProfileUpdate() {
  const { showSuccess, showError } = useToast();

  const updateProfile = useCallback(async (profileData: {
    name?: string;
    bio?: string;
    age?: number;
    denomination?: string;
    interests?: string[];
  }) => {
    try {
      const updatedUser = await API.User.updateMe(profileData);
      showSuccess('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      showError('Failed to update profile', 'Error');
      throw error;
    }
  }, [showSuccess, showError]);

  const uploadPhotos = useCallback(async (photos: File[]) => {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photo${index + 1}`, photo);
      });

      const results = await API.User.uploadPhotos(formData);
      showSuccess('Photos uploaded successfully!');
      return results;
    } catch (error) {
      showError('Failed to upload photos', 'Error');
      throw error;
    }
  }, [showSuccess, showError]);

  return { updateProfile, uploadPhotos };
}

// Hook for community interactions
export function useCommunityActions() {
  const { showSuccess, showError } = useToast();

  const createPost = useCallback(async (content: string, imageUrl?: string) => {
    try {
      const post = await API.Community.createPost({ content, imageUrl });
      showSuccess('Post created successfully!');
      return post;
    } catch (error) {
      showError('Failed to create post', 'Error');
      throw error;
    }
  }, [showSuccess, showError]);

  const likePost = useCallback(async (postId: string) => {
    try {
      await API.Community.likePost(postId);
    } catch (error) {
      showError('Failed to like post', 'Error');
      throw error;
    }
  }, [showError]);

  const createPrayerRequest = useCallback(async (title: string, content: string) => {
    try {
      const prayer = await API.Community.createPrayerRequest({ title, content });
      showSuccess('Prayer request submitted!');
      return prayer;
    } catch (error) {
      showError('Failed to submit prayer request', 'Error');
      throw error;
    }
  }, [showSuccess, showError]);

  return { createPost, likePost, createPrayerRequest };
}

// Hook for completing onboarding
export function useOnboarding() {
  const { showSuccess, showError } = useToast();

  const completeOnboarding = useCallback(async (
    onboardingData: {
      education: string;
      occupation: string;
      location: string;
      latitude: number;
      longitude: number;
      denomination: string;
      churchAttendance: string;
      baptismStatus: string;
      spiritualGifts: string[];
      interests: string[];
      relationshipGoals: string;
      lifestyle: string;
      bio: string;
    },
    updateSession: (data?: any) => Promise<any>
  ) => {
    try {
      const result = await API.Auth.completeOnboarding(onboardingData);
      
      // Update the session and wait for it to complete
      await updateSession({ onboardingCompleted: true });

      // Add a small delay to allow session to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      showSuccess('Profile setup complete! Welcome to FaithBliss! 🎉', 'Ready to Find Love');
      return result;
    } catch (error) {
      showError('Failed to complete profile setup. Please try again.', 'Setup Error');
      throw error;
    }
  }, [showSuccess, showError]);

  return { completeOnboarding };
}