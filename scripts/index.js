// index.js

document.addEventListener('DOMContentLoaded', () => {

    /* *********************************
       Variable Declarations
    ********************************* */

    // DOM Elements
    const colorPicker = document.getElementById('colorPicker');
    const popularPalettesSelector = document.getElementById('popular-palettes-selector');
    const paletteDisplay = document.querySelector('.palette-display');
    const paletteTabs = document.querySelectorAll('.palette-tabs .tab');
    const paletteDropdown = document.getElementById('palette-dropdown');
    const harmonyText = document.getElementById('harmony-text');
    const exportButton = document.getElementById('export-button');
    const exportFormat = document.getElementById('export-format');
    const patternSelector = document.getElementById('pattern-selector');
    const harmonySVG = document.getElementById('harmony-svg');
    const harmonyButton = document.querySelector('.harmony-button');
    const harmonyTextExample1 = document.querySelector('.harmony-text');
    const harmonyTextExample2 = document.querySelector('.harmony-text2');
    const colorAdjustmentModal = document.getElementById('color-adjustment-modal');
    const applyAdjustmentsBtn = document.getElementById('apply-adjustments');
    const hueSlider = document.getElementById('hue-slider');
    const saturationSlider = document.getElementById('saturation-slider');
    const lightnessSlider = document.getElementById('lightness-slider');
    const colorPreview = document.getElementById('color-preview');
    const closeButton = document.querySelector('.close-button');
    const languageSelector = document.getElementById('language-selector');
    const themeSelector = document.getElementById('theme-selector');

    // Variables to store current state
    let currentPaletteType = 'monochromatic';
    let baseColor = '#7E7E7E'; // Set the default base color to #7E7E7E
    let currentPalette = [];
    let adjustedColor = baseColor;

    // Set the color picker to the base color
    colorPicker.value = baseColor;

    // Localization data
    const translations = {
        en: {
            title: 'Color Palette Generator',
            home: 'Home',
            extras: 'Extras',
            accessibility_checker: 'Accessibility Checker',
            choose_color: 'Choose a Base Color',
            select_palette: 'Select Palette',
            select_palette_description: 'Select a palette to see its description.',
            export_as: 'Export as:',
            select_format: 'Select format',
            export_palette: 'Export Palette',
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
            accessibility_checker: "Comprobador de accesibilidad",
            export_as: "Exportar como:",
            select_format: "Seleccionar formato",
            export_palette: "Exportar paleta",
            simulate_color_blindness: "Simular daltonismo:",
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
            default_theme: "Predeterminado",
            light_theme: "Luz",
            dark_theme: "Oscuro",
        },
        // Add more languages as needed
    };

    // Predefined Popular Color Palettes
const popularPalettes = [
    {
        name: 'Sunset',
        colors: ['#ff6b6b', '#ff8c42', '#ffd700', '#ffcc29', '#ffaa33', '#ff6f61', '#ff5e57', '#ff8a5b'],
    },
    {
        name: 'Ocean Blue',
        colors: ['#004e92', '#4286f4', '#00b4db', '#0083b0', '#0052cc', '#4a90e2', '#0073e6', '#0066cc'],
    },
    {
        name: 'Forest Greens',
        colors: ['#0b3d0b', '#004d00', '#008f00', '#00cc00', '#00e600', '#29a329', '#339933', '#006600'],
    },
    {
        name: 'Purple Hues',
        colors: ['#6a0dad', '#9b30ff', '#800080', '#dda0dd', '#e066ff', '#ba55d3', '#9370db', '#bf00ff'],
    },
    {
        name: 'Vintage Pastels',
        colors: ['#f4e1d2', '#e8c1c1', '#c5a3a3', '#a1a3c5', '#c1c1e8', '#d2e1f4', '#b3cde0', '#a3c1ad'],
    },
    {
        name: 'Earth Tones',
        colors: ['#a0522d', '#cd853f', '#deb887', '#f5deb3', '#e0c097', '#c19a6b', '#8b4513', '#5d3a1a'],
    },
    {
        name: 'Neon Lights',
        colors: ['#ff6ec7', '#ff33cc', '#cc33ff', '#9933ff', '#6699ff', '#33ccff', '#33ffff', '#66ffcc'],
    },
    {
        name: 'Warm Autumn',
        colors: ['#ff7f50', '#ff6347', '#ff4500', '#db7093', '#e9967a', '#f08080', '#cd5c5c', '#dc143c'],
    },
    {
        name: 'Cool Winter',
        colors: ['#4682b4', '#5f9ea0', '#6495ed', '#00ced1', '#1e90ff', '#87cefa', '#87ceeb', '#afeeee'],
    },
    {
        name: 'Monochrome Grays',
        colors: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888'],
    },
    {
        name: 'Fresh Spring',
        colors: ['#98fb98', '#00fa9a', '#00ff7f', '#7fff00', '#7cfc00', '#adff2f', '#32cd32', '#9acd32'],
    },
    {
        name: 'Pastel Rainbow',
        colors: ['#ffd1dc', '#ffe4e1', '#e6e6fa', '#e0ffff', '#e0ffe0', '#ffffe0', '#ffe4b5', '#ffe4c4'],
    },
    {
        name: 'Bold Primary',
        colors: ['#ff0000', '#0000ff', '#ffff00', '#00ff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'],
    },
    {
        name: 'Elegant Neutrals',
        colors: ['#f5f5f5', '#e0e0e0', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666', '#4d4d4d'],
    },
    {
        name: 'Chocolate Delight',
        colors: ['#7b3f00', '#a0522d', '#8b4513', '#d2691e', '#cd853f', '#f4a460', '#deb887', '#ffe4c4'],
    },
    {
        name: 'Tropical Paradise',
        colors: ['#ff4500', '#ff8c00', '#ffd700', '#7cfc00', '#00fa9a', '#00ffff', '#1e90ff', '#da70d6'],
    },
    {
        name: 'Muted Earth',
        colors: ['#806b63', '#a68b79', '#c3a697', '#e0c6b5', '#f7e6d3', '#d9cab3', '#bba38b', '#9d7c63'],
    },
    {
        name: 'Royal Gold',
        colors: ['#ffd700', '#daa520', '#b8860b', '#ff8c00', '#ff7f50', '#ff6347', '#cd5c5c', '#8b0000'],
    },
    {
        name: 'Minimalist Blue',
        colors: ['#dbe9ee', '#a9cfd8', '#79b1c1', '#4f94af', '#266b8e', '#1b4f72', '#103b57', '#072a42'],
    },
    {
        name: 'Floral Bouquet',
        colors: ['#ffb6c1', '#ff69b4', '#db7093', '#ff1493', '#c71585', '#d8bfd8', '#dda0dd', '#ee82ee'],
    },
];

    /* *********************************
       Event Listeners
    ********************************* */

    // Update the palette when the color picker changes
    colorPicker.addEventListener('input', () => {
        baseColor = colorPicker.value;
        updatePalette();
    });

    // Palette tab click events
    paletteTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            paletteTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPaletteType = tab.getAttribute('data-palette');
            updatePalette();
        });
    });

    // Palette dropdown change event (for mobile view)
    paletteDropdown.addEventListener('change', () => {
        currentPaletteType = paletteDropdown.value;
        updatePalette();
    });

    // Event listener for popular palette selection
    if (popularPalettesSelector) {
        populatePopularPalettes(); // Populate popular palettes dropdown
        popularPalettesSelector.addEventListener('change', applySelectedPalette);
    }

    // Export button click event
    exportButton.addEventListener('click', () => {
        const format = exportFormat.value;
        if (!format) {
            alert('Please select an export format.');
            return;
        }
        exportPalette(format);
    });

    // Pattern selector change event
    patternSelector.addEventListener('change', () => {
        updateHarmonyVisualizer();
    });

    // Open color adjustment modal
    paletteDisplay.addEventListener('click', (event) => {
        const swatch = event.target.closest('.color-swatch');
        if (swatch) {
            adjustedColor = swatch.style.backgroundColor;
            openColorAdjustmentModal();
        }
    });

    // Apply adjustments and close modal
    applyAdjustmentsBtn.addEventListener('click', () => {
        applyColorAdjustments();
        closeColorAdjustmentModal();
    });

    // Close modal when clicking the close button
    closeButton.addEventListener('click', closeColorAdjustmentModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === colorAdjustmentModal) {
            closeColorAdjustmentModal();
        }
    });

    // Sliders input events
    hueSlider.addEventListener('input', updateColorPreview);
    saturationSlider.addEventListener('input', updateColorPreview);
    lightnessSlider.addEventListener('input', updateColorPreview);

    // Language selector change event
    languageSelector.addEventListener('change', () => {
        const language = languageSelector.value;
        setLanguage(language);
    });

    // Theme selector change event
    themeSelector.addEventListener('change', () => {
        const theme = themeSelector.value;
        setTheme(theme);
    });

    /* *********************************
       Initialize the Page
    ********************************* */

    // Set initial language and theme
    setLanguage('en');
    setTheme('theme-light');

    // Update the palette on page load
    updatePalette();

    /* *********************************
       Color Palette Generation Functions
    ********************************* */

    // Helper functions to convert between HEX and HSL
    function hexToHsl(hex) {
        return tinycolor(hex).toHsl();
    }

    function hslToHex(hsl) {
        return tinycolor(hsl).toHexString();
    }

    // Adjust the brightness of a HEX color
function adjustBrightness(hex, percent) {
    let rgb = hexToRgbArray(hex);
    rgb = rgb.map((value) => {
        const newValue = Math.min(Math.max(value + percent, 0), 255); // Keep values between 0 and 255
        return newValue;
    });
    return rgbToHex(`rgb(${rgb.join(', ')})`);
}

// Helper function to convert HEX to RGB array
function hexToRgbArray(hex) {
    let c = hex.startsWith('#') ? hex.substring(1) : hex;
    if (c.length === 3) {
        c = c.split('').map((char) => char + char).join('');
    }
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Convert RGB string to HEX
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);
    return (
        '#' +
        rgbValues
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    ).toUpperCase();
}

    // Generate Monochromatic Palette
function generateMonochromatic(hex) {
    let colors = [];
    for (let i = -4; i <= 3; i++) {
        let adjustedColor = adjustBrightness(hex, i * 25);
        colors.push(adjustedColor);
    }
    return colors.slice(0, 8);
}

    // Generate Analogous Palette
    function generateAnalogous(hex) {
        let colors = [];
        const hsl = hexToHsl(hex);

        // Generate 3 main analogous colors (base + 2 colors adjacent, 30 degrees apart)
        for (let i = -1; i <= 1; i++) {
            let newHue = (hsl.h + i * 30 + 360) % 360;
            colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
        }

        // Add monochromatic variations
        colors = colors.concat(generateMonochromatic(colors[0]).slice(1, 3)); // 2 shades of base color
        colors = colors.concat(generateMonochromatic(colors[1]).slice(1, 3)); // 2 shades of first analogous color
        colors.push(generateMonochromatic(colors[2])[1]); // 1 shade of second analogous color

        return colors.slice(0, 8);
    }

    // Generate Complementary Palette
    function generateComplementary(hex) {
        const hsl = hexToHsl(hex);
        let complementHue = (hsl.h + 180) % 360;
        let complementColor = hslToHex({ h: complementHue, s: hsl.s, l: hsl.l });

        let colors = [hex, complementColor];

        // Add monochromatic shades
        colors = colors.concat(generateMonochromatic(hex).slice(1, 3)); // Shades of base color
        colors = colors.concat(generateMonochromatic(complementColor).slice(1, 4)); // Shades of complement

        return colors.slice(0, 8);
    }

    // Generate Split Complementary Palette
    function generateSplitComplementary(hex) {
        const hsl = hexToHsl(hex);

        let hue1 = (hsl.h + 150) % 360;
        let hue2 = (hsl.h + 210) % 360;

        let color1 = hslToHex({ h: hue1, s: hsl.s, l: hsl.l });
        let color2 = hslToHex({ h: hue2, s: hsl.s, l: hsl.l });

        let colors = [hex, color1, color2];

        // Add monochromatic shades
        colors = colors.concat(generateMonochromatic(hex).slice(1, 3)); // Shades of base color
        colors = colors.concat(generateMonochromatic(color1).slice(1, 3)); // Shades of color1
        colors.push(generateMonochromatic(color2)[1]); // Shade of color2

        return colors.slice(0, 8);
    }

    // Generate Triadic Palette
    function generateTriadic(hex) {
        const hsl = hexToHsl(hex);

        let colors = [];
        for (let i = 0; i < 3; i++) {
            let newHue = (hsl.h + i * 120) % 360;
            colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
        }

        // Add monochromatic shades
        colors = colors.concat(generateMonochromatic(colors[0]).slice(1, 3)); // Shades of base color
        colors = colors.concat(generateMonochromatic(colors[1]).slice(1, 3)); // Shades of second triadic color
        colors.push(generateMonochromatic(colors[2])[1]); // Shade of third triadic color

        return colors.slice(0, 8);
    }

    // Generate Tetradic Palette
    function generateTetradic(hex) {
        const hsl = hexToHsl(hex);

        let colors = [];
        for (let i = 0; i < 4; i++) {
            let newHue = (hsl.h + i * 90) % 360;
            colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
        }

        // Add monochromatic shades
        colors = colors.concat(generateMonochromatic(colors[0]).slice(1, 3)); // Shades of base color
        colors = colors.concat(generateMonochromatic(colors[1]).slice(1, 3)); // Shades of second tetradic color
        colors.push(generateMonochromatic(colors[2])[1]); // Shade of third tetradic color

        return colors.slice(0, 8);
    }

    // Generate PowerPoint Theme (Monochromatic Accessible Colors - 6 Colors Only)
    function generatePowerPointTheme() {
        let baseColor = colorPicker.value; // Use the current color from the picker as the base color
        let colors = [];
        const maxIterations = 10; // Limit the number of attempts to find an accessible color

        // Generate 6 accessible monochromatic shades of the base color
        let adjustmentValues = [-100, -66, -33, 0, 33, 66]; // Different brightness adjustments

        for (let i = 0; i < 6; i++) {
            let monochromaticColor;
            let iterations = 0;
            do {
                monochromaticColor = adjustBrightness(baseColor, adjustmentValues[i]);
                iterations++;
            } while (!isAccessible(monochromaticColor) && iterations < maxIterations); // Ensure the color is accessible

            colors.push(monochromaticColor);
        }

        return colors; // Return exactly 6 colors
    }

    // Function to check if a color is accessible (placeholder)
    function isAccessible(hex) {
        // Implement accessibility check if needed
        return true;
    }

    // Copy color value to clipboard and display a message
function copyColor(e) {
    const color = e.currentTarget.dataset.color;
    const format = colorFormatToggle && colorFormatToggle.checked ? 'RGB' : 'HEX';
    const colorText = format === 'RGB' ? hexToRgbString(color) : color.toUpperCase();

    // Copy to clipboard
    navigator.clipboard.writeText(colorText).then(() => {
        // Display a message in the center of the screen
        showCopyMessage(`Copied ${colorText}`);
    });
}

    // Apply the selected popular palette
    function applySelectedPalette() {
        if (!popularPalettesSelector) return;
    
        const selectedPaletteName = popularPalettesSelector.value;
        const selectedPalette = popularPalettes.find((palette) => palette.name === selectedPaletteName);
    
        if (selectedPalette) {
            currentPalette = selectedPalette.colors; // Update currentPalette instead of currentColors
            displayPalette(); // Call without parameters
    
            if (typeof updateHarmonyVisualizer === 'function') {
                updateHarmonyVisualizer(); // Update without parameters
            }
        }
}

// Populate the popular palettes dropdown
function populatePopularPalettes() {
    if (!popularPalettesSelector) return;

    popularPalettes.forEach((palette) => {
        const option = document.createElement('option');
        option.value = palette.name;
        option.innerText = palette.name;
        popularPalettesSelector.appendChild(option);
    });
}

    /* *********************************
       Main Functions
    ********************************* */

    // Function to update the palette
    function updatePalette() {
        currentPalette = generatePalette(baseColor, currentPaletteType);
        displayPalette();
        updateHarmonyVisualizer();
        updateHarmonyDescription();
    }

    // Function to generate the palette
    function generatePalette(hex, paletteType) {
        switch (paletteType) {
            case 'monochromatic':
                return generateMonochromatic(hex);
            case 'analogous':
                return generateAnalogous(hex);
            case 'complementary':
                return generateComplementary(hex);
            case 'splitComplementary':
                return generateSplitComplementary(hex);
            case 'triadic':
                return generateTriadic(hex);
            case 'tetradic':
                return generateTetradic(hex);
            case 'powerpointTheme':
                return generatePowerPointTheme(hex);
            default:
                return generateMonochromatic(hex);
        }
    }

    // Function to display the palette
    function displayPalette() {
        paletteDisplay.innerHTML = '';
        currentPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color;

            const colorContent = document.createElement('div');
            colorContent.classList.add('color-content');

            const colorCode = document.createElement('div');
            colorCode.classList.add('color-code');
            colorCode.textContent = color;

            colorContent.appendChild(colorCode);
            swatch.appendChild(colorContent);

            paletteDisplay.appendChild(swatch);

            // Copy Color on Click
            swatch.addEventListener('click', copyColor);
        });
    }

    /* *********************************
       Harmony Visualizer Functions
    ********************************* */

    // Function to update the Harmony Visualizer
    function updateHarmonyVisualizer() {
        // Update the SVG pattern
        const patternName = patternSelector.value;
        const colors = currentPalette;
        const svgPattern = generateSVGPattern(patternName, colors);
        harmonySVG.innerHTML = svgPattern;

        // Update the examples
        harmonyButton.style.backgroundColor = colors[0];
        harmonyButton.style.color = getContrastingColor(colors[0]);

        harmonyTextExample1.style.backgroundColor = colors[1];
        harmonyTextExample1.style.color = getContrastingColor(colors[1]);

        harmonyTextExample2.style.backgroundColor = colors[2];
        harmonyTextExample2.style.color = getContrastingColor(colors[2]);
    }

    // Function to generate SVG pattern
    function generateSVGPattern(patternName, colors) {
        // Create a copy of the colors array
        let sortedColors = colors.slice();

        // Optionally, sort colors if needed
        sortedColors.sort((a, b) => {
            return tinycolor(a).getLuminance() - tinycolor(b).getLuminance();
        });

        // Ensure there are enough colors
        const defaultColor = '#FFFFFF';
        while (sortedColors.length < 8) {
            sortedColors.push(defaultColor);
        }

        // Simple example patterns
        switch (patternName) {
            case 'jigsaw':
                return `<svg width="200" height="200">
                        <defs>
                            <pattern id="puzzlePattern" patternUnits="userSpaceOnUse" width="100" height="100">
                                <!-- First puzzle piece -->
                                <path d="
                                    M25,0
                                    h50
                                    a25,25 0 0 1 0,50
                                    v25
                                    a25,25 0 0 1 -50,0
                                    h-25
                                    a25,25 0 0 1 0,-50
                                    v-25
                                    z
                                " fill="${sortedColors[1]}" stroke="${sortedColors[2]}" stroke-width="8" />
                                <!-- Second puzzle piece -->
                                <path d="
                                    M75,0
                                    h50
                                    v25
                                    a25,25 0 0 1 -50,0
                                    v-25
                                    z
                                " fill="${sortedColors[3]}" stroke="${sortedColors[4]}" stroke-width="8" transform="translate(-50,50)" />
                                <!-- Third puzzle piece -->
                                <path d="
                                    M25,50
                                    h50
                                    v50
                                    h-50
                                    v-50
                                    z
                                " fill="${sortedColors[5]}" stroke="${sortedColors[6]}" stroke-width="8" transform="translate(0,50)" />
                                <!-- Fourth puzzle piece -->
                                <path d="
                                    M75,50
                                    h50
                                    v50
                                    h-50
                                    v-50
                                    z
                                " fill="${sortedColors[7]}" stroke="${sortedColors[0]}" stroke-width="8" transform="translate(-50,50)" />
                            </pattern>
                        </defs>
                        <rect width="200" height="200" fill="url(#puzzlePattern)" />
                    </svg>`;
            case 'topography':
                return `<svg width="200" height="200">
                            <rect width="200" height="250" fill="${sortedColors[0]}" />
                            <path d="M0,25 Q50,-25 100,25 T200,25" stroke="${sortedColors[4]}" stroke-width="3" fill="none"/>
                            <path d="M0,50 Q50,0 100,50 T200,50" stroke="${sortedColors[1]}" stroke-width="2" fill="none"/>
                            <path d="M0,75 Q50,25 100,75 T200,75" stroke="${sortedColors[5]}" stroke-width="3" fill="none"/>
                            <path d="M0,100 Q50,50 100,100 T200,100" stroke="${sortedColors[2]}" stroke-width="2" fill="none"/>
                            <path d="M0,125 Q50,75 100,125 T200,125" stroke="${sortedColors[6]}" stroke-width="3" fill="none"/>
                            <path d="M0,150 Q50,100 100,150 T200,150" stroke="${sortedColors[3]}" stroke-width="2" fill="none"/>
                            <path d="M0,175 Q50,125 100,175 T200,175" stroke="${sortedColors[7]}" stroke-width="3" fill="none"/>
                            <path d="M0,200 Q50,150 100,200 T200,200" stroke="${sortedColors[4]}" stroke-width="2" fill="none"/>
                            <path d="M0,225 Q50,175 100,225 T200,225" stroke="${sortedColors[5]}" stroke-width="3" fill="none"/>
                        </svg>`;
            case 'overcast':
                return `<svg width="200" height="200">
                            <rect width="200" height="200" fill="${sortedColors[7]}" />
                            <!-- Large cloud -->
                            <ellipse cx="100" cy="100" rx="80" ry="50" fill="${sortedColors[1]}" />
                            <!-- Smaller clouds -->
                            <ellipse cx="60" cy="80" rx="40" ry="25" fill="${sortedColors[2]}" />
                            <ellipse cx="140" cy="80" rx="40" ry="25" fill="${sortedColors[3]}" />
                            <ellipse cx="80" cy="120" rx="40" ry="25" fill="${sortedColors[4]}" />
                            <ellipse cx="120" cy="120" rx="40" ry="25" fill="${sortedColors[5]}" />
                        </svg>`;
            case 'plus':
                return `<svg width="200" height="200">
                            <rect width="200" height="200" fill="${sortedColors[7]}" />
                            <!-- First plus sign -->
                            <rect x="90" y="10" width="20" height="180" fill="${sortedColors[1]}" />
                            <rect x="10" y="90" width="180" height="20" fill="${sortedColors[1]}" />
                            <!-- Second plus sign -->
                            <rect x="50" y="50" width="20" height="100" fill="${sortedColors[2]}" />
                            <rect x="0" y="90" width="100" height="20" fill="${sortedColors[2]}" />
                            <!-- Third plus sign -->
                            <rect x="130" y="50" width="20" height="100" fill="${sortedColors[3]}" />
                            <rect x="100" y="90" width="100" height="20" fill="${sortedColors[3]}" />
                        </svg>`;
            case 'bubbles':
                return `<svg width="200" height="200">
                            <rect width="200" height="200" fill="${sortedColors[7]}" />
                            <circle cx="50" cy="50" r="40" fill="${sortedColors[4]}" />
                            <circle cx="150" cy="150" r="40" fill="${sortedColors[3]}" />
                            <circle cx="100" cy="100" r="30" fill="${sortedColors[2]}" />
                            <circle cx="50" cy="150" r="20" fill="${sortedColors[1]}" />
                            <circle cx="150" cy="50" r="20" fill="${sortedColors[0]}" />
                        </svg>`;
            default:
                return `<svg width="200" height="200">
                            <rect width="200" height="200" fill="${colors[0]}" />
                        </svg>`;
        }
    }

    // Function to get contrasting color (black or white)
    function getContrastingColor(hexColor) {
        const color = tinycolor(hexColor);
        return color.isLight() ? '#000000' : '#FFFFFF';
    }

    // Function to update Harmony Description
    function updateHarmonyDescription() {
        const descriptions = {
            monochromatic: 'Monochromatic colors are all the colors (tones, tints, and shades) of a single hue.',
            analogous: 'Analogous colors are groups of three colors that are next to each other on the color wheel.',
            complementary: 'Complementary colors are pairs of colors which, when combined, cancel each other out.',
            splitComplementary: 'Split complementary is a color scheme using one base color and two secondary colors.',
            triadic: 'Triadic colors are evenly spaced around the color wheel.',
            tetradic: 'Tetradic colors are four colors arranged into two complementary pairs.',
            powerpointTheme: 'PowerPoint theme colors are designed to work well in presentations.'
        };
        harmonyText.textContent = descriptions[currentPaletteType] || '';
    }

    /* *********************************
       Export Functions
    ********************************* */

    // Function to export the palette
    function exportPalette(format) {
        switch (format) {
            case 'png':
            case 'jpeg':
                exportPaletteAsImage(format);
                break;
            case 'css':
                exportPaletteAsCSS();
                break;
            case 'json':
                exportPaletteAsJSON();
                break;
            case 'txt':
                exportPaletteAsText();
                break;
            case 'svg':
                exportPaletteAsSVG();
                break;
            default:
                alert('Unsupported export format.');
                break;
        }
    }

    // Function to export palette as image
    function exportPaletteAsImage(format) {
        html2canvas(paletteDisplay).then(canvas => {
            const link = document.createElement('a');
            link.download = `palette.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
            link.click();
        });
    }

    // Function to export palette as CSS
    function exportPaletteAsCSS() {
        let cssContent = ':root {\n';
        currentPalette.forEach((color, index) => {
            cssContent += `  --color-${index + 1}: ${color};\n`;
        });
        cssContent += '}';
        downloadFile(cssContent, 'palette.css', 'text/css');
    }

    // Function to export palette as JSON
    function exportPaletteAsJSON() {
        const jsonContent = JSON.stringify(currentPalette, null, 2);
        downloadFile(jsonContent, 'palette.json', 'application/json');
    }

    // Function to export palette as Text
    function exportPaletteAsText() {
        const textContent = currentPalette.join('\n');
        downloadFile(textContent, 'palette.txt', 'text/plain');
    }

    // Function to export palette as SVG
    function exportPaletteAsSVG() {
        // Generate an SVG representation of the palette
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="100">\n`;
        const swatchWidth = 100;
        currentPalette.forEach((color, index) => {
            svgContent += `<rect x="${index * swatchWidth}" y="0" width="${swatchWidth}" height="100" fill="${color}" />\n`;
        });
        svgContent += '</svg>';
        downloadFile(svgContent, 'palette.svg', 'image/svg+xml');
    }

    // Utility function to download files
    function downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const link = document.createElement('a');
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        link.click();
        window.URL.revokeObjectURL(link.href);
    }

    /* *********************************
       Color Adjustment Modal Functions
    ********************************* */

    // Function to open the color adjustment modal
    function openColorAdjustmentModal() {
        colorAdjustmentModal.style.display = 'block';
        initializeSliders();
    }

    // Function to close the color adjustment modal
    function closeColorAdjustmentModal() {
        colorAdjustmentModal.style.display = 'none';
    }

    // Function to initialize sliders and preview
    function initializeSliders() {
        const hsl = tinycolor(adjustedColor).toHsl();
        hueSlider.value = hsl.h;
        saturationSlider.value = hsl.s * 100;
        lightnessSlider.value = hsl.l * 100;
        updateColorPreview();
    }

    // Function to update the color preview in the modal
    function updateColorPreview() {
        const h = hueSlider.value;
        const s = saturationSlider.value / 100;
        const l = lightnessSlider.value / 100;
        const color = tinycolor({ h, s, l });
        colorPreview.style.backgroundColor = color.toHexString();
    }

    // Function to apply color adjustments
    function applyColorAdjustments() {
        const h = hueSlider.value;
        const s = saturationSlider.value / 100;
        const l = lightnessSlider.value / 100;
        const color = tinycolor({ h, s, l }).toHexString();
        baseColor = color;
        colorPicker.value = baseColor;
        updatePalette();
    }

    /* *********************************
       Localization and Theme Functions
    ********************************* */

    // Localization function
    function setLanguage(language) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[language][key]) {
                if (el.placeholder) {
                    el.placeholder = translations[language][key];
                } else {
                    el.textContent = translations[language][key];
                }
            }
        });
    }

    // Theme function
    function setTheme(theme) {
        document.body.className = theme;
    }

});