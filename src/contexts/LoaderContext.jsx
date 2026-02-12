import { createContext, useState, useContext, useEffect } from 'react';
import { setApiLoader } from '@/services/api';

const LoaderContext = createContext({ isLoading: false, setIsLoading: () => {} });

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // register setter with api helper once
  useEffect(() => {
    setApiLoader(setIsLoading);
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/25 z-50 flex items-center justify-center">
          <div className="loader w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
