'use client';

import { useState, useEffect } from 'react';

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return children;
} 