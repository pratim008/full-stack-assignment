import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const user = await db.users
      .where('username').equals(username)
      .and(u => u.password === password)
      .first();
    
    if (user) {
      const { password: _, ...safeUser } = user;
      sessionStorage.setItem('user', JSON.stringify(safeUser));
      setUser(safeUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const register = async (username, password) => {
    const exists = await db.users.where('username').equals(username).count();
    if (exists) return false;

    await db.users.add({
      username,
      password,
      isAdmin: 0,
      createdAt: new Date()
    });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);