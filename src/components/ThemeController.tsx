"use client";

import React from 'react';
import { useEffect, useState } from 'react';

const SYSTEM_THEMES = ['light', 'dark'] as const;
const CUSTOM_THEMES = [
  'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk',
  'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy',
  'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid',
  'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset'
] as const;

type SystemTheme = typeof SYSTEM_THEMES[number];
type CustomTheme = typeof CUSTOM_THEMES[number];
type Theme = SystemTheme | CustomTheme;

const ThemeController = () => {
  const [mounted, setMounted] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [systemTheme, setSystemTheme] = useState<SystemTheme>('dark');
  const [customTheme, setCustomTheme] = useState<CustomTheme>('synthwave');

  // Get current active theme
  const currentTheme = isSystemTheme ? systemTheme : customTheme;

  useEffect(() => {
    setMounted(true);
    // Load saved theme configuration
    const savedTheme = localStorage.getItem('theme');
    const savedIsSystem = localStorage.getItem('isSystemTheme');
    const savedSystemTheme = localStorage.getItem('lastSystemTheme') as SystemTheme || 'dark';

    if (savedTheme) {
      if (savedIsSystem === 'true') {
        setIsSystemTheme(true);
        setSystemTheme(savedTheme as SystemTheme);
      } else {
        setIsSystemTheme(false);
        setCustomTheme(savedTheme as CustomTheme);
        setSystemTheme(savedSystemTheme); // Keep track of last system theme
      }
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = isDark ? 'dark' : 'light';
      setSystemTheme(defaultTheme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
      localStorage.setItem('theme', defaultTheme);
      localStorage.setItem('isSystemTheme', 'true');
      localStorage.setItem('lastSystemTheme', defaultTheme);
    }
  }, []);

  const setTheme = (theme: Theme, isSystem: boolean = false) => {
    setIsSystemTheme(isSystem);
    if (isSystem) {
      setSystemTheme(theme as SystemTheme);
      localStorage.setItem('lastSystemTheme', theme as SystemTheme);
    } else {
      setCustomTheme(theme as CustomTheme);
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem('isSystemTheme', isSystem.toString());
    document.documentElement.setAttribute('data-theme', theme);
  };

  const toggleTheme = () => {
    if (!isSystemTheme) {
      // If in custom theme, switch back to last used system theme
      setTheme(systemTheme, true);
    } else {
      // If in system theme, toggle between light and dark
      const newTheme = systemTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme, true);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4">
      {/* Light/Dark Toggle */}
      <div>
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            checked={currentTheme === 'dark'}
            onChange={toggleTheme}
          />

          {/* Sun icon */}
          <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* Moon icon */}
          <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>

      {/* Theme Selector Dropdown */}
      <select
        className="select select-sm select-bordered w-40"
        value={currentTheme}
        onChange={(e) => {
          const newTheme = e.target.value as Theme;
          const isSystem = newTheme === 'light' || newTheme === 'dark';
          setTheme(newTheme, isSystem);
        }}
      >
        <optgroup label="System">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </optgroup>
        <optgroup label="Custom Themes">
          {CUSTOM_THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
};

export default ThemeController;
