import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: number;
  google_id: string;
  email: string;
  name: string;
  picture: string;
  received_initial_bonus: number | boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  markBonusClaimed: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('workshop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // ユーザー情報が更新されたらローカルストレージにも保存する
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('workshop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('workshop_user');
    }
  }, [user]);

  const markBonusClaimed = () => {
    setUser(prev => prev ? { ...prev, received_initial_bonus: 1 } : null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, markBonusClaimed }}>
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
