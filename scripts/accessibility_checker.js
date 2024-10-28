// DOM Elements
const bgColorInput = document.getElementById('backgroundColor');
const textColorInput = document.getElementById('foregroundColor');
const accessibilityResult = document.getElementById('accessibility-result');
const applySuggestedColorButton = document.getElementById('apply-suggested-color');
const themeSelector = document.getElementById('theme-selector');
const previewBox = document.getElementById('preview-box');

// Initialize Theme
document.body.className = localStorage.getItem('selectedTheme') || 'theme-default';
themeSelector.value = document.body.className;

// Event Listeners
bgColorInput.addEventListener('input', checkContrast);
textColorInput.addEventListener('input', checkContrast);
applySuggestedColorButton.addEventListener('click', () => {
    const suggestedColor = suggestAccessibleColor(bgColorInput.value);
    textColorInput.value = suggestedColor;
    checkContrast();
});
themeSelector.addEventListener('change', () => {
    document.body.className = themeSelector.value;
    localStorage.setItem('selectedTheme', themeSelector.value);
});

// Accessibility Contrast Checker
function checkContrast() {
    const bgColor = bgColorInput.value || "#000000";  // Default to black if empty
    const textColor = textColorInput.value || "#ffffff";  // Default to white if empty

    previewBox.style.backgroundColor = bgColor;
    previewBox.querySelector('p').style.color = textColor;

    const contrastRatio = calculateContrast(bgColor, textColor);
    if (contrastRatio >= 4.5) {
        accessibilityResult.innerHTML = `<span data-translate="contrast">Contrast Ratio:</span> ${contrastRatio.toFixed(2)} <span data-translate="passes">(Passes AA Standard)</span>`;
        accessibilityResult.style.color = 'green';
    } else {
        const suggestedColor = suggestAccessibleColor(bgColor);
        accessibilityResult.innerHTML = `<span data-translate="contrast">Contrast Ratio:</span> ${contrastRatio.toFixed(2)} <span data-translate="fails">(Fails AA Standard)</span>`;
        accessibilityResult.style.color = 'red';
    }
}

// Function to suggest an accessible color
function suggestAccessibleColor(bgColor) {
    let hsl = hexToHsl(bgColor);  // Convert background color to HSL
    hsl.l = hsl.l > 0.5 ? 0.2 : 0.8;  // Adjust lightness to ensure contrast

    return hslToHex(hsl);  // Convert adjusted HSL back to HEX
}

// Helper Functions

// Convert HEX to RGB (returns an object with r, g, b)
function hexToRgb(hex) {
    let c = hex.slice(1);  // Remove #
    if (c.length === 3) c = [...c].map(x => x + x).join('');  // Expand shorthand HEX
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// Convert RGB to HEX
function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Convert HEX to HSL
function hexToHsl(hex) {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;  // Achromatic
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s, l };
}

// Convert HSL to HEX
function hslToHex({ h, s, l }) {
    let r, g, b;

    if (s === 0) r = g = b = l;  // Achromatic
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1/3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1/3);
    }

    return rgbToHex({ r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) });
}

// Function to calculate contrast between two colors
function calculateContrast(color1, color2) {
    const lum1 = calculateLuminance(color1);
    const lum2 = calculateLuminance(color2);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Calculate luminance of a color
function calculateLuminance(color) {
    const { r, g, b } = hexToRgb(color);
    const [R, G, B] = [r, g, b].map(v => (v / 255 <= 0.03928) ? v / 255 / 12.92 : Math.pow((v / 255 + 0.055) / 1.055, 2.4));
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
