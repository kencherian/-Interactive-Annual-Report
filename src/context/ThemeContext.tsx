import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isPrintPreview: boolean;
  togglePrintPreview: () => void;
  triggerPrint: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isPrintPreview, setIsPrintPreview] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' && !isPrintPreview) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme, isPrintPreview]);

  useEffect(() => {
    const root = document.documentElement;
    if (isPrintPreview) {
      root.classList.add('print-version');
    } else {
      root.classList.remove('print-version');
    }
  }, [isPrintPreview]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const togglePrintPreview = () => {
    setIsPrintPreview((prev) => !prev);
  };

  const triggerPrint = () => {
    // If not in print preview, we can either trigger directly or enable preview then print
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark' && !isPrintPreview,
        toggleTheme,
        setTheme,
        isPrintPreview,
        togglePrintPreview,
        triggerPrint,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
