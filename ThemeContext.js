import React, { createContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { CombinedDefaultTheme, CombinedDarkTheme } from './themes'; // Import themes

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('automatic'); // 'dark', 'light', or 'automatic'

  const theme = useMemo(() => {
    if (themeMode === 'dark') return CombinedDarkTheme;
    if (themeMode === 'light') return CombinedDefaultTheme;
    return systemScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
