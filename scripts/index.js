// index.js

document.addEventListener('DOMContentLoaded', () => {

    /* *********************************
       Variable Declarations
    ********************************* */

    // DOM Elements
    // DOM Elements
    const colorPicker = document.getElementById('colorPicker');
    const colorHexInput = document.getElementById('colorHex');
    const popularPalettesSelector = document.getElementById('popular-palettes-selector');
    const paletteDisplay = document.querySelector('.palette-display');
    const paletteTabs = document.querySelectorAll('.palette-tabs .tab');
    const paletteDropdown = document.getElementById('palette-dropdown');
    const generateRandomPaletteButton = document.getElementById('generate-random-palette');
    const generateButton = document.getElementById('generate-palette');
    const livePreviewButton = document.getElementById('live-preview-toggle-button');
    
    
    const previewElements = {
        background: document.body,
        header: document.querySelector('header'),
        buttons: document.querySelectorAll('button'),
        text: document.querySelectorAll('.content-area p, .content-area h1, .content-area h3, .dropdown h3, .top-nav label, .top-nav h1'),
        sidebar: document.querySelector('.sidebar'),
        sidebarText: document.querySelectorAll('.sidebar a'),
        dropdowns: document.querySelectorAll('.dropdown'),
    };


    // Variables to store current state
    let currentPaletteType = 'monochromatic';
    let baseColor = '#7E7E7E';
    // let currentPalette = [];
    let isLivePreviewEnabled = false;
    let randomValue = getRandomInt(1, 9); // Random integer between 0 and 8


    // Set the color picker to the base color
    colorPicker.value = baseColor;

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

    // Ensure the preview updates when the color palette changes
    document.getElementById('colorPicker').addEventListener('input', updatePreviewOnPaletteChange);
    paletteDropdown.addEventListener('change', updatePreviewOnPaletteChange);
    popularPalettesSelector.addEventListener('change', updatePreviewOnPaletteChange);
    generateRandomPaletteButton.addEventListener('click', updatePreviewOnPaletteChange);

    // Update the palette when the color picker changes
    colorPicker.addEventListener('input', () => {
        colorHexInput.value = colorPicker.value.toUpperCase();
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

    // Handle Generate Palette Button Click (if applicable)
    if (generateButton) {
        generateButton.addEventListener('click', handlePaletteSelection);
    }

    // Palette dropdown change event (for mobile view)
    paletteDropdown.addEventListener('change', () => {
        currentPaletteType = paletteDropdown.value;
        updatePalette();
    });

    // Event listener for color blindness selector
    colorBlindnessSelector.addEventListener('change', applyColorBlindnessSimulation);

    // Event listener for popular palette selection
    if (popularPalettesSelector) {
        populatePopularPalettes(); // Populate popular palettes dropdown
        popularPalettesSelector.addEventListener('change', applySelectedPalette);
    }

    // Handle Random Palette Generator Button Click
    if (generateRandomPaletteButton) {
        generateRandomPaletteButton.addEventListener('click', () => {
            currentPalette = generateRandomPalette();
            displayPalette();
        });
    }

    /* *********************************
       Initialize the Page
    ********************************* */

    // Generate and display the default monochromatic palette based on base color
    currentPalette = generateMonochromatic(baseColor);
    displayPalette();

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
        return rgbToHex({ r: rgb[0], g: rgb[1], b: rgb[2] }); // Corrected line
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
        const complementHue = (hsl.h + 180) % 360;
        const complementColor = hslToHex({ h: complementHue, s: hsl.s, l: hsl.l });

        // Start with the base color and its complementary color
        let colors = [hex, complementColor];

        // Add shades of the base color
        colors = colors.concat(generateMonochromatic(hex).slice(1, 3)); // 2 shades of base color

        // Add shades of the complementary color
        colors = colors.concat(generateMonochromatic(complementColor).slice(1, 4)); // 3 shades of complement

        // Ensure we have exactly 8 colors
        if (colors.length < 8) {
            colors.push(adjustBrightness(hex, -50)); // Add an extra shade if needed
        }

        return colors.slice(0, 8); // Trim to exactly 8 colors if there are extra
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

    // Generate Random Palette with 8 Colors
    function generateRandomPalette() {
        const palette = [];

        while (palette.length < 8) {
            let randomColor = getRandomColor();

            // Ensure uniqueness and accessibility
            if (!palette.includes(randomColor) && isAccessible(randomColor)) {
                palette.push(randomColor);
            }
        }

        return palette;
    }

    // Function to check if a color is accessible (placeholder)
    function isAccessible(hex) {
        // Implement accessibility check if needed
        return true;
    }

    // Copy color value to clipboard and display a message
    function copyColor(e) {
        const color = e.currentTarget.dataset.color;
        const colorFormatToggle = document.getElementById('colorFormatToggle'); // Ensure this element exists

        if (!color) {
            console.error('No color data attribute found.');
            return;
        }

        const format = colorFormatToggle && colorFormatToggle.checked ? 'RGB' : 'HEX';
        const colorText = format === 'RGB' ? hexToRgbString(color) : color.toUpperCase();

        // Copy to clipboard
        navigator.clipboard.writeText(colorText).then(() => {
            // Display a message in the center of the screen
            showCopyMessage(`Copied ${colorText} to clipboard!`);
        }).catch((err) => {
            console.error('Could not copy text: ', err);
        });
    }

    // Display a copy message overlay in the center of the screen
    function showCopyMessage(message) {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;

        // Style the message box
        Object.assign(messageBox.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '50px 100px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            fontSize: '1.5em',
            fontFamily: 'inherit',
            textAlign: 'center'
        });

        document.body.appendChild(messageBox);

        // Trigger fade-in
        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 100); // Slight delay to allow CSS transition

        // Fade out and remove after 2 seconds
        setTimeout(() => {
            messageBox.style.opacity = '0';
            // Remove the element after the transition
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 300); // Match the CSS transition duration
        }, 2000);
    }

    function getRandomInt(min = 1, max = 8) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      

    // Apply palette colors to the preview elements
    function applyPaletteToPreview(palette) {
        if (!palette || palette.length < 8) return;

        previewElements.background.style.backgroundColor = palette[getRandomInt() % palette.length];
        previewElements.header.style.backgroundColor = palette[getRandomInt() % palette.length];
        previewElements.sidebar.style.backgroundColor = palette[getRandomInt() % palette.length];
        console.log(previewElements)
        
        previewElements.dropdowns.forEach((dropdown) => {
            const colorIndex = getRandomInt() % palette.length;
            dropdown.style.backgroundColor = palette[colorIndex];
            dropdown.style.color = getContrastingColor(palette[colorIndex]);
        });

        previewElements.sidebarText.forEach((textElement) => {
            const colorIndex = getRandomInt() % palette.length;
            textElement.style.color = palette[colorIndex];
        });

        previewElements.buttons.forEach((button) => {
            const colorIndex = getRandomInt() % palette.length;
            button.style.backgroundColor = palette[colorIndex];
            button.style.color = getContrastingColor(palette[colorIndex]);
        });

        previewElements.text.forEach((textElement) => {
            const colorIndex = getRandomInt() % palette.length;
            textElement.style.color = palette[colorIndex];
        });
    }

    // Clear the preview styles
    function clearPreview() {
        previewElements.background.style.backgroundColor = '';
        previewElements.header.style.backgroundColor = '';
        previewElements.sidebar.style.backgroundColor = '';
        previewElements.buttons.forEach(button => {
            button.style.backgroundColor = '';
            button.style.color = '';
        });
        previewElements.text.forEach(textElement => {
            textElement.style.color = '';
        });
        previewElements.sidebarText.forEach(textElement => {
            textElement.style.color = '';
        });
    }

    // Toggle Live Preview
    livePreviewButton.addEventListener('click', () => {
        isLivePreviewEnabled = !isLivePreviewEnabled;
        livePreviewButton.textContent = isLivePreviewEnabled ? 'Disable Live Preview' : 'Enable Live Preview';
        if (isLivePreviewEnabled) {
            applyPaletteToPreview(currentPalette);
        } else {
            clearPreview();
        }
    });

    // Update preview on palette change if live preview is enabled
    function updatePreviewOnPaletteChange() {
        if (isLivePreviewEnabled) {
            applyPaletteToPreview(currentPalette);
        }
    }

    /* *********************************
       Palette Management Functions
    ********************************* */

    // Apply the selected popular palette
    function applySelectedPalette() {
        if (!popularPalettesSelector) return;

        const selectedPaletteName = popularPalettesSelector.value;
        const selectedPalette = popularPalettes.find((palette) => palette.name === selectedPaletteName);

        if (selectedPalette) {
            currentPalette = selectedPalette.colors; // Update currentPalette instead of currentColors
            displayPalette(); // Call without parameters
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

    // Function to update the palette based on the selected color
    function updatePalette() {
        currentPalette = generatePalette(baseColor, currentPaletteType);
        displayPalette();
        updateHarmonyDescription()
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
            case 'random':
                return generateRandomPalette();
            default:
                return generateMonochromatic(hex);
        }
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

    // Function to display the palette
    function displayPalette() {
        paletteDisplay.innerHTML = ''; // Clear existing palette

        currentPalette.forEach((color) => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color;
            swatch.dataset.color = color; // Set data-color attribute
            swatch.dataset.originalColor = color; // **Add this line to set data-original-color**

            const colorContent = document.createElement('div');
            colorContent.classList.add('color-content');

            const colorCode = document.createElement('div');
            colorCode.classList.add('color-code');
            colorCode.textContent = color;

            // Add click event to copy color code
            swatch.addEventListener('click', copyColor); // Use the copyColor function

            colorContent.appendChild(colorCode);
            swatch.appendChild(colorContent);

            // Optional: Highlight inaccessible colors
            if (!isAccessible(color)) {
                swatch.style.border = '2px solid red'; // Highlight inaccessible colors
            }

            paletteDisplay.appendChild(swatch);
        });

        // Re-apply color blindness simulation after displaying palette
        applyColorBlindnessSimulation();
    }

    // Function to get contrasting color (black or white)
    function getContrastingColor(hexColor) {
        const color = tinycolor(hexColor);
        return color.isLight() ? '#000000' : '#FFFFFF';
    }

    // Harmony descriptions
    const harmonyDescriptions = {
        monochromatic: "Monochromatic colors are all the colors (tones, tints, and shades) of a single hue.",
        analogous: "Analogous colors are groups of three colors that are next to each other on the color wheel.",
        complementary: "Complementary colors are pairs of colors that, when combined, cancel each other out.",
        splitComplementary: "Split complementary is a color scheme using one base color and two secondary colors.",
        triadic: "Triadic colors are evenly spaced around the color wheel.",
        tetradic: "Tetradic colors are four colors arranged into two complementary pairs.",
        powerpointTheme: "PowerPoint theme colors are designed to work well in presentations with accessible monochromatic shades."
    };

    // Function to update the harmony description based on selection
    function updateHarmonyDescription() {
        const harmonyType = document.getElementById('palette-dropdown').value;
        const descriptionElement = document.getElementById('harmony-description');
        descriptionElement.textContent = harmonyDescriptions[harmonyType] || "Select a harmony type to see its description.";
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

});

