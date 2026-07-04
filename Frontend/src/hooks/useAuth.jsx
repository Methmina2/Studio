import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');
    if (storedToken) {
      setToken(storedToken);
      setAdmin(storedAdmin ? JSON.parse(storedAdmin) : null);
    }
    setLoading(false);
  }, []);

  const login = useCallback((token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setToken(token);
    setAdmin(adminData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setToken(null);
    setAdmin(null);
    navigate('/'); // ← now redirects to home page
  }, [navigate]);

  const isAuthenticated = !!token;

  return { token, admin, login, logout, isAuthenticated, loading };
};