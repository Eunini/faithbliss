// services/api.ts - Comprehensive API service for all backend endpoints
import { getSession, getCsrfToken } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faithbliss-backend.fly.dev';
//  API Information & Health Check Endpoints

export const SystemAPI = {
  // Get API information
  getApiInfo: async (): Promise<{
    name: string;
    version: string;
    description: string;
    endpoints: Record<string, string>;
  }> => {
    return apiRequest('/api', { method: 'GET' }, false);
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    return apiRequest('/api/health', { method: 'GET' }, false);
  },
};

// Types for API responses
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface User {
  id: string;
  email: string;
  name: string;
  profilePhotos?: {
    photo1?: string;
    photo2?: string;
    photo3?: string;
  };
  preferences?: UserPreferences;
  onboardingCompleted?: boolean;
  isActive?: boolean;
  bio?: string;
  age?: number;
  denomination?: string;
  interests?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface UserPreferences {
  ageRange: [number, number];
  maxDistance: number;
  denomination?: string;
  interests?: string[];
}

interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: string;
  user?: User;
  matchedUser?: User;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  matchId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}

interface Conversation {
  matchId: string;
  match: Match;
  lastMessage?: Message;
  unreadCount: number;
}

interface CommunityPost {
  id: string;
  authorId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: User;
  isLiked?: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  organizerId: string;
  attendeesCount: number;
  createdAt: string;
  organizer: User;
  isJoined?: boolean;
}

interface PrayerRequest {
  id: string;
  userId: string;
  title: string;
  content: string;
  prayersCount: number;
  createdAt: string;
  user: User;
  hasPrayed?: boolean;
}

interface BlessingEntry {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

interface PotentialMatch {
  id: string;
  name: string;
  age: number;
  profilePhotos?: {
    photo1?: string;
    photo2?: string;
    photo3?: string;
  };
  bio?: string;
  denomination?: string;
  interests?: string[];
  distance?: number;
}

interface MatchResult {
  isMatch: boolean;
  matchId?: string;
  message?: string;
}

interface TokenDebugInfo {
  userId: string;
  email: string;
  isValid: boolean;
  expiresAt: string;
}

interface UserPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: string;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    // Workaround to force a session refetch by calling getCsrfToken
    // This ensures we have the latest session data, including a refreshed token.
    await getCsrfToken();
    const session = await getSession();
    
    // If the session has a refresh error, the token is invalid.
    // Force a sign-out to clear the session and redirect to login.
    if (session?.error === "RefreshAccessTokenError") {
      console.error("Refresh token failed. Forcing sign out.");
      // Use next-auth/react's signOut to clear the session
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/login" });
      return null;
    }
    
    if (!session?.accessToken) {
      console.warn('No access token found in session');
      return null;
    }
    
    return session.accessToken as string;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Generic API request function
const apiRequest = async <T = unknown>(
  endpoint: string, 
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if required
  if (requireAuth) {
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (requireAuth) {
      console.error('Auth token required but not available');
      const authError = new Error('Authentication required') as Error & {
        statusCode: number;
        isAuthError: boolean;
      };
      authError.statusCode = 401;
      authError.isAuthError = true;
      throw authError;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Send cookies with the request
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
      
      // Create a more detailed error object
      const apiError = new Error(errorMessage) as Error & {
        statusCode: number;
        endpoint: string;
        isNetworkError: boolean;
        isCorsError: boolean;
      };
      
      apiError.statusCode = response.status;
      apiError.endpoint = endpoint;
      apiError.isNetworkError = false;
      apiError.isCorsError = false;
      
      throw apiError;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    }
    
    return response as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    
    // Enhance error with additional context for better user messaging
    if (error instanceof Error) {
      const enhancedError = error as Error & {
        statusCode?: number;
        endpoint: string;
        isNetworkError: boolean;
        isCorsError: boolean;
        isAuthError: boolean;
      };
      
      if (!enhancedError.statusCode) {
        enhancedError.endpoint = endpoint;
        enhancedError.isNetworkError = true;
        
        // Improved CORS error detection
        const errorMessage = error.message.toLowerCase();
        const isCorsError = errorMessage.includes('cors') || 
                           errorMessage.includes('access-control-allow-origin') ||
                           errorMessage.includes('preflight') ||
                           (errorMessage.includes('failed to fetch') && navigator.onLine !== false);
        
        if (isCorsError) {
          enhancedError.isCorsError = true;
          enhancedError.message = 'Server connection blocked. This appears to be a server configuration issue.';
        } else if (errorMessage.includes('networkerror') || errorMessage.includes('failed to fetch')) {
          enhancedError.message = 'Network connection failed. Please check your internet connection.';
        }
      } else if (enhancedError.statusCode === 401) {
        // Handle JWT token expiration
        enhancedError.isAuthError = true;
        if (error.message.includes('Invalid or expired token')) {
          enhancedError.message = 'Your session has expired. Please sign in again.';
        }
      }
    }
    
    throw error;
  }
};

// 🔐 Authentication Endpoints
export const AuthAPI = {
  // Register a new user
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    age: number;
  }): Promise<AuthTokens> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthTokens> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
  },

  // Refresh JWT token
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }, false);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    return apiRequest('/auth/logout-all', {
      method: 'POST',
    });
  },

  // Complete user onboarding
  completeOnboarding: async (onboardingData: {
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
  }): Promise<User> => {
    return apiRequest('/auth/complete-onboarding', {
      method: 'PUT',
      body: JSON.stringify(onboardingData),
    });
  },

  // Google OAuth token exchange
  googleAuth: async (googleData: {
    email: string;
    name: string;
    picture: string;
    googleId: string;
  }): Promise<AuthTokens> => {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    }, false);
  },

  // Debug: Check if user exists (for testing only)
  debugUser: async (email: string): Promise<{ exists: boolean; user?: User }> => {
    return apiRequest(`/auth/debug/user/${encodeURIComponent(email)}`, {
      method: 'GET',
    }, false);
  },

  // Initiate Google OAuth login
  initiateGoogleAuth: async (): Promise<{ authUrl: string }> => {
    return apiRequest('/auth/google', {
      method: 'GET',
    }, false);
  },
};

// 👤 User Management API
export const UserAPI = {
  // Debug token endpoint
  debugToken: async (): Promise<TokenDebugInfo> => {
    return apiRequest('/users/debug');
  },

  // Get current user profile
  getMe: async (): Promise<User> => {
    return apiRequest('/users/me');
  },

  // Update current user profile
  updateMe: async (userData: {
    name?: string;
    bio?: string;
    age?: number;
    denomination?: string;
    interests?: string[];
  }): Promise<User> => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get user preferences
  getPreferences: async (): Promise<UserPreferences> => {
    return apiRequest('/users/me/preferences');
  },

  // Update user preferences
  updatePreferences: async (preferences: UserPreferences): Promise<UserPreferences> => {
    return apiRequest('/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  // Deactivate user account
  deactivateAccount: async (): Promise<void> => {
    return apiRequest('/users/me/deactivate', {
      method: 'POST',
    });
  },

  // Reactivate user account
  reactivateAccount: async (): Promise<void> => {
    return apiRequest('/users/me/reactivate', {
      method: 'POST',
    });
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    return apiRequest(`/users/${id}`);
  },

  // Search users with advanced filters
  searchUsers: async (params: {
    age_min?: number;
    age_max?: number;
    denomination?: string;
    interests?: string[];
    location?: string;
    radius?: number;
  }): Promise<User[]> => {
    return apiRequest(`/users/search/advanced?${new URLSearchParams(params as Record<string, string>)}`);
  },

  // Get all users with optional filters
  getAllUsers: async (filters?: {
    limit?: number;
    offset?: number;
    active?: boolean;
  }): Promise<User[]> => {
    const query = filters ? `?${new URLSearchParams(filters as Record<string, string>)}` : '';
    return apiRequest(`/users${query}`);
  },

  // Upload multiple photos
  uploadPhotos: async (photos: FormData): Promise<UserPhoto[]> => {
    return apiRequest('/users/me/photos', {
      method: 'POST',
      body: photos,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Upload specific photo by number
  uploadSpecificPhoto: async (photoNumber: number, photo: FormData): Promise<UserPhoto> => {
    return apiRequest(`/users/me/photo/${photoNumber}`, {
      method: 'POST',
      body: photo,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// 💕 Matching API
export const MatchAPI = {
  // Get user's matches
  getMatches: async (): Promise<Match[]> => {
    return apiRequest('/matches');
  },

  // Get potential matches for user
  getPotentialMatches: async (): Promise<User[]> => {
    return apiRequest('/matches/potential');
  },

  // Like a user
  likeUser: async (userId: string): Promise<MatchResult> => {
    return apiRequest(`/matches/like/${userId}`, {
      method: 'POST',
    });
  },

  // Pass on a user
  passUser: async (userId: string): Promise<void> => {
    return apiRequest(`/matches/pass/${userId}`, {
      method: 'POST',
    });
  },
};

// 💬 Messaging API
export const MessageAPI = {
  // Get user conversations
  getConversations: async (): Promise<Conversation[]> => {
    return apiRequest('/messages/conversations');
  },

  // Get unread message count
  getUnreadCount: async (): Promise<{ count: number }> => {
    return apiRequest('/messages/unread-count');
  },

  // Send a message
  sendMessage: async (messageData: {
    matchId: string;
    content: string;
  }): Promise<Message> => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Get messages for a match
  getMessages: async (matchId: string): Promise<Message[]> => {
    return apiRequest(`/messages/match/${matchId}`);
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<void> => {
    return apiRequest(`/messages/${messageId}/read`, {
      method: 'PATCH',
    });
  },
};

// 🏛️ Community API
export const CommunityAPI = {
  // Posts
  createPost: async (postData: {
    content: string;
    imageUrl?: string;
  }): Promise<CommunityPost> => {
    return apiRequest('/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  getPosts: async (): Promise<CommunityPost[]> => {
    return apiRequest('/community/posts');
  },

  likePost: async (postId: string): Promise<void> => {
    return apiRequest(`/community/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  unlikePost: async (postId: string): Promise<void> => {
    return apiRequest(`/community/posts/${postId}/like`, {
      method: 'DELETE',
    });
  },

  commentOnPost: async (postId: string, comment: {
    content: string;
  }): Promise<Comment> => {
    return apiRequest(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },

  // Events
  createEvent: async (eventData: {
    title: string;
    description: string;
    dateTime: string;
    location: string;
  }): Promise<CommunityEvent> => {
    return apiRequest('/community/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  getEvents: async (): Promise<CommunityEvent[]> => {
    return apiRequest('/community/events');
  },

  joinEvent: async (eventId: string): Promise<void> => {
    return apiRequest(`/community/events/${eventId}/join`, {
      method: 'POST',
    });
  },

  leaveEvent: async (eventId: string): Promise<void> => {
    return apiRequest(`/community/events/${eventId}/join`, {
      method: 'DELETE',
    });
  },

  // Prayers
  createPrayerRequest: async (prayerData: {
    title: string;
    content: string;
  }): Promise<PrayerRequest> => {
    return apiRequest('/community/prayers', {
      method: 'POST',
      body: JSON.stringify(prayerData),
    });
  },

  getPrayerRequests: async (): Promise<PrayerRequest[]> => {
    return apiRequest('/community/prayers');
  },

  prayForRequest: async (prayerRequestId: string): Promise<void> => {
    return apiRequest(`/community/prayers/${prayerRequestId}/pray`, {
      method: 'POST',
    });
  },

  // Blessings
  createBlessing: async (blessingData: {
    content: string;
  }): Promise<BlessingEntry> => {
    return apiRequest('/community/bless', {
      method: 'POST',
      body: JSON.stringify(blessingData),
    });
  },

  getBlessings: async (): Promise<BlessingEntry[]> => {
    return apiRequest('/community/bless');
  },

  // Highlights
  getHighlights: async (): Promise<CommunityPost[]> => {
    return apiRequest('/community/highlights');
  },
};

// 🔍 Discovery API
export const DiscoveryAPI = {
  getNearbyUsers: async (params?: {
    radius?: number;
    age_min?: number;
    age_max?: number;
    denomination?: string;
    interests?: string[];
  }): Promise<User[]> => {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    return apiRequest(`/discover/nearby${query}`);
  },

  getUsersByVerse: async (verse: string): Promise<User[]> => {
    return apiRequest(`/discover/verse/${encodeURIComponent(verse)}`);
  },

  getUsersByInterest: async (interest: string): Promise<User[]> => {
    return apiRequest(`/discover/interest/${encodeURIComponent(interest)}`);
  },

  getActiveUsers: async (): Promise<User[]> => {
    return apiRequest('/discover/active');
  },

  getActiveTodayUsers: async (): Promise<User[]> => {
    return apiRequest('/discover/active-today');
  },

  getStats: async (): Promise<{ totalUsers: number; activeToday: number; totalMatches: number }> => {
    return apiRequest('/discover/stats');
  },

  getDailyChallenge: async (): Promise<{ challenge: string; verse: string; date: string }> => {
    return apiRequest('/discover/challenge');
  },
};

// Export all APIs
export const API = {
  System: SystemAPI,
  Auth: AuthAPI,
  User: UserAPI,
  Match: MatchAPI,
  Message: MessageAPI,
  Community: CommunityAPI,
  Discovery: DiscoveryAPI,
};

// Export types
export type {
  User,
  UserPreferences,
  Match,
  Message,
  Conversation,
  CommunityPost,
  CommunityEvent,
  PrayerRequest,
  BlessingEntry,
  PotentialMatch,
  AuthTokens,
  ApiResponse,
  ApiError,
};

export default API;