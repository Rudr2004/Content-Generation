import { User } from "@shared/schema";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const hasRole = (user: AuthUser | null, allowedRoles: string[]): boolean => {
  return user ? allowedRoles.includes(user.role) : false;
};

export const canManageUsers = (user: AuthUser | null): boolean => {
  return hasRole(user, ['super_admin', 'user_admin']);
};

export const canCreateSuperAdmin = (user: AuthUser | null): boolean => {
  return hasRole(user, ['super_admin']);
};

export const canAccessCMS = (user: AuthUser | null): boolean => {
  return hasRole(user, ['super_admin', 'user_admin', 'content_admin']);
};