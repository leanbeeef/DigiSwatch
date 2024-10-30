// DOM Elements
const bgColorInput = document.getElementById('backgroundColor');
const textColorInput = document.getElementById('foregroundColor');
const accessibilityResult = document.getElementById('accessibility-result');
const themeSelector = document.getElementById('theme-selector');
const previewBox = document.getElementById('preview-box');
const paletteDisplay = document.getElementById("extractedColors");

// Event Listeners
bgColorInput.addEventListener('input', checkContrast);
textColorInput.addEventListener('input', checkContrast);
document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

// Accessibility Contrast Checker
function checkContrast() {
    const bgColor = bgColorInput.value || "#000000"; // Default to black if empty
    const textColor = textColorInput.value || "#ffffff"; // Default to white if empty

    // Convert the background and text colors from hex to RGB
    const bgColorRGB = hexToRgb(bgColor);
    const textColorRGB = hexToRgb(textColor);

    // Calculate the contrast ratio using the new calculateContrastRatio function
    const contrastRatio = calculateContrastRatio(bgColorRGB, textColorRGB);

    // Update the preview box with the chosen colors
    previewBox.style.backgroundColor = bgColor;
    previewBox.querySelector('p').style.color = textColor;

    // Display contrast results
    if (contrastRatio >= 4.5) {
        accessibilityResult.innerHTML = `<span data-translate="contrast">Contrast Ratio:</span> ${contrastRatio.toFixed(2)} <span data-translate="passes">(Passes AA Standard)</span>`;
        accessibilityResult.style.color = 'green';
    } else {
        accessibilityResult.innerHTML = `<span data-translate="contrast">Contrast Ratio:</span> ${contrastRatio.toFixed(2)} <span data-translate="fails">(Fails AA Standard)</span>`;
        accessibilityResult.style.color = 'red';
    }
}

// Handle image upload and analysis
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                displayUploadedImage(image);
                analyzeImageContrast(image);

                // Show hidden elements after the image loads
                document.getElementById("uploadedImagePreview").style.display = "flex";
                document.getElementById("contrastDescription").style.display = "flex";
                document.querySelector(".palette-display-section").style.display = "block";
            };
        };
        reader.readAsDataURL(file);
    }
}

// Display uploaded image
function displayUploadedImage(image) {
    const uploadedImagePreview = document.getElementById("uploadedImagePreview");
    uploadedImagePreview.innerHTML = '';
    uploadedImagePreview.appendChild(image);
    image.classList.add("uploaded-image");
}

// Updated analyzeImageContrast function with styled output
function analyzeImageContrast(image) {
    const contrastDescription = document.getElementById("contrastDescription");
    const uploadedImagePreview = document.getElementById("uploadedImagePreview");

    // Create a canvas to draw and analyze the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Step 1: Extract predominant colors
    const predominantColors = getPredominantColors(ctx, canvas.width, canvas.height);

    // Step 2: Display extracted colors below the canvas
    displayExtractedColors(predominantColors);

    // Step 3: Find all color pairs and check their contrast
    const allContrastPairs = findAllContrastPairs(predominantColors);

    // Step 4: Display results in the styled description area
    if (allContrastPairs.length > 0) {
        uploadedImagePreview.innerHTML = '';
        uploadedImagePreview.appendChild(canvas);

        // Generate styled contrast issue list
        contrastDescription.innerHTML = `<ul>${allContrastPairs.map(pair => {
            const color1 = colorToString(pair.color1);
            const color2 = colorToString(pair.color2);
            const contrastStatus = pair.passes ? "pass" : "fail";

            return `
                <li>
                    <div class="color-marker" style="background-color: ${color1};"></div>
                    <div class="color-marker" style="background-color: ${color2};"></div>
                    <div class="contrast-info">
                        Color Pair: ${color1} and ${color2} - <span class="${contrastStatus}">
                        ${contrastStatus === "pass" ? "Passes" : "Fails"} (Contrast Ratio: ${pair.contrastRatio})</span>
                    </div>
                </li>`;
        }).join('')}</ul>`;
    } else {
        contrastDescription.innerHTML = '<p>No contrast issues detected.</p>';
    }
}


// Function to display the extracted colors below the canvas
function displayExtractedColors(colors) {
    const extractedColorsContainer = document.getElementById("extractedColors");
    extractedColorsContainer.innerHTML = ''; // Clear previous colors

    colors.forEach(color => {
        const colorString = colorToString(color);
        console.log(colorString);

        // Create the color swatch container with .color-swatch class
        const swatch = document.createElement('div');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = colorString;
        swatch.dataset.color = colorString; // Set data-color attribute
        swatch.dataset.originalColor = colorString; // Set data-original-color attribute

        // Create the color content container with .color-content class
        const colorContent = document.createElement('div');
        colorContent.classList.add('color-content');

        // Create the color code display
        const colorCode = document.createElement('div');
        colorCode.classList.add('color-code');
        colorCode.textContent = colorString;

        // Add click event to copy color code
        swatch.addEventListener('click', copyColor);

        // Append color code to color content, and color content to swatch
        colorContent.appendChild(colorCode);
        swatch.appendChild(colorContent);

        // Append the swatch to the extracted colors container
        extractedColorsContainer.appendChild(swatch);
    });
}

// Function to get predominant colors based on frequency analysis with dynamic output
function getPredominantColors(ctx, width, height) {
    const colorMap = {};
    const data = ctx.getImageData(0, 0, width, height).data;
    const sampleRate = 30; // Sample every 10th pixel for efficiency

    // Quantize colors by rounding each color channel to the nearest multiple of 32
    const quantize = (value) => Math.round(value / 24) * 24;

    // Step 1: Collect colors and count frequency
    for (let i = 0; i < data.length; i += 4 * sampleRate) {
        const r = quantize(data[i]);
        const g = quantize(data[i + 1]);
        const b = quantize(data[i + 2]);
        const color = `rgb(${r}, ${g}, ${b})`;

        if (colorMap[color]) {
            colorMap[color]++;
        } else {
            colorMap[color] = 1;
        }
    }

    // Step 2: Sort colors by frequency
    const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency, descending
        .map(entry => {
            const [r, g, b] = entry[0].match(/\d+/g).map(Number);
            return { r, g, b, count: entry[1] };
        });

    // Step 3: Filter colors by a frequency threshold to keep only predominant colors
    const totalPixels = (width * height) / sampleRate; // Approximate total sampled pixels
    const frequencyThreshold = 0.02; // Minimum percentage of total pixels for a color to be considered predominant
    const predominantColors = sortedColors.filter(color => color.count / totalPixels >= frequencyThreshold);

    return predominantColors.map(({ r, g, b }) => ({ r, g, b }));
}

// Check contrast between all predominant colors and return all pairs with their contrast ratios
function findAllContrastPairs(colors) {
    const contrastPairs = [];
    const contrastThreshold = 4.5; // WCAG AA standard

    // Compare each color with every other color to get all possible pairs
    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            const color1 = colors[i];
            const color2 = colors[j];
            const contrastRatio = calculateContrastRatio(color1, color2);

            // Add each pair with its contrast ratio and pass/fail status
            contrastPairs.push({
                color1,
                color2,
                contrastRatio: contrastRatio.toFixed(2),
                passes: contrastRatio >= contrastThreshold
            });
        }
    }

    return contrastPairs;
}


// Function to calculate contrast ratio between two RGB colors
function calculateContrastRatio(color1, color2) {
    const lum1 = calculateLuminance(color1);
    const lum2 = calculateLuminance(color2);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Calculate luminance of a color
function calculateLuminance({ r, g, b }) {
    const [R, G, B] = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Suggest adjustments based on the color's luminance
function getContrastSuggestion(color) {
    const luminance = calculateLuminance(color);

    // Determine if color is dark or light, and suggest adjustments accordingly
    if (luminance < 0.5) {
        return "Consider lightening this color slightly to improve contrast.";
    } else {
        return "Consider darkening this color slightly to improve contrast.";
    }
}

// Helper to convert color to string in hexadecimal format with clamping
function colorToString(color) {
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    const toHex = (value) => clamp(value).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
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

// Convert HEX to RGB (returns an object with r, g, b)
function hexToRgb(hex) {
    let c = hex.slice(1);  // Remove #
    if (c.length === 3) c = [...c].map(x => x + x).join('');  // Expand shorthand HEX
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// Initialize the preview box on load
checkContrast();
