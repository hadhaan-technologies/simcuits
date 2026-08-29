import axios from 'axios';
import { useContext, useEffect, useState, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/refresh', {
          withCredentials: true,
        });

        const authData = {
          accessToken: res.data.accessToken,
          role: res.data.user.role,
          user: res.data.user,
        };

        // Store access token so other API clients can use it
        localStorage.setItem('accessToken', res.data.accessToken);

        setAuth(authData);
      } catch (error) {
        localStorage.removeItem('accessToken');
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return <AuthContext.Provider value={{ auth, setAuth, loading }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
