// DOM Elements
const colorIcon = document.querySelector('.color-picker');
const colorPicker = document.getElementById('colorPicker');  // Color picker from index.html
const colorValue = document.getElementById('colorValue');
const generateBtn = document.getElementById('generateBtn');
const paletteDisplay = document.querySelector('.palette-display');
const tabs = document.querySelectorAll('.tab');
const colorFormatToggle = document.getElementById('colorFormatToggle');
const toggleLabel = document.getElementById('toggleLabel');
const downloadBtn = document.getElementById('downloadBtn');
const eyedropperBtn = document.getElementById('eyedropperBtn');
const harmonyButton = document.querySelector('.harmony-button');
const harmonyText = document.querySelector('.harmony-text p');
const harmonyText2 = document.querySelector('.harmony-text2 p');
const accessibilityResult = document.getElementById('accessibility-result');
const randomPaletteBtn = document.getElementById('random-palette-btn');
const checkerBgColor = document.getElementById('checker-bg-color');
const checkerTextColor = document.getElementById('checker-text-color');
const exportCSSBtn = document.getElementById('download-css');
const exportJSONBtn = document.getElementById('download-json');
const popularPalettesSelector = document.getElementById('popular-palettes-selector');

let currentPaletteType = 'monochromatic'; // Default palette type
let currentColors = [];

// Automatically trigger Monochromatic Palette on page load
window.addEventListener('load', () => {
    currentPaletteType = 'monochromatic'; // Set default to Monochromatic
    generatePalettes(); // Generate Monochromatic palette on load
});


// Ensure the script only runs when these elements are present (on index.html)
if (colorPicker) {
    // Set initial color in the picker and input
    colorValue.value = colorPicker.value;

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

    // Harmony Descriptions
    const harmonyDescriptions = {
        "monochromatic": "A monochromatic palette uses variations of the same hue by adjusting brightness and saturation. It's simple and harmonious.",
        "analogous": "Analogous colors sit next to each other on the color wheel, providing a soothing and natural look.",
        "complementary": "Complementary colors are opposite each other on the color wheel, offering a striking contrast that can be visually impactful.",
        "splitComplementary": "Split complementary is similar to complementary, but uses the two colors adjacent to the complement for less tension.",
        "triadic": "A triadic color scheme uses three evenly spaced colors on the color wheel, offering a balanced and vibrant palette.",
        "tetradic": "Tetradic palettes use two complementary pairs, resulting in a rich and varied look.",
        "powerpointTheme": "The PowerPoint Theme gives you your accent colors from Accent 1 - Accent 6.",
    };

    // Function to update the harmony description
    function updateHarmonyDescription() {
        const harmonyTextElement = document.getElementById('harmony-text');
        harmonyTextElement.innerText = harmonyDescriptions[currentPaletteType] || "Select a palette to see its description.";
    }
    
    // Tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentPaletteType = this.dataset.palette;
            generatePalettes();
        });
    });

    // EyeDropper API implementation (index.html functionality)
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
}

// This part handles the extras.html page (Accessibility Checker, Random Palette, etc.)
// Only run this if the elements are present
if (checkerBgColor && checkerTextColor) {
    // Accessibility checker function
    function checkContrast() {
        const bgColor = checkerBgColor.value;
        const textColor = checkerTextColor.value;

        const contrastRatio = calculateContrast(bgColor, textColor);
        const resultElement = document.getElementById('accessibility-result');
        const textBox = document.querySelector('.accessibility-text-box p');

        // Update the preview box background color and text color
        document.querySelector('.accessibility-text-box').style.backgroundColor = bgColor;
        textBox.style.color = textColor; // Ensure that the text color is updated

        // Display the contrast result
        if (contrastRatio >= 4.5) {
            resultElement.innerText = `Contrast Ratio: ${contrastRatio.toFixed(2)} (Passes AA Standard)`;
            resultElement.style.color = 'green';
        } else {
            resultElement.innerText = `Contrast Ratio: ${contrastRatio.toFixed(2)} (Fails AA Standard)`;
            resultElement.style.color = 'red';
        }
    }

    // Check contrast when input changes
    checkerBgColor.addEventListener('input', checkContrast);
    checkerTextColor.addEventListener('input', checkContrast);
}

if (randomPaletteBtn) {
    // Random Palette Generator
    randomPaletteBtn.addEventListener('click', function () {
        currentColors = [];
        for (let i = 0; i < 6; i++) {
            currentColors.push(getRandomColor());
        }
        displayPalette(currentColors);
    });
}

// Predefined popular color palettes
const popularPalettes = [
    {
        name: 'Sunset',
        colors: ['#ff6b6b', '#ff8c42', '#ffd700', '#ffcc29', '#ffaa33', '#ff6f61', '#ff5e57', '#ff8a5b']
    },
    {
        name: 'Ocean Blue',
        colors: ['#004e92', '#4286f4', '#00b4db', '#0083b0', '#0052cc', '#4a90e2', '#0073e6', '#0066cc']
    },
    {
        name: 'Forest Greens',
        colors: ['#0b3d0b', '#004d00', '#008f00', '#00cc00', '#00e600', '#29a329', '#339933', '#006600']
    },
    {
        name: 'Purple Hues',
        colors: ['#6a0dad', '#9b30ff', '#800080', '#dda0dd', '#e066ff', '#ba55d3', '#9370db', '#bf00ff']
    }
];

// Populate the popular palettes dropdown
function populatePopularPalettes() {
    const selector = document.getElementById('popular-palettes-selector');

    popularPalettes.forEach(palette => {
        const option = document.createElement('option');
        option.value = palette.name;
        option.innerText = palette.name;
        selector.appendChild(option);
    });
}

// Apply the selected palette to the page
function applySelectedPalette() {
    const selectedPaletteName = document.getElementById('popular-palettes-selector').value;
    const selectedPalette = popularPalettes.find(palette => palette.name === selectedPaletteName);

    if (selectedPalette) {
        currentColors = selectedPalette.colors;
        displayPalette(currentColors);
        updateHarmonyVisualizer(currentColors);  // Update harmony visualizer with the selected palette
    }
}

// Event listener for palette selection
document.getElementById('popular-palettes-selector').addEventListener('change', applySelectedPalette);

// Call to populate the dropdown when the page loads
window.addEventListener('load', populatePopularPalettes);

// Generate palettes based on the selected palette type
function generatePalettes() {
    const baseColor = colorPicker ? colorPicker.value : "#4f4f4f"; // Use color picker or fallback color
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
        case 'powerpointTheme': // PowerPoint Monochromatic Theme
            paletteColors = generatePowerPointTheme(); // Generate monochromatic theme for PowerPoint Accents 1-6
            break;
        default:
            paletteColors = generateMonochromatic(baseColor);
    }


    currentColors = paletteColors;
    displayPalette(paletteColors); // Display the generated colors
    updateHarmonyVisualizer(paletteColors); // Update the harmony visualizer
    updateHarmonyDescription(); // Update the harmony description
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
        const format = colorFormatToggle && colorFormatToggle.checked ? 'RGB' : 'HEX';
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
    const format = colorFormatToggle && colorFormatToggle.checked ? 'RGB' : 'HEX';
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

// Update Harmony Visualizer with the highest contrast colors and hover effect
function updateHarmonyVisualizer(colors) {
    if (harmonyButton && harmonyText && harmonyText2) {
        // Initialize variables to track the highest contrast
        let maxContrast = 0;
        let color1 = colors[0]; // Default to first color
        let color2 = colors[1]; // Default to second color

        // Loop through all pairs of colors to find the highest contrast pair
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const contrast = calculateContrast(colors[i], colors[j]);
                if (contrast > maxContrast) {
                    maxContrast = contrast;
                    color1 = colors[i];
                    color2 = colors[j];
                }
            }
        }

        // Apply the highest contrast colors to the visualizer
        harmonyButton.style.backgroundColor = color1;
        harmonyButton.style.color = color2;
        harmonyText.parentElement.style.backgroundColor = color1;
        harmonyText.style.color = color2;
        harmonyText2.parentElement.style.backgroundColor = color2;
        harmonyText2.style.color = color1;

        // Add hover effect to reverse the colors
        harmonyButton.addEventListener('mouseenter', () => {
            harmonyButton.style.backgroundColor = color2;
            harmonyButton.style.color = color1;
        });

        // Reset the colors when hover ends
        harmonyButton.addEventListener('mouseleave', () => {
            harmonyButton.style.backgroundColor = color1;
            harmonyButton.style.color = color2;
        });

        // Handle pattern selection
        const patternSelector = document.getElementById('pattern-selector');
        patternSelector.addEventListener('change', () => {
            applyPatternToSVG(patternSelector.value, colors);
        });

        // Apply the default pattern on load
        applyPatternToSVG(patternSelector.value, colors);
    }
}

// Function to apply the selected pattern to the SVG container using all colors and contrast check
function applyPatternToSVG(patternName, colors) {
    const svgContainer = document.getElementById('harmony-svg');

    // Sort colors by contrast to maximize visual distinction
    const sortedColors = sortColorsByContrast(colors);

    // Define patterns that use all palette colors
    const patterns = {
        jigsaw: `<pattern id="jigsaw" patternUnits="userSpaceOnUse" width="100" height="100">
                    <rect width="100" height="100" fill="${sortedColors[7]}" />
                    <path d="M25 0v20a5 5 0 0 1-5 5H0v25h20a5 5 0 0 1 5 5v20h25V55a5 5 0 0 1 5-5h20V25H55a5 5 0 0 1-5-5V0H25z" fill="${sortedColors[1]}" />
                    <path d="M50 25h25v25H50z" fill="${sortedColors[2]}" />
                    <path d="M0 50h25v25H0z" fill="${sortedColors[3]}" />
                    <path d="M75 50h25v25H75z" fill="${sortedColors[4]}" />
                </pattern>`,
        topography: `<pattern id="topography" patternUnits="userSpaceOnUse" width="100" height="100">
                        <rect width="100" height="100" fill="${sortedColors[7]}" />
                        <path d="M50 0C33.43 4.55 17.55 18.82 5 40 17.55 61.18 33.43 75.45 50 80s32.45-14.82 45-40C82.45 18.82 66.57 4.55 50 0z" fill="${sortedColors[1]}" />
                        <path d="M50 20C40.55 25.45 25.82 38.82 15 60 25.82 71.18 40.55 85.45 50 90s24.45-14.82 35-30C69.45 48.82 58.57 34.55 50 20z" fill="${sortedColors[2]}" />
                    </pattern>`,
        overcast: `<pattern id="overcast" patternUnits="userSpaceOnUse" width="100" height="100">
                      <rect width="100" height="100" fill="${sortedColors[7]}" />
                      <circle cx="50" cy="50" r="40" fill="${sortedColors[1]}" />
                      <circle cx="30" cy="30" r="10" fill="${sortedColors[2]}" />
                      <circle cx="70" cy="70" r="10" fill="${sortedColors[3]}" />
                      <circle cx="50" cy="50" r="20" fill="${sortedColors[4]}" />
                    </pattern>`,
        plus: `<pattern id="plus" patternUnits="userSpaceOnUse" width="100" height="100">
                  <rect width="100" height="100" fill="${sortedColors[7]}" />
                  <path d="M10 40h30v20H10v30H0V60H-30V40H0V10h10v30z" fill="${sortedColors[1]}" />
                  <path d="M70 70h30v20H70v30H60V90H30V70H60V40h10v30z" fill="${sortedColors[2]}" />
                  <path d="M70 10h30v20H70v30H60V30H30V10H60V-10h10v20z" fill="${sortedColors[3]}" />
               </pattern>`,
        bubbles: `<pattern id="bubbles" patternUnits="userSpaceOnUse" width="100" height="100">
                     <rect width="100" height="100" fill="${sortedColors[7]}" />
                     <circle cx="25" cy="25" r="20" fill="${sortedColors[4]}" />
                     <circle cx="75" cy="75" r="20" fill="${sortedColors[3]}" />
                     <circle cx="50" cy="50" r="15" fill="${sortedColors[2]}" />
                     <circle cx="25" cy="75" r="10" fill="${sortedColors[1]}" />
                     <circle cx="75" cy="25" r="10" fill="${sortedColors[0]}" />
                  </pattern>`
    };

    // Construct the SVG with the selected pattern
    const patternSVG = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                ${patterns[patternName]}
            </defs>
            <rect width="200" height="200" fill="url(#${patternName})" />
        </svg>
    `;

    // Insert the SVG into the container
    svgContainer.innerHTML = patternSVG;
}





function updateHarmonyDescription() {
    const harmonyText = document.getElementById('harmony-text');
    if (harmonyText) {
        harmonyText.innerText = harmonyDescriptions[currentPaletteType] || "Select a palette to see its description.";
    }
}


// Check contrast when input changes
if (checkerBgColor && checkerTextColor) {
    checkerBgColor.addEventListener('input', checkContrast);
    checkerTextColor.addEventListener('input', checkContrast);
}

// Export options in the header
const exportButton = document.getElementById('export-button');
const exportFormatSelect = document.getElementById('export-format');

// Function to handle export based on selected format
exportButton.addEventListener('click', function () {
    const selectedFormat = exportFormatSelect.value;

    switch (selectedFormat) {
        case 'jpeg':
            downloadPaletteImage('jpeg');
            break;
        case 'png':
            downloadPaletteImage('png');
            break;
        case 'css':
            exportAsCSS();
            break;
        case 'json':
            exportAsJSON();
            break;
        case 'ase':
            exportAsASE();
            break;
        case 'txt':
            exportAsText();
            break;
        default:
            alert("Please select a valid export format.");
    }
});

// Export palette as JPEG or PNG using html2canvas
function downloadPaletteImage(format) {
    // Temporarily remove drop shadows for cleaner export
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.style.boxShadow = 'none'; // Remove drop shadow
    });

    // Use html2canvas to capture the palette display
    html2canvas(paletteDisplay).then(canvas => {
        // Restore drop shadows after capturing
        colorSwatches.forEach(swatch => {
            swatch.style.boxShadow = ''; // Reset box shadow to original state
        });

        // Create a link to download the image
        const link = document.createElement('a');
        link.download = `palette.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 1.0);
        link.click();
    });
}

// Export palette as CSS
function exportAsCSS() {
    let css = ':root {\n';
    currentColors.forEach((color, index) => {
        css += `  --color-${index + 1}: ${color};\n`;
    });
    css += '}';
    downloadFile(css, 'palette.css', 'text/css');
}

// Export palette as JSON
function exportAsJSON() {
    const json = JSON.stringify({ colors: currentColors }, null, 2);
    downloadFile(json, 'palette.json', 'application/json');
}

// Export palette as plain text (HEX codes)
function exportAsText() {
    const text = currentColors.join('\n');
    downloadFile(text, 'palette.txt', 'text/plain');
}

// Export palette as Adobe Swatch Exchange (ASE)
function exportAsASE() {
    const ase = generateASE();
    const blob = new Blob([ase], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'palette.ase';
    link.click();
}

// Helper function to generate ASE format data
function generateASE() {
    const aseData = [];
    currentColors.forEach(color => {
        const rgb = hexToRgbArray(color);
        aseData.push({
            name: color,
            model: 'RGB',
            color: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255],
            type: 'global',
        });
    });
    return convertASE(aseData);
}

// Convert to ASE file format (using Adobe's swatch structure)
function convertASE(colors) {
    let ase = [];
    ase.push('ASEF');
    ase.push(1); // Version
    ase.push(colors.length); // Number of swatches

    colors.forEach(color => {
        let nameLength = color.name.length + 1; // Include null terminator
        let blockLength = 16 + nameLength * 2;

        ase.push(0xC001); // Color entry
        ase.push(blockLength); // Block length

        // Color name
        ase.push(nameLength);
        for (let i = 0; i < nameLength; i++) {
            ase.push(color.name.charCodeAt(i));
        }

        // Color model (RGB)
        ase.push('RGB');
        ase.push(...color.color);

        // Color type (global)
        ase.push(color.type === 'global' ? 1 : 0);
    });

    return new Uint8Array(ase);
}

// Helper function to download a file
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Update color codes displayed on the swatches
function updateColorCodes(format) {
    const colorCodes = document.querySelectorAll('.color-code');
    colorCodes.forEach((code) => {
        let color = code.parentElement.dataset.color;
        code.innerText = format === 'RGB' ? hexToRgbString(color) : color.toUpperCase();
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

// Helper function to convert HEX to RGB array
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

// Function to calculate contrast between two colors
function calculateContrast(color1, color2) {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Sort colors by contrast, placing the highest contrast colors first
function sortColorsByContrast(colors) {
    const sortedColors = [...colors].sort((a, b) => {
        const contrastA = calculateContrast(a, colors[0]);
        const contrastB = calculateContrast(b, colors[0]);
        return contrastB - contrastA; // Sort by highest contrast
    });
    return sortedColors;
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

