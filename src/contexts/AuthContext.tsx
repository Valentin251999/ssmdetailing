import React, { createContext, useContext, useState } from 'react';

const ADMIN_PASSWORD = 'Admin12345!';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading] = useState(false);

  const signIn = async (password: string) => {
    try {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        return { error: null };
      } else {
        return { error: new Error('Parolă incorectă') };
      }
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
