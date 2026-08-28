"use client";

import { useEffect, useState } from "react";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;

    setIsDark(newIsDark);

    const theme = newIsDark ? "dark" : "light";

    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <button
      type="button"
      className={`${css.toggle} ${isDark ? css.dark : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
    >
      <span className={css.icon}>{isDark ? "☀" : "☾"}</span>
    </button>
  );
}
