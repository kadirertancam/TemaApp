import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/user-service';
import { User } from '@shared/schema';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [initialized, setInitialized] = useState(false);
  
  // Fetch current user data if token exists
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getCurrentUser,
    enabled: initialized,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    // Check for existing auth on initial load
    setInitialized(true);
  }, []);
  
  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Refresh user data
      await refreshUserData();
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast({
        title: "Registration successful",
        description: "Account created successfully!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await userService.logout();
      // Invalidate all queries to refetch fresh data
      queryClient.invalidateQueries();
      toast({
        title: "Logout successful",
        description: "You've been logged out",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  // Function to refresh user data
  const refreshUserData = async (): Promise<void> => {
    await refetch();
  };
  
  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    refreshUserData,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
