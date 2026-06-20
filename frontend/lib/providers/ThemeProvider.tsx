"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "organic" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("organic");

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "organic", "dark");
      root.classList.add(newTheme);
      localStorage.setItem("ecosphere-theme", newTheme);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("ecosphere-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("organic");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
