//accessibility_checker.js

// DOM Elements

const previewBox = document.getElementById('preview-box');
const largeText = document.querySelector('#preview-box .large_text');
const littleText = document.querySelector('#preview-box .little_text');
const contrastResultCard = document.getElementById('contrastResultCard'); // Added
const bgColorInput = document.getElementById('backgroundColor');
const textColorInput = document.getElementById('foregroundColor');
const bgHexInput = document.getElementById('backgroundHex');
const textHexInput = document.getElementById('foregroundHex');


if (bgColorInput && bgHexInput) {
    // Event listener for background color input changes
    bgColorInput.addEventListener('input', () => {
        bgHexInput.value = bgColorInput.value.toUpperCase();
        checkContrast(); // Call the contrast checker to update preview
    });
}

if (textColorInput && textHexInput) {
    // Event listener for background color input changes
    textColorInput.addEventListener('input', () => {
        textHexInput.value = textColorInput.value.toUpperCase();
        checkContrast(); // Call the contrast checker to update preview
    });
}

// Main function to check contrast and apply colors
function checkContrast() {
    const bgColor = bgColorInput.value || "#000000";
    const textColor = textColorInput.value || "#ffffff";

    // Convert colors to RGB and calculate luminance
    const bgColorRGB = hexToRgb(bgColor);
    const textColorRGB = hexToRgb(textColor);
    const bgLuminance = calculateLuminance(bgColorRGB);
    const textLuminance = calculateLuminance(textColorRGB);

    // Calculate contrast ratios for large and small text
    const largeTextContrast = calculateContrastRatio(textLuminance, bgLuminance);
    const littleTextContrast = largeTextContrast * 0.8; // Adjusted for smaller text weight

    // Update the preview colors
    previewBox.style.backgroundColor = bgColor;
    previewBox.style.foregroundColor = textColor;
    largeText.style.color = textColor;
    littleText.style.color = textColor;

    // Update contrast result card dynamically
    updateContrastResult(largeTextContrast, getTextRating(largeTextContrast), getTextRating(littleTextContrast), generateContrastDescription(largeTextContrast));
}

// Function to update contrast result card
function updateContrastResult(contrastScore, largeTextRating, smallTextRating, description) {
    contrastResultCard.innerHTML = `
        <div class="contrast-score">
            <span class="score-value">${contrastScore.toFixed(2)}</span>
            <div class="score-rating">${getRatingText(contrastScore)}</div>
        </div>
        <div class="text-sizes">
            <div>Small text: <span class="text-rating">${smallTextRating}</span></div>
            <div>Large text: <span class="text-rating">${largeTextRating}</span></div>
        </div>
        <p class="contrast-suggestion">${description}</p>
    `;
}

// Function to determine rating based on contrast score
function getRatingText(score) {
    if (score >= 7) return "Excellent";
    if (score >= 4.5) return "Good";
    if (score >= 3) return "Passable";
    return "Poor";
}

// Function to get a text rating in stars based on contrast ratio
function getTextRating(contrast) {
    if (contrast >= 7) return '★★★★★';
    if (contrast >= 4.5) return '★★★☆☆';
    if (contrast >= 3) return '★★☆☆☆';
    return '★☆☆☆☆';
}

// Generate a description for the contrast based on score
function generateContrastDescription(score) {
    if (score >= 7) return "Great contrast for both small and large text.";
    if (score >= 4.5) return "Good contrast for large text; adequate for small text.";
    if (score >= 3) return "Passable contrast for large text, but may be hard to read.";
    return "Poor contrast, may be very hard to read.";
}

// Function to calculate contrast ratio
function calculateContrastRatio(fgLuminance, bgLuminance) {
    return (Math.max(fgLuminance, bgLuminance) + 0.05) /
           (Math.min(fgLuminance, bgLuminance) + 0.05);
}

// Function to calculate luminance
function calculateLuminance({ r, g, b }) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Helper to convert color to string in hexadecimal format with clamping
function colorToString(color) {
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    const toHex = (value) => clamp(value).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

// Function to convert hex to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Initialize the preview box on load
checkContrast();
