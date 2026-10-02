import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_ADMIN, DEMO_COORDINATOR, DEMO_MENTOR, DEMO_JUNIOR, ALL_INITIAL_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ananda_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    // Default to Super Admin for immediate executive dashboard demonstration
    return DEMO_ADMIN;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ananda_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ananda_current_user');
    }
  }, [currentUser]);

  const role = currentUser ? currentUser.role : 'junior';
  const isAuthenticated = !!currentUser;

  const login = (email: string, requestedRole?: UserRole): boolean => {
    // Find matching user from seed / local data
    const matched = ALL_INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return true;
    }
    // Fallback if entering demo shortcut role
    if (requestedRole === 'admin') setCurrentUser(DEMO_ADMIN);
    else if (requestedRole === 'coordinator') setCurrentUser(DEMO_COORDINATOR);
    else if (requestedRole === 'mentor') setCurrentUser(DEMO_MENTOR);
    else setCurrentUser(DEMO_JUNIOR);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    switch (newRole) {
      case 'admin':
        setCurrentUser(DEMO_ADMIN);
        break;
      case 'coordinator':
        setCurrentUser(DEMO_COORDINATOR);
        break;
      case 'mentor':
        setCurrentUser(DEMO_MENTOR);
        break;
      case 'junior':
        setCurrentUser(DEMO_JUNIOR);
        break;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role,
      isAuthenticated,
      login,
      logout,
      switchRole,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
