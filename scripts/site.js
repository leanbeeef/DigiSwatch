// site.js

/* *********************************
   Theme Management Module
********************************* */

const ThemeManager = (() => {
    const defaultTheme = 'theme-light';

    // Function to apply the selected theme
    const applyTheme = (theme) => {
        // Remove existing theme classes
        document.body.classList.remove('theme-light', 'theme-dark');
        // Add the new theme class
        document.body.classList.add(theme);
        // Save the selected theme to localStorage
        localStorage.setItem('theme', theme);
        // Dispatch a custom event if needed
        const event = new CustomEvent('themeChange', { detail: { theme } });
        window.dispatchEvent(event);
    };

    // Function to initialize the theme on page load
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || defaultTheme;
        applyTheme(savedTheme);
        // Set the theme selector value if it exists
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = savedTheme;
        }
    };

    return {
        applyTheme,
        initTheme,
    };
})();

/* *********************************
   Initialization on Page Load
********************************* */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    ThemeManager.initTheme();

    // Attach event listener to theme selector if it exists
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            ThemeManager.applyTheme(e.target.value);
        });
    }
});
