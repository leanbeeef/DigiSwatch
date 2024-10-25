// *********************************
// Variable Declarations
// *********************************

const checkerBgColor = document.getElementById('checker-bg-color');
const checkerTextColor = document.getElementById('checker-text-color');
const accessibilityResult = document.getElementById('accessibility-result');
const applySuggestedColorButton = document.getElementById('apply-suggested-color');
const themeSelector = document.getElementById('theme-selector'); // For Themes
const bodyElement = document.getElementById('body'); // For theme application


// *********************************
// Event Listeners and Initializations
// *********************************

// Set theme from local storage
const savedTheme = localStorage.getItem('selectedTheme') || 'theme-default';
bodyElement.className = savedTheme;
themeSelector.value = savedTheme;


// Theme Selector Change Event
themeSelector.addEventListener('change', () => {
    const selectedTheme = themeSelector.value;
    bodyElement.className = selectedTheme;
    localStorage.setItem('selectedTheme', selectedTheme);
});


// Accessibility checker functionality
checkerBgColor.addEventListener('input', checkContrast);
checkerTextColor.addEventListener('input', checkContrast);

// Apply Suggested Color Button
applySuggestedColorButton.addEventListener('click', () => {
    const suggestedColorElement = document.querySelector('#accessibility-result span');
    if (suggestedColorElement) {
        const suggestedColor = suggestedColorElement.innerText;
        checkerTextColor.value = suggestedColor;
        checkContrast();
    }
});

// *********************************
// Main Functions
// *********************************

// Accessibility checker function with suggestions
function checkContrast() {
    const bgColor = checkerBgColor.value;
    const textColor = checkerTextColor.value;

    const contrastRatio = calculateContrast(bgColor, textColor);
    const resultElement = accessibilityResult;
    const textBox = document.querySelector('.accessibility-text-box p');

    // Update the preview box background color and text color
    document.querySelector('.accessibility-text-box').style.backgroundColor = bgColor;
    textBox.style.color = textColor;

    // Display the contrast result
    if (contrastRatio >= 4.5) {
        resultElement.innerText = `Contrast Ratio: ${contrastRatio.toFixed(2)} (Passes AA Standard)`;
        resultElement.style.color = 'green';
    } else {
        const suggestedColor = suggestAccessibleColor(bgColor, textColor);
        resultElement.innerHTML = `Contrast Ratio: ${contrastRatio.toFixed(2)} (Fails AA Standard)<br>
        Suggested Text Color: <span style="color:${suggestedColor}">${suggestedColor}</span>`;
        resultElement.style.color = 'red';
    }
}

// Function to suggest an accessible color
function suggestAccessibleColor(bgColor, textColor) {
    let suggestedColor = textColor;
    let contrast = calculateContrast(bgColor, suggestedColor);

    while (contrast < 4.5) {
        // Adjust lightness
        let hsl = hexToHsl(suggestedColor);
        hsl.l = hsl.l > 0.5 ? hsl.l - 0.05 : hsl.l + 0.05;
        suggestedColor = hslToHex(hsl);
        contrast = calculateContrast(bgColor, suggestedColor);

        // Break if lightness reaches limits
        if (hsl.l <= 0 || hsl.l >= 1) {
            break;
        }
    }

    return suggestedColor;
}

// *********************************
// Color Conversion Functions
// *********************************

// Convert HEX to HSL
function hexToHsl(hex) {
    let { r, g, b } = hexToRgbObject(hex);
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
                break;
            case g:
                h = ((b - r) / d + 2) * 60;
                break;
            case b:
                h = ((r - g) / d + 4) * 60;
                break;
        }
    }

    return { h, s, l };
}

// Convert HSL to HEX
function hslToHex(hsl) {
    let { h, s, l } = hsl;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = function (p, q, t) {
            t = (t + 360) % 360;
            if (t < 60) return p + (q - p) * (t / 60);
            if (t < 180) return q;
            if (t < 240) return p + (q - p) * ((240 - t) / 60);
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 120);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 120);
    }

    return rgbToHex(`rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`);
}

// Convert HEX to RGB object
function hexToRgbObject(hex) {
    let c = hex.startsWith('#') ? hex.substring(1) : hex;
    if (c.length === 3) {
        c = c.split('').map((char) => char + char).join('');
    }
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
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

// Calculate luminance of a color
function calculateLuminance(color) {
    const rgb = hexToRgbArray(color).map((value) => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Function to calculate contrast between two colors
function calculateContrast(color1, color2) {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    return (brightest + 0.05) / (darkest + 0.05);
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
