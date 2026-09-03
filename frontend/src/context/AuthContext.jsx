import axios from 'axios';
import { useContext, useEffect, useState, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const authData = {
          accessToken: res.data.accessToken,
          role: res.data.user.role,
          user: res.data.user,
        };

        // Store access token
        localStorage.setItem('accessToken', res.data.accessToken);

        setAuth(authData);
      } catch (error) {
        console.error('Auth refresh failed:', error.response?.data || error.message);

        localStorage.removeItem('accessToken');
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_URL]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
