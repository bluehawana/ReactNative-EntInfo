import React, { createContext, useContext } from 'react';
import { colors, spacing, typography, shadows, borderRadius } from './simple';

const ThemeContext = createContext({
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{
    colors,
    spacing,
    typography,
    shadows,
    borderRadius,
  }}>
    {children}
  </ThemeContext.Provider>
);
