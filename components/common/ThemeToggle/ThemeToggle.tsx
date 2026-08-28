"use client";

import { useEffect, useSyncExternalStore } from "react";
import css from "./ThemeToggle.module.css";

const THEME_CHANGE_EVENT = "traveltrucks-theme-change";

function getThemeSnapshot() {
  return localStorage.getItem("theme") === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    const theme = newIsDark ? "dark" : "light";

    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
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
