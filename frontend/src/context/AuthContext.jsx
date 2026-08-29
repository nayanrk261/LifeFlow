import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lifeflow_token'));
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize user session on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('lifeflow_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          setToken(storedToken);
          // Fetch profile
          try {
            const prof = await api.getProfile();
            setProfile(prof);
          } catch (e) {
            console.error('Failed to load profile:', e);
          }
        } catch (err) {
          console.warn('Invalid token session, clearing:', err.message);
          localStorage.removeItem('lifeflow_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('lifeflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(false);

    try {
      const prof = await api.getProfile();
      setProfile(prof);
    } catch (e) {
      console.error('Profile fetch failed:', e);
    }

    return res.user;
  };

  const signup = async (name, email, password, confirmPassword) => {
    const res = await api.signup({ name, email, password, confirmPassword });
    localStorage.setItem('lifeflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(false);

    try {
      const prof = await api.getProfile();
      setProfile(prof);
    } catch (e) {
      console.error('Profile fetch failed:', e);
    }

    return res.user;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('lifeflow_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setIsDemo(false);
  }, []);

  const enterDemo = useCallback(() => {
    setIsDemo(true);
    setUser({
      id: 'demo-rahul',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@demo.com',
      onboardingCompleted: true,
    });
    setProfile({
      firstName: 'Rahul',
      lastName: 'Sharma',
      age: 21,
      state: 'Maharashtra',
      occupation: 'Student',
      ownsVehicle: true,
      studying: true,
      hasPassport: false,
      hasDrivingLicence: true,
    });
  }, []);

  const updateUserProfile = async (profileData) => {
    if (isDemo) {
      setProfile(prev => ({ ...prev, ...profileData }));
      return profileData;
    }
    const updated = await api.updateProfile(profileData);
    setProfile(updated);
    if (profileData.onboardingCompleted !== undefined) {
      setUser(prev => ({ ...prev, onboardingCompleted: profileData.onboardingCompleted }));
    }
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isDemo,
        loading,
        isAuthenticated: !!user || isDemo,
        login,
        signup,
        logout,
        enterDemo,
        updateUserProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
