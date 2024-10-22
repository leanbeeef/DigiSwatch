// DOM Elements
const colorIcon = document.querySelector('.color-picker');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');
const generateBtn = document.getElementById('generateBtn');
const paletteDisplay = document.querySelector('.palette-display');
const tabs = document.querySelectorAll('.tab');
const colorFormatToggle = document.getElementById('colorFormatToggle');
const toggleLabel = document.getElementById('toggleLabel');
const downloadBtn = document.getElementById('downloadBtn');
const eyedropperBtn = document.getElementById('eyedropperBtn');

let lockedColors = {};
let currentPaletteType = 'monochromatic'; // Default palette type
let currentColors = [];

// Set initial color in the picker and input
colorValue.value = colorPicker.value;

// Event Listeners

// Click on the color icon triggers the color picker dropdown
colorPicker.addEventListener('input', function () {
    const selectedColor = colorPicker.value;
    colorValue.value = selectedColor; // Update text input
    generatePalettes(); // Regenerate the palettes based on the new color
});

// Sync text input color with color picker (when user types in HEX or RGB manually)
colorValue.addEventListener('input', function () {
    const inputColor = colorValue.value.trim();
    if (isValidHex(inputColor)) {
        colorPicker.value = inputColor.startsWith('#') ? inputColor : '#' + inputColor; // Update the color picker
        generatePalettes(); // Regenerate the palettes based on the new input color
    } else if (isValidRgb(inputColor)) {
        const hexColor = rgbToHex(inputColor);
        colorPicker.value = hexColor;
        generatePalettes();
    }
});

// Toggle between HEX and RGB formats
colorFormatToggle.addEventListener('change', function () {
    const format = colorFormatToggle.checked ? 'RGB' : 'HEX';
    toggleLabel.innerText = format;
    updateColorCodes(format);
});

// Generate palettes when the Generate button is clicked
generateBtn.addEventListener('click', generatePalettes);

// Tab switching functionality
tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentPaletteType = this.dataset.palette;
        generatePalettes();
    });
});

// EyeDropper API implementation
if ('EyeDropper' in window) {
    // EyeDropper button click event
    eyedropperBtn.addEventListener('click', async () => {
        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            const selectedColor = result.sRGBHex; // Selected color in HEX format

            // Update the color picker and text input with the selected color
            colorPicker.value = selectedColor;
            colorValue.value = selectedColor;

            // Regenerate palette with new color
            generatePalettes();
        } catch (e) {
            console.error(e);
        }
    });
} else {
    // If EyeDropper API is not supported, disable the button and show a message
    eyedropperBtn.disabled = true;
    eyedropperBtn.title = "Your browser does not support the EyeDropper API.";
}

// Download palette as JPEG
downloadBtn.addEventListener('click', downloadPaletteImage);

// Generate palettes based on the selected palette type
function generatePalettes() {
    const baseColor = colorPicker.value; // Use the current value of the color picker
    let paletteColors = [];

    // Initialize the paletteColors array
    for (let i = 0; i < 8; i++) {
        paletteColors[i] = '';
    }

    // Generate colors based on the selected palette type
    switch (currentPaletteType) {
        case 'monochromatic':
            paletteColors = generateMonochromatic(baseColor);
            break;
        case 'analogous':
            paletteColors = generateAnalogous(baseColor);
            break;
        case 'complementary':
            paletteColors = generateComplementary(baseColor);
            break;
        case 'splitComplementary':
            paletteColors = generateSplitComplementary(baseColor);
            break;
        case 'triadic':
            paletteColors = generateTriadic(baseColor);
            break;
        case 'tetradic':
            paletteColors = generateTetradic(baseColor);
            break;
        case 'square':
            paletteColors = generateSquare(baseColor);
            break;
        case 'powerpointTheme': // PowerPoint Monochromatic Theme
            paletteColors = generatePowerPointTheme(); // Generate monochromatic theme for PowerPoint Accents 1-6
            break;
        default:
            paletteColors = generateMonochromatic(baseColor);
    }

    // Apply locked colors
    for (let i = 0; i < paletteColors.length; i++) {
        if (lockedColors[i]) {
            paletteColors[i] = lockedColors[i]; // Use locked color
        }
    }

    currentColors = paletteColors;
    displayPalette(paletteColors); // Display the generated colors
}

// Display the palette on the page
function displayPalette(colors) {
    paletteDisplay.innerHTML = '';
    colors.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = color;
        swatch.dataset.color = color;
        swatch.dataset.index = index;

        // Color Code Display
        const colorCode = document.createElement('div');
        colorCode.classList.add('color-code');
        const format = colorFormatToggle.checked ? 'RGB' : 'HEX';
        colorCode.innerText = format === 'RGB' ? hexToRgbString(color) : color.toUpperCase();
        swatch.appendChild(colorCode);

        // Copy Color on Click
        swatch.addEventListener('click', copyColor);

        paletteDisplay.appendChild(swatch);
    });
}

// Copy color value to clipboard and display a message
function copyColor(e) {
    const color = e.currentTarget.dataset.color;
    const format = colorFormatToggle.checked ? 'RGB' : 'HEX';
    const colorText = format === 'RGB' ? hexToRgbString(color) : color.toUpperCase();

    // Copy to clipboard
    navigator.clipboard.writeText(colorText).then(() => {
        // Display a message in the center of the screen
        showCopyMessage(`Copied ${colorText}`);
    });
}

// Function to display the copy message
function showCopyMessage(message) {
    // Create the message element
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    messageElement.style.fontSize = '1.5em';
    messageElement.style.textAlign = 'center';

    // Append the message to the body
    document.body.appendChild(messageElement);

    // Remove the message after 2 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 2000);
}


// Update color codes displayed on the swatches
function updateColorCodes(format) {
    const colorCodes = document.querySelectorAll('.color-code');
    colorCodes.forEach((code) => {
        let color = code.parentElement.dataset.color;
        code.innerText = format === 'RGB' ? hexToRgbString(color) : color.toUpperCase();
    });
}

// Download the palette as a JPEG image
function downloadPaletteImage() {
    // Temporarily remove drop shadows
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.style.boxShadow = 'none'; // Remove drop shadow
    });

    // Use html2canvas to capture the palette display
    html2canvas(paletteDisplay).then(canvas => {
        // Restore the drop shadows after capturing the image
        colorSwatches.forEach(swatch => {
            swatch.style.boxShadow = ''; // Reset the box shadow to its original state
        });

        // Create a link to download the image as a JPEG
        const link = document.createElement('a');
        link.download = 'palette.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.8); // Set JPEG quality
        link.click();
    });
}

// Utility Functions

// Check if a string is a valid HEX color
function isValidHex(hex) {
    return /^#?[A-Fa-f0-9]{6}$/.test(hex);
}

// Check if a string is a valid RGB color
function isValidRgb(rgb) {
    return /^rgb\(\s*(\d{1,3}\s*,){2}\s*\d{1,3}\s*\)$/.test(rgb);
}

// Convert RGB string to HEX
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);
    return (
        '#' +
        rgbValues
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    ).toUpperCase();
}

// Convert HEX color to RGB string
function hexToRgbString(hex) {
    const rgbValues = hexToRgbArray(hex);
    return `rgb(${rgbValues.join(', ')})`;
}

// Convert HEX to RGB array
function hexToRgbArray(hex) {
    let c = hex.startsWith('#') ? hex.substring(1) : hex;
    if (c.length === 3) {
        c = c.split('').map(char => char + char).join('');
    }
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Adjust the brightness of a HEX color (Refined for valid adjustments)
function adjustBrightness(hex, percent) {
    let rgb = hexToRgbArray(hex);
    rgb = rgb.map(value => {
        const newValue = Math.min(Math.max(value + percent, 0), 255); // Keep values between 0 and 255
        return newValue;
    });
    return rgbToHex(`rgb(${rgb.join(', ')})`);
}

// Calculate luminance of a color
function calculateLuminance(color) {
    const rgb = hexToRgbArray(color).map(value => {
        const normalized = value / 255;
        return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Calculate contrast ratio between two colors
function calculateContrast(color1, color2) {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Check if the color is accessible based on contrast ratio
function isAccessible(color) {
    const backgroundColor = "#ffffff"; // Assuming white background
    const contrast = calculateContrast(color, backgroundColor);
    return contrast >= 4.5; // Accessibility standard (4.5:1 contrast ratio)
}

// Random color generator for random palettes
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Color Palette Generation Functions

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

// Generate Square Palette
function generateSquare(hex) {
    const hsl = hexToHsl(hex);

    let colors = [];
    for (let i = 0; i < 4; i++) {
        let newHue = (hsl.h + i * 90) % 360;
        colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
    }

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

        //if (!isAccessible(monochromaticColor)) {
            // Fallback to the original base color if no accessible color is found
        //    monochromaticColor = baseColor;
       // }

        colors.push(monochromaticColor);
    }

    return colors; // Return exactly 6 colors
}

// Color Conversion Functions

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
    s = s;
    l = l;

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
        c = c.split('').map(char => char + char).join('');
    }
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

// Initialize the default palette on page load
window.addEventListener('load', () => {
    generatePalettes(); // Generate the default Monochromatic palette on load
});
