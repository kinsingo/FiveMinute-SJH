import React from 'react';

const ThemeModeContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export default ThemeModeContext;