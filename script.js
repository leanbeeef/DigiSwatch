// DOM Elements
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
let currentPaletteType = 'monochromatic';
let currentColors = [];

// Event Listeners
generateBtn.addEventListener('click', generatePalettes);
tabs.forEach(tab => tab.addEventListener('click', switchTab));
colorFormatToggle.addEventListener('change', toggleColorFormat);
downloadBtn.addEventListener('click', downloadPaletteImage);

// Update color picker and input fields when a color is selected
colorPicker.addEventListener('input', function () {
    const selectedColor = colorPicker.value;
    colorValue.value = selectedColor; // Update the text input
    generatePalettes(); // Regenerate the palette with the new color
});

// Check if EyeDropper API is supported
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

// Update color in the text input and the icon when color is selected from picker
colorPicker.addEventListener('input', function () {
    const selectedColor = colorPicker.value;
    colorValue.value = selectedColor; // Update text input
    generatePalettes(); // Regenerate the palettes based on the new color
});

// Sync text input color with color picker (when user types in HEX or RGB manually)
colorValue.addEventListener('input', function () {
    const inputColor = colorValue.value;
    if (isValidHex(inputColor) || isValidRgb(inputColor)) {
        colorPicker.value = inputColor.startsWith('#') ? inputColor : rgbToHex(inputColor); // Update the hidden color picker
        generatePalettes(); // Regenerate the palettes based on the new input color
    }
});

// Toggle between HEX and RGB formats
colorFormatToggle.addEventListener('change', function () {
    const format = colorFormatToggle.checked ? 'RGB' : 'HEX';
    toggleLabel.innerText = format;

    if (format === 'RGB') {
        colorValue.value = hexToRgb(colorPicker.value);
    } else {
        colorValue.value = colorPicker.value;
    }
});

// Function to generate random HEX color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Switch between different palette types
function switchTab(e) {
    tabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    currentPaletteType = e.target.dataset.palette;
    generatePalettes();
}

// Generate palettes based on the selected palette type
function generatePalettes() {
    const baseColor = colorPicker.value; // Use the current value of the color picker
    let paletteColors = [];

    for (let i = 0; i < 8; i++) {
        if (lockedColors[i]) {
            paletteColors[i] = lockedColors[i];
        } else {
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
                default:
                    paletteColors = generateMonochromatic(baseColor);
            }
        }
    }

    currentColors = paletteColors;
    displayPalette(paletteColors);
}


// Parse color input from the user
function parseColorInput() {
    let colorInput = colorValue.value.trim() || colorPicker.value;
    if (isValidHex(colorInput)) {
        return colorInput.startsWith('#') ? colorInput : '#' + colorInput;
    } else if (isValidRgb(colorInput)) {
        return rgbToHex(colorInput);
    } else {
        return null;
    }
}

// Display the palette on the page
function displayPalette(colors) {
    const paletteDisplay = document.querySelector('.palette-display');
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
        colorCode.innerText = color; // Display HEX value for now
        swatch.appendChild(colorCode);

        paletteDisplay.appendChild(swatch);
    });
}

// Initialize Monochromatic palette on page load
window.addEventListener('load', () => {
    colorValue.value = colorPicker.value; // Sync the text input with the color picker value
    generatePalettes(); // Generate the default Monochromatic palette on load
});


// Toggle color format between HEX and RGB
function toggleColorFormat() {
    const format = colorFormatToggle.checked ? 'RGB' : 'HEX';
    toggleLabel.innerText = format;
    updateColorCodes(format);
}

// Update the color codes displayed on the swatches
function updateColorCodes(format) {
    const colorCodes = document.querySelectorAll('.color-code');
    colorCodes.forEach((code, index) => {
        let color = code.parentElement.dataset.color;
        code.innerText = format === 'RGB' ? hexToRgb(color) : color;
    });
}

// Copy color value to clipboard and display a message in the center of the screen
function copyColor(e) {
    const color = e.currentTarget.dataset.color;
    const format = colorFormatToggle.checked ? 'RGB' : 'HEX';
    const colorText = format === 'RGB' ? hexToRgb(color) : color;

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
    messageElement.style.display = 'flex';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    messageElement.style.width = '200px';
    messageElement.style.height = '150px';
    messageElement.style.color = 'white';
    messageElement.style.flexDirection = 'column';
    messageElement.style.justifyContent = 'center';
    messageElement.style.padding = '20px 20px';
    messageElement.style.borderRadius = '12px';
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

// Toggle lock on a color swatch
function toggleLock(index, color) {
    if (lockedColors[index]) {
        // If already locked, unlock it
        delete lockedColors[index];
    } else {
        // Lock the color
        lockedColors[index] = color;
    }
    // Update the palette display to reflect locked/unlocked state
    generatePalettes();
}

// Download the palette as a JPEG image
function downloadPaletteImage() {
    // Step 1: Hide the lock buttons
    const lockButtons = document.querySelectorAll('.lock-btn');
    lockButtons.forEach(btn => {
        btn.style.display = 'none';
    });

    // Step 2: Capture the palette display using html2canvas
    html2canvas(paletteDisplay).then(canvas => {
        // Step 3: Restore the lock buttons after capturing the image
        lockButtons.forEach(btn => {
            btn.style.display = 'block';
        });

        // Step 4: Create a link to download the image as a JPEG
        const link = document.createElement('a');
        link.download = 'palette.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.8); // Set JPEG quality
        link.click();
    });
}


// Utility Functions

// Check if a string is a valid HEX color
function isValidHex(hex) {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
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
    );
}

// Convert HEX color to RGB string
function hexToRgb(hex) {
    let c = hex.substring(1);
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const rgbValues = [
        parseInt(c.substring(0, 2), 16),
        parseInt(c.substring(2, 4), 16),
        parseInt(c.substring(4, 6), 16),
    ];
    return `rgb(${rgbValues.join(', ')})`;
}

// Adjust the brightness of a HEX color
function adjustBrightness(hex, percent) {
    let c = hex.substring(1);
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;

    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);

    return (
        '#' +
        ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
            .toUpperCase()
    );
}

// Invert a HEX color to get its complement
function invertColor(hex) {
    let c = hex.substring(1);
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    const complement = (0xFFFFFF ^ num).toString(16).padStart(6, '0');
    return '#' + complement.toUpperCase();
}

// Color Palette Generation Functions

// Generate Monochromatic Palette
function generateMonochromatic(hex) {
    let colors = [];
    for (let i = -4; i <= 3; i++) {
        let adjustedColor = adjustBrightness(hex, i * 20);
        colors.push(adjustedColor);
    }
    return colors;
}

// Generate Analogous Palette
function generateAnalogous(hex) {
    let colors = [];
    const hsl = hexToHsl(hex);

    // Generate 3 main analogous colors (base + 2 colors adjacent, 30 degrees apart)
    for (let i = -1; i <= 1; i++) {
        let newHue = (hsl.h + i * 30) % 360; // 30-degree spacing for analogous colors
        if (newHue < 0) newHue += 360;
        colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
    }

    // Add monochromatic shades for each of the analogous colors
    colors = colors.concat(generateMonochromatic(colors[0]).slice(1, 3)); // 2 shades for base color
    colors = colors.concat(generateMonochromatic(colors[1]).slice(1, 3)); // 2 shades for first analogous color
    colors = colors.concat(generateMonochromatic(colors[2]).slice(1, 2)); // 1 shade for second analogous color

    return colors.slice(0, 8); // Return exactly 8 colors
}


// Generate Complementary Palette
function generateComplementary(hex) {
    const hsl = hexToHsl(hex);

    // Calculate complementary color (180 degrees on the color wheel)
    let complementHue = (hsl.h + 180) % 360;

    // Initialize the palette with the base color and its complementary color
    let colors = [hex, hslToHex({ h: complementHue, s: hsl.s, l: hsl.l })];

    // Add monochromatic shades of the base color (2 additional shades)
    colors = colors.concat(generateMonochromatic(hex).slice(1, 3)); // Skipping the first shade (already included)

    // Add monochromatic shades of the complementary color (3 additional shades)
    colors = colors.concat(generateMonochromatic(hslToHex({ h: complementHue, s: hsl.s, l: hsl.l })).slice(1, 4)); // Skipping first shade

    return colors.slice(0, 8); // Return exactly 8 colors
}


// Generate Split Complementary Palette
function generateSplitComplementary(hex) {
    let colors = [];
    const hsl = hexToHsl(hex);

    // Calculate two split complementary hues (±30° from complement)
    let hue1 = (hsl.h + 150) % 360; // First split complement
    let hue2 = (hsl.h + 210) % 360; // Second split complement

    // Add base color
    colors.push(hex);

    // Add the two split complementary colors
    colors.push(hslToHex({ h: hue1, s: hsl.s, l: hsl.l }));
    colors.push(hslToHex({ h: hue2, s: hsl.s, l: hsl.l }));

    // Add monochromatic variations of the base and split complement colors
    colors = colors.concat(generateMonochromatic(hex).slice(1, 3)); // Two shades of base color
    colors = colors.concat(generateMonochromatic(hslToHex({ h: hue1, s: hsl.s, l: hsl.l })).slice(1, 3)); // Two shades of first split complement
    colors = colors.concat(generateMonochromatic(hslToHex({ h: hue2, s: hsl.s, l: hsl.l })).slice(1, 3)); // Two shades of second split complement

    return colors.slice(0, 8); // Return exactly 8 colors
}

// Generate Triadic Palette
function generateTriadic(hex) {
    let colors = [];
    const hsl = hexToHsl(hex);

    // Generate 3 main triadic colors (120-degree spacing between each)
    for (let i = 0; i < 3; i++) {
        let newHue = (hsl.h + i * 120) % 360; // 120-degree spacing for triadic colors
        colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
    }

    // Add monochromatic shades for each of the triadic colors
    colors = colors.concat(generateMonochromatic(colors[0]).slice(1, 3)); // 2 shades for base color
    colors = colors.concat(generateMonochromatic(colors[1]).slice(1, 3)); // 2 shades for second triadic color
    colors = colors.concat(generateMonochromatic(colors[2]).slice(1, 2)); // 1 shade for third triadic color

    return colors.slice(0, 3); // Return exactly 8 colors
}


// Generate Tetradic Palette
function generateTetradic(hex) {
    let colors = [];
    const hsl = hexToHsl(hex);

    // Generate 4 main tetradic colors (90-degree spacing between each)
    for (let i = 0; i < 4; i++) {
        let newHue = (hsl.h + i * 90) % 360; // 90-degree spacing for tetradic colors
        colors.push(hslToHex({ h: newHue, s: hsl.s, l: hsl.l }));
    }

    // Add monochromatic shades for each of the tetradic colors
    colors = colors.concat(generateMonochromatic(colors[0]).slice(1, 3)); // 2 shades for base color
    colors = colors.concat(generateMonochromatic(colors[1]).slice(1, 3)); // 2 shades for second tetradic color
    colors = colors.concat(generateMonochromatic(colors[2]).slice(1, 2)); // 1 shade for third tetradic color

    return colors.slice(0, 4); // Return exactly 8 colors
}


// Color Conversion Functions

// Convert HEX to HSL
function hexToHsl(hex) {
    let { r, g, b } = hexToRgbObj(hex);
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
function hexToRgbObj(hex) {
    let c = hex.substring(1);
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}
