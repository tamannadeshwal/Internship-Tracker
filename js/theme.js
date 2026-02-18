/* ============================================================
   STUDENT INTERNSHIP & PROBLEM TRACKING SYSTEM
   Theme Toggle – theme.js
   Persists user preference in localStorage.
   ============================================================ */

(function () {
    'use strict';

    const STORAGE_KEY = 'interntrack-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    /** Apply theme to <html> element */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Update all toggle button icons on the page
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.textContent = theme === LIGHT ? '🌙' : '☀️';
            btn.title = theme === LIGHT ? 'Switch to Dark Mode' : 'Switch to Light Mode';
        });
    }

    /** Get saved theme, default to dark */
    function getSavedTheme() {
        return localStorage.getItem(STORAGE_KEY) || DARK;
    }

    /** Toggle between dark and light */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || DARK;
        const next = current === DARK ? LIGHT : DARK;
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    /** Initialise: apply saved theme and wire up ONE delegated listener */
    function init() {
        applyTheme(getSavedTheme());

        // Single delegated click listener — no double-registration possible
        document.addEventListener('click', function (e) {
            if (e.target.closest('.theme-toggle-btn')) {
                toggleTheme();
            }
        });
    }

    if (document.readyState === 'loading') {
        // Apply immediately to avoid flash, then finish wiring after DOM ready
        applyTheme(getSavedTheme());
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
