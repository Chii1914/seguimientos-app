'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const TokenContext = createContext<string | null>(null);

export const useAccessToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setToken(res.data.accessToken))
      .catch(() => setToken(null));
  }, []);

  return (
    <TokenContext.Provider value={token}>
      {children}
    </TokenContext.Provider>
  );
};
