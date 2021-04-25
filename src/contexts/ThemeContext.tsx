import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import Head from 'next/head';

type ThemeContextData = {
  currentTheme: 'light' | 'dark';
  toggleTheme(): void;
}

export const ThemeContext = createContext({} as ThemeContextData);

export const ThemeContextProvider: React.FC = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      toggleTheme,
    }}>
      <>
        <Head>
          {currentTheme === 'dark' ? (
            <link
              rel="stylesheet"
              type="text/css"
              href="/theme.dark.css"
            />
          ) : (
            <link
              rel="stylesheet"
              type="text/css"
              href="/theme.light.css"
            />
          )}
        </Head>
        {children}
      </>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
}