// site.js

/* *********************************
       Variable Declarations
********************************* */


// DOM Elements
const exportButton = document.getElementById('export-button');
const exportFormat = document.getElementById('export-format');
const colorBlindnessSelector = document.getElementById('color-blindness-selector');

// Ensure currentPalette and paletteDisplay are defined
let currentPalette = []; // Now accessible throughout site.js
let paletteDisplay = document.querySelector('.palette-display')

// Sidebar and Button Elements
const sidebar = document.getElementById("sidebar");
const openSidebarButton = document.getElementById("openSidebarButton");
const closeSidebarButton = document.getElementById("closeSidebarButton");

// Check if the current page is index.html or img_ext.html
const currentPage = window.location.pathname.split('/').pop(); // Get the filename

if (currentPage === 'index.html' || currentPage === 'image_ext.html') {
    // Initialize Color Blindness Simulation and Export Options if elements exist
    colorBlindnessSelector.addEventListener("change", () => {
        applyColorBlindnessSimulation(); // Define or update this function to re-render immediately
    });

    if (colorBlindnessSelector) {
        colorBlindnessSelector.addEventListener('change', applyColorBlindnessSimulation);
    }

    if (exportButton && exportFormat) {
        // Export button click event
        exportButton.addEventListener('click', () => {
            const format = exportFormat.value;
            if (!format) {
                alert('Please select an export format.');
                return;
            }

            // Export the palette
            exportPalette(format);
        });
    }
}

/* *********************************
   Theme Management Module
********************************* */

const ThemeManager = (() => {
    const defaultTheme = 'theme-light';

    const applyTheme = (theme) => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);

        // Dispatch theme change event
        const event = new CustomEvent('themeChange', { detail: { theme } });
        window.dispatchEvent(event);

        // Reapply color blindness simulation to match the new theme colors
        applyColorBlindnessSimulation();
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || defaultTheme;
        applyTheme(savedTheme);
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

window.addEventListener('themeChange', (e) => {
    // Example: Update custom elements or reapply styling as needed
    console.log(`Theme changed to: ${e.detail.theme}`);
    applyColorBlindnessSimulation(); // Reapply to match the updated theme
});

/* *********************************
   Sidebar Functions
********************************* */

// Open the sidebar
openSidebarButton.addEventListener("click", () => {
    sidebar.classList.add("open");
});

// Close the sidebar
closeSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("open");
});

// Close sidebar if clicking outside of it
window.addEventListener("click", (event) => {
    if (!sidebar.contains(event.target) && !openSidebarButton.contains(event.target)) {
        sidebar.classList.remove("open");
    }
});

/* *********************************
       Export Functions
********************************* */

function exportPalette(format) {
    if (currentPalette.length === 0) {
        alert("No colors in the palette to export.");
        return;
    }
    
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
    if (!paletteDisplay || !paletteDisplay.children.length) {
        alert("No palette display available to export as image.");
        return;
    }

    // Store original styles
    const originalGap = paletteDisplay.style.gap;
    const originalBackground = paletteDisplay.style.background;
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const colorCodes = document.querySelectorAll('.color-code');
    const originalBorderRadius = [];

    // Apply temporary styles for export
    paletteDisplay.style.gap = "0px";
    paletteDisplay.style.background = "transparent";
    colorSwatches.forEach((el, index) => {
        originalBorderRadius[index] = el.style.borderRadius;
        el.style.borderRadius = "0";
    });
    colorCodes.forEach(el => el.style.display = 'none');

    // Capture the palette with html2canvas
    html2canvas(paletteDisplay).then(canvas => {
        // Restore original styles after capture
        paletteDisplay.style.gap = originalGap;
        paletteDisplay.style.background = originalBackground;
        colorSwatches.forEach((el, index) => el.style.borderRadius = originalBorderRadius[index]);
        colorCodes.forEach(el => el.style.display = '');

        // Export the canvas as an image
        const link = document.createElement('a');
        link.download = `palette.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    });
}

// Export as CSS
function exportPaletteAsCSS() {
    let cssContent = ':root {\n';
    currentPalette.forEach((color, index) => {
        cssContent += `  --color-${index + 1}: ${color};\n`;
    });
    cssContent += '}';
    downloadFile(cssContent, 'palette.css', 'text/css');
}

// Export as JSON
function exportPaletteAsJSON() {
    const jsonContent = JSON.stringify(currentPalette, null, 2);
    downloadFile(jsonContent, 'palette.json', 'application/json');
}

// Export as Text
function exportPaletteAsText() {
    const textContent = currentPalette.join('\n');
    downloadFile(textContent, 'palette.txt', 'text/plain');
}

// Export as SVG
function exportPaletteAsSVG() {
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
   Color Blindness Simulation Functions
********************************* */

// Convert HEX to RGB
function hexToRgb(hex) {
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, '');

    // Parse the hex string
    let bigint = parseInt(hex, 16);
    if (hex.length === 3) {
        // Handle short form (#RGB)
        let r = (bigint >> 8) & 0xF;
        let g = (bigint >> 4) & 0xF;
        let b = bigint & 0xF;
        return {
            r: (r << 4) | r,
            g: (g << 4) | g,
            b: (b << 4) | b
        };
    } else if (hex.length === 6) {
        // Handle full form (#RRGGBB)
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    } else {
        throw new Error('Invalid HEX color.');
    }
}

// Simulate color blindness based on type
function simulateColorBlindness(hex, type) {
    // Convert HEX to RGB
    let rgb;
    try {
        rgb = hexToRgb(hex);
    } catch (error) {
        console.error('Invalid HEX color:', hex);
        return hex; // Return original color if invalid
    }

    let simulated = { r: rgb.r, g: rgb.g, b: rgb.b };

    switch (type) {
        case 'protanopia':
            simulated.r = 0.56667 * rgb.r + 0.43333 * rgb.g;
            simulated.g = 0.55833 * rgb.g + 0.44167 * rgb.b;
            simulated.b = 0.24167 * rgb.g + 0.75833 * rgb.b;
            break;
        case 'deuteranopia':
            simulated.r = 0.625 * rgb.r + 0.375 * rgb.g;
            simulated.g = 0.7 * rgb.g + 0.3 * rgb.b;
            simulated.b = 0.3 * rgb.g + 0.7 * rgb.b;
            break;
        case 'tritanopia':
            simulated.r = 0.95 * rgb.r + 0.05 * rgb.b;
            simulated.g = 0.43333 * rgb.g + 0.56667 * rgb.b;
            // simulated.b remains the same
            break;
        case 'achromatopsia':
            const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
            simulated.r = simulated.g = simulated.b = gray;
            break;
        default:
            return hex; // If no color blindness, return the original hex color
    }

    // Ensure RGB is within bounds [0, 255] and convert back to hex
    return rgbToHex({
        r: Math.round(Math.min(255, Math.max(0, simulated.r))),
        g: Math.round(Math.min(255, Math.max(0, simulated.g))),
        b: Math.round(Math.min(255, Math.max(0, simulated.b)))
    });
}

// Function to apply color blindness simulation
function applyColorBlindnessSimulation() {
    const simulationType = colorBlindnessSelector?.value;
    document.querySelectorAll('.palette-display .color-swatch').forEach(swatch => {
        const originalColor = swatch.dataset.originalColor;
        if (!originalColor) return;

        let simulatedColor;
        if (simulationType && simulationType !== 'none') {
            simulatedColor = simulateColorBlindness(originalColor, simulationType);
        } else {
            simulatedColor = originalColor;
        }
        swatch.style.backgroundColor = simulatedColor;
    });
}

/* *********************************
   Color Blindness Simulation Functions
********************************* */

// Convert HEX to RGB
function hexToRgb(hex) {
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, '');

    // Parse the hex string
    let bigint = parseInt(hex, 16);
    if (hex.length === 3) {
        // Handle short form (#RGB)
        let r = (bigint >> 8) & 0xF;
        let g = (bigint >> 4) & 0xF;
        let b = bigint & 0xF;
        return {
            r: (r << 4) | r,
            g: (g << 4) | g,
            b: (b << 4) | b
        };
    } else if (hex.length === 6) {
        // Handle full form (#RRGGBB)
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    } else {
        throw new Error('Invalid HEX color.');
    }
}

// Simulate color blindness based on type
function simulateColorBlindness(hex, type) {
    // Convert HEX to RGB
    let rgb;
    try {
        rgb = hexToRgb(hex);
    } catch (error) {
        console.error('Invalid HEX color:', hex);
        return hex; // Return original color if invalid
    }

    let simulated = { r: rgb.r, g: rgb.g, b: rgb.b };

    switch (type) {
        case 'protanopia':
            simulated.r = 0.56667 * rgb.r + 0.43333 * rgb.g;
            simulated.g = 0.55833 * rgb.g + 0.44167 * rgb.b;
            simulated.b = 0.24167 * rgb.g + 0.75833 * rgb.b;
            break;
        case 'deuteranopia':
            simulated.r = 0.625 * rgb.r + 0.375 * rgb.g;
            simulated.g = 0.7 * rgb.g + 0.3 * rgb.b;
            simulated.b = 0.3 * rgb.g + 0.7 * rgb.b;
            break;
        case 'tritanopia':
            simulated.r = 0.95 * rgb.r + 0.05 * rgb.b;
            simulated.g = 0.43333 * rgb.g + 0.56667 * rgb.b;
            // simulated.b remains the same
            break;
        case 'achromatopsia':
            const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
            simulated.r = simulated.g = simulated.b = gray;
            break;
        default:
            return hex; // If no color blindness, return the original hex color
    }

    // Ensure RGB is within bounds [0, 255] and convert back to hex
    return rgbToHex({
        r: Math.round(Math.min(255, Math.max(0, simulated.r))),
        g: Math.round(Math.min(255, Math.max(0, simulated.g))),
        b: Math.round(Math.min(255, Math.max(0, simulated.b)))
    });
}

/* *********************************
   Helper Functions
********************************* */

// Convert RGB object to HEX
function rgbToHex(rgb) {
    return (
        '#' +
        [rgb.r, rgb.g, rgb.b]
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    ).toUpperCase();
}

// Convert HEX to RGB string (e.g., #FFFFFF -> rgb(255, 255, 255))
function hexToRgbString(hex) {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
}

/* *********************************
   Initialization on Page Load
********************************* */

document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.initTheme();

    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            ThemeManager.applyTheme(e.target.value);
        });
    }

    applyColorBlindnessSimulation();
});