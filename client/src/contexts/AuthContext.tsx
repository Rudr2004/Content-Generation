import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthContextType, getAuthToken, setAuthToken, removeAuthToken, getAuthHeaders } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        removeAuthToken();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.token);
        setUser(data.user);
        toast({
          title: 'Success',
          description: 'Login successful',
        });
        return data; // Return success data instead of throwing
      } else {
        const errorMessage = data.message || 'Login failed';
        toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Only show toast for network errors if not already shown
      if (error instanceof Error && !error.message.includes('Login failed')) {
        toast({
          title: 'Login Failed',
          description: 'Network error. Please check your connection.',
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};