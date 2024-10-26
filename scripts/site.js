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
   Language Management Module
********************************* */

const LanguageManager = (() => {
    const defaultLanguage = 'en';

    // Translation data
     const translations = {
        en: {
            title: 'Color Palette Generator',
            home: 'Home',
            extras: 'Extras',
            accessibility_checker: 'Accessibility Checker',
            choose_color: 'Choose a Base Color',
            choose_harmony: 'Choose a Color Harmony',
            select_palette: 'Select Palette',
            select_palette_description: 'Select a palette to see its description.',
            export_as: 'Export as:',
            select_format: 'Select format',
            export_palette: 'Export Palette',
            generate_random_palette: 'Generate Random Palette',
            select_popular_palette: 'Select a Popular Palette',
            color_harmony_visualizer: 'Color Harmony Visualizer',
            select_pattern: 'Select Pattern:',
            button_example: 'Button Example',
            text_example: 'Text Example',
            preview_text: 'This is a preview of your text.',
            adjust_color: 'Adjust Color',
            hue: 'Hue:',
            saturation: 'Saturation:',
            lightness: 'Lightness:',
            apply: 'Apply',
            default_theme: 'Default',
            light_theme: 'Light',
            dark_theme: 'Dark',
            english: 'English',
            spanish: 'Español',
            monochromatic: 'Monochromatic',
            analogous: 'Analogous',
            complementary: 'Complementary',
            split_complementary: 'Split Complementary',
            triadic: 'Triadic',
            tetradic: 'Tetradic',
            powerpoint_theme: 'PowerPoint Theme'
        },
        es: {
            title: "Generador de paleta de colores",
            home: "Casa",
            extras: "Extras",
            choose_color: 'Elegir un color base',
            choose_harmony: 'Elige una armonía de color',
            accessibility_checker: "Comprobador de accesibilidad",
            export_as: "Exportar como:",
            select_format: "Seleccionar formato",
            export_palette: "Exportar paleta",
            simulate_color_blindness: "Simular daltonismo:",
            generate_random_palette: 'Generar Paleta Aleatoria',
            select_popular_palette: 'Seleccionar una Paleta Popular',
            none: "Ninguno",
            monochromatic: "Monocromático",
            analogous: "Análogo",
            complementary: "Complementario",
            split_complementary: "Dividir Complementario",
            triadic: "Tríadico",
            tetradic: "Tetrádico",
            powerpoint_theme: "Tema de PowerPoint",
            select_palette_description: "Seleccione una paleta para ver su descripción.",
            color_harmony_visualizer: "Visualizador de armonía de color",
            select_pattern: "Seleccionar patrón:",
            button_example: "Ejemplo de botón",
            text_example: "Ejemplo de texto",
            preview_text: 'Esta es una vista previa de su texto.',
            popular_palettes: "Paletas populares",
            select_popular_palette: "Seleccione una paleta popular",
            generate_random_palette: "Generar paleta aleatoria",
            most_used_colors: "Colores más utilizados",
            adjust_color: "Ajustar color",
            hue: "Tono",
            saturation: "Saturación",
            lightness: "Ligereza",
            apply: "Aplicar",
            upload_image: "Subir imagen",
            english: "Inglés",
            spanish: "Español",
            french: 'Francés',
            default_theme: "Predeterminado",
            light_theme: "Luz",
            dark_theme: "Oscuro",
        },
        fr: {
            title: 'Générateur de Palette de Couleurs',
            home: 'Accueil',
            extras: 'Extras',
            accessibility_checker: 'Vérificateur d’Accessibilité',
            choose_color: 'Choisissez une Couleur de Base',
            generate_random_palette: 'Générer une palette aléatoire',
            select_popular_palette: 'Sélectionnez une palette populaire',
            choose_harmony: 'Choisissez une harmonie de couleurs',
            select_palette: 'Sélectionner une Palette',
            select_palette_description: 'Sélectionnez une palette pour voir sa description.',
            export_as: 'Exporter en tant que :',
            select_format: 'Sélectionner le format',
            export_palette: 'Exporter la Palette',
            color_harmony_visualizer: 'Visualiseur d’Harmonie des Couleurs',
            select_pattern: 'Sélectionner un Motif :',
            button_example: 'Exemple de Bouton',
            text_example: 'Exemple de Texte',
            preview_text: 'Ceci est un aperçu de votre texte.',
            adjust_color: 'Ajuster la Couleur',
            hue: 'Teinte :',
            saturation: 'Saturation :',
            lightness: 'Luminosité :',
            apply: 'Appliquer',
            default_theme: 'Par Défaut',
            light_theme: 'Clair',
            dark_theme: 'Sombre',
            english: 'Anglais',
            spanish: 'Espagnol',
            french: 'Français',
            monochromatic: 'Monochromatique',
            analogous: 'Analogues',
            complementary: 'Complémentaires',
            split_complementary: 'Complémentaires Divisés',
            triadic: 'Triadiques',
            tetradic: 'Tétradiques',
            powerpoint_theme: 'Thème PowerPoint'
        },        
        // Add more languages as needed
    };

    // Function to apply the selected language
    const applyLanguage = (language) => {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach((el) => {
            const key = el.getAttribute('data-translate');
            if (translations[language] && translations[language][key]) {
                if (el.placeholder !== undefined) {
                    el.placeholder = translations[language][key];
                } else {
                    el.textContent = translations[language][key];
                }
            }
        });
        localStorage.setItem('language', language);
        // Dispatch a custom event if needed
        const event = new CustomEvent('languageChange', { detail: { language } });
        window.dispatchEvent(event);

        // Update the language selector value if it exists
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = language;
        }
    };

    // Function to initialize the language on page load
    const initLanguage = () => {
        const savedLanguage = localStorage.getItem('language') || defaultLanguage;
        applyLanguage(savedLanguage);
    };

    return {
        applyLanguage,
        initLanguage,
    };
})();

/* *********************************
   Initialization on Page Load
********************************* */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme and language
    ThemeManager.initTheme();
    LanguageManager.initLanguage();

    // Attach event listeners to theme and language selectors if they exist
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            ThemeManager.applyTheme(e.target.value);
        });
    }

    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            LanguageManager.applyLanguage(e.target.value);
        });
    }
});
