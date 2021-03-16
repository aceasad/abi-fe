import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Views from "./views";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { THEME_CONFIG } from "./configs/AppConfig";

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`
};

function App() {
  return (
    <div className="App">
      <ThemeSwitcherProvider
        themeMap={themes}
        defaultTheme={THEME_CONFIG.default}
        insertionPoint="styles-insertion-point"
      >
        <Router>
          <Views />
        </Router>
      </ThemeSwitcherProvider>
    </div>
  );
}

export default App;
