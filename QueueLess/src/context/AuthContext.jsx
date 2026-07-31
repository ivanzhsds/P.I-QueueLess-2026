import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, loginUser, logoutUser, registerUser, supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentSession()
      .then(({ data }) => {
        if (mounted) setUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    if (!supabase) {
      return () => { mounted = false; };
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(credentials) {
    const result = await loginUser(credentials);
    if (!result.error) setUser(result.data.user);
    return result;
  }

  async function signUp(credentials) {
    return registerUser(credentials);
  }

  function signOut() {
    return logoutUser();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}