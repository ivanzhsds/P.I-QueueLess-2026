import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/supabase';

const SESSION_KEY = 'queueless-session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem(SESSION_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  async function signIn(credentials) {
    const result = await loginUser(credentials);
    if (!result.error) setUser(result.data);
    return result;
  }

  async function signUp(credentials) {
    return registerUser(credentials);
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}