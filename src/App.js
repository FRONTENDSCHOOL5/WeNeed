import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import AppRouter from './routes/AppRouter';
import Theme from './styles/Theme'
function App() {
  return (
    <>
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
    </>
  );
}
export default App;