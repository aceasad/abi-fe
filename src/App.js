import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Views from './views';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { THEME_CONFIG } from './configs/AppConfig';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from 'redux/actions/Auth';
import { makeSelectIsAuthenticated } from 'redux/selectors/Auth';
import { QueryClient, QueryClientProvider } from 'react-query';

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(makeSelectIsAuthenticated());

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchUser());
  }, [dispatch, isAuthenticated]);

  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ThemeSwitcherProvider
          themeMap={themes}
          defaultTheme={THEME_CONFIG.currentTheme}
          insertionPoint="styles-insertion-point"
        >
          <Router>
            <Views />
          </Router>
        </ThemeSwitcherProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
