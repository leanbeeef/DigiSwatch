// Run simulation as soon as the page loads
document.addEventListener("DOMContentLoaded", () => {
    applyColorBlindnessSimulation();
});

colorBlindnessSelector.addEventListener("change", applyColorBlindnessSimulation);

// DOM Elements

const imageUploadInput = document.getElementById('imageUpload');
const visibleCanvas = document.getElementById('visibleCanvas');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const eyeDroppersContainer = document.getElementById('eyeDroppersContainer');
const counterValueElement = document.getElementById("counter-value");
const addButton = document.getElementById("add-btn");
const removeButton = document.getElementById("remove-btn");
const contrastReportButton = document.getElementById('contrastReportButton'); // Button to view contrast report
const ctx = visibleCanvas.getContext("2d", { willReadFrequently: true });


// Initialize variables
let currentDroppers = [];
let counter = 5; // Counter for the number of eye droppers
const maxDroppers = 7;
let initialDroppersCount = 5;

// Event Listeners
imageUploadInput.addEventListener("change", handleImageUpload);
contrastReportButton.addEventListener("click", viewContrastReport);
window.addEventListener("DOMContentLoaded", () => {
    simulateUploadDefaultImage();
});
addButton.addEventListener("click", () => {
    if (counter < maxDroppers) {
        counter++;
        createRandomDropper(); // Adds a new eye dropper
        counterValueElement.textContent = counter;
    }
});
removeButton.addEventListener("click", () => {
    if (counter > 0) {
        removeLastDropper(); // Removes the last added eye dropper
        counter--;
        counterValueElement.textContent = counter;
    }
});

// Handle image upload event
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            processImageUpload(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        console.warn("No file selected for upload.");
    }
}

function simulateUploadDefaultImage() {
    fetch("../assets/defaultImage.txt")
        .then(response => response.text())
        .then(dataUrl => {
            processImageUpload(dataUrl.trim());
        })
        .catch(error => console.error("Failed to load default image:", error));
}

function processImageUpload(imageURL) {
    clearPreviousElements();

    const image = new Image();
    image.src = imageURL;

    image.onload = function () {
        console.log("Image loaded successfully.");

        visibleCanvas.width = image.width;
        visibleCanvas.height = image.height;
        const ctx = visibleCanvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(image, 0, 0);

        const canvasRect = visibleCanvas.getBoundingClientRect();
        visibleCanvas.width = canvasRect.width;
        visibleCanvas.height = canvasRect.height;

        ctx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
        ctx.drawImage(image, 0, 0, canvasRect.width, canvasRect.height);

        hiddenCanvas.width = visibleCanvas.width;
        hiddenCanvas.height = visibleCanvas.height;
        const hiddenCtx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
        hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        hiddenCtx.drawImage(image, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

        initializeEyeDroppers(visibleCanvas);
        updatePaletteColors();

        counter = 5;
        counterValueElement.textContent = counter;
    };

    image.onerror = function () {
        console.error("Failed to load image.");
    };
}

// Updated initializeEyeDroppers function
function initializeEyeDroppers(canvas, dropperCount = 5) {
    // Clear any existing droppers
    clearPreviousElements();

    const canvasRect = canvas.getBoundingClientRect();
    const dropperSize = 35;
    const padding = dropperSize / 2;

    // Define exact boundaries within the canvas to avoid overflow
    const minX = padding;
    const maxX = canvasRect.width - dropperSize;
    const minY = padding;
    const maxY = canvasRect.height - dropperSize;
    const offsetX = canvasRect.left;
    const offsetY = canvasRect.top;

    for (let i = 0; i < dropperCount; i++) {
        const dropper = document.createElement("div");
        dropper.classList.add("eye-dropper");

        // Calculate random position within boundaries
        const xPosition = offsetX + minX + Math.random() * (maxX - minX);
        const yPosition = offsetY + minY + Math.random() * (maxY - minY);

        // Apply calculated positions to the dropper
        dropper.style.position = "absolute";
        dropper.style.left = `${xPosition}px`;
        dropper.style.top = `${yPosition}px`;

        // Add drag functionality for live movement and color sampling
        dropper.addEventListener("mousedown", (event) => startDrag(event, dropper, canvas, canvasRect));

        // Append each dropper directly to the document body for accurate positioning
        document.body.appendChild(dropper);
        currentDroppers.push(dropper); // Store reference to the dropper for later removal

        // Sample the color at the dropper's initial position
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const canvasX = ((xPosition - offsetX) * canvas.width) / canvasRect.width;
        const canvasY = ((yPosition - offsetY) * canvas.height) / canvasRect.height;
        const pixelData = ctx.getImageData(canvasX, canvasY, 1, 1).data;
        const color = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
        
        // Set the dropper's background color based on the sampled color
        dropper.style.backgroundColor = colorToString(color);
    }
}


// Function to add a new random dropper when the button is clicked
function addRandomDropper() {
    const canvasRect = visibleCanvas.getBoundingClientRect();
    const dropperSize = 35; // Dropper size, to ensure droppers stay within bounds
    const padding = dropperSize / 2;

    // Define the boundaries within which the dropper can be placed
    const minX = padding;
    const maxX = canvasRect.width - dropperSize;
    const minY = padding;
    const maxY = canvasRect.height - dropperSize;
    const offsetX = canvasRect.left;
    const offsetY = canvasRect.top;

    // Call createRandomDropper with the updated parameters
    createRandomDropper(visibleCanvas, minX, maxX, minY, maxY, offsetX, offsetY);
}


function createRandomDropper() {
    const canvasRect = visibleCanvas.getBoundingClientRect();
    const dropperSize = 35; // Size of each dropper
    const padding = dropperSize / 2; // Padding to ensure droppers stay within bounds

    // Define the boundaries within which the dropper can be placed
    const minX = canvasRect.left + padding;
    const maxX = canvasRect.right - padding;
    const minY = canvasRect.top + padding;
    const maxY = canvasRect.bottom - padding;

    // Generate random x and y positions within the defined boundaries
    const xPosition = Math.random() * (maxX - minX) + minX;
    const yPosition = Math.random() * (maxY - minY) + minY;

    // Log the canvas boundaries and calculated positions for debugging
    console.log("Canvas Rect:", canvasRect);
    console.log(`Dropper Size: ${dropperSize}, Padding: ${padding}`);
    console.log(`Calculated Position (x, y): (${xPosition}, ${yPosition}) within bounds x:(${minX}, ${maxX}) y:(${minY}, ${maxY})`);

    // Create the dropper element and set its calculated position
    const dropper = document.createElement("div");
    dropper.classList.add("eye-dropper");
    dropper.style.position = "absolute";
    dropper.style.left = `${xPosition}px`;
    dropper.style.top = `${yPosition}px`;

    // Sample the color at the calculated position on the canvas
    const color = sampleColorFromCanvas(visibleCanvas, xPosition - canvasRect.left, yPosition - canvasRect.top);
    dropper.style.backgroundColor = colorToString(color);

    // Enable dragging functionality for the dropper
    dropper.addEventListener("mousedown", (event) => startDrag(event, dropper, visibleCanvas, canvasRect));

    document.body.appendChild(dropper);
    currentDroppers.push(dropper); // Store reference for future removal

    updatePaletteColors(); // Update the palette display with the new color
}

// Function to remove the last added eye dropper
function removeLastDropper() {
    const lastDropper = currentDroppers.pop(); // Remove the last dropper from the array
    if (lastDropper) {
        lastDropper.remove(); // Remove the dropper from the DOM
    }
    updatePaletteColors(); // Update the palette display after removal
}

// Sample color from a specific position on the canvas
function sampleColorFromCanvas(canvas, x, y) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const canvasX = (x * canvas.width) / canvas.getBoundingClientRect().width;
    const canvasY = (y * canvas.height) / canvas.getBoundingClientRect().height;
    const pixelData = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    return { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
}

// Drag functionality for eye droppers
function startDrag(event, dropper, canvas, canvasRect) {
    event.preventDefault();
    
    const dropperSize = 35; // Size of the eye dropper
    const offsetX = dropperSize / 2; // Center offset for the dropper width
    const offsetY = dropperSize / 2; // Center offset for the dropper height

    function onMouseMove(event) {
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        if (x >= 0 && y >= 0 && x < canvasRect.width && y < canvasRect.height) {
            // Adjust left and top to center the dropper on the cursor
            dropper.style.left = `${canvasRect.left + x - offsetX}px`;
            dropper.style.top = `${canvasRect.top + y - offsetY}px`;

            // Sample color at the new position on the canvas
            const color = sampleColorFromCanvas(canvas, x, y);
            dropper.style.backgroundColor = colorToString(color);
            updatePaletteColors();
        }
    }

    function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}


// Function to clear previous elements
function clearPreviousElements() {
    currentDroppers.forEach(dropper => {
        dropper.remove();
    });
    currentDroppers = [];
}

// Update the color palette display based on the eye dropper colors
function updatePaletteColors() {
    const droppers = document.querySelectorAll(".eye-dropper");
    const colors = Array.from(droppers).map(dropper => {
        const rgb = dropper.style.backgroundColor.match(/\d+/g).map(Number);
        return { r: rgb[0], g: rgb[1], b: rgb[2] };
    });

    // Update currentPalette with the colors from the eye droppers
    currentPalette = colors.map(color => colorToString(color));

    // Display the extracted colors and update color blindness simulation if enabled
    displayExtractedColors(colors);
    
}

function displayExtractedColors(colors) {
    const extractedColorsContainer = document.getElementById("extractedColors");
    extractedColorsContainer.innerHTML = ''; // Clear previous colors

    // Update currentPalette with extracted colors
    currentPalette = colors.map(color => colorToString(color));

    colors.forEach(color => {
        const colorString = colorToString(color);

        const swatch = document.createElement('div');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = colorString;
        swatch.dataset.color = colorString;
        swatch.dataset.originalColor = colorString;

        const colorContent = document.createElement('div');
        colorContent.classList.add('color-content');

        const colorCode = document.createElement('div');
        colorCode.classList.add('color-code');
        colorCode.textContent = colorString;

        swatch.appendChild(colorContent);
        colorContent.appendChild(colorCode);
        extractedColorsContainer.appendChild(swatch);
    });

    // Apply color blindness simulation if necessary
    applyColorBlindnessSimulation();
}



// Function to collect colors from the eye droppers and update the contrast report
function viewContrastReport() {
    const droppers = document.querySelectorAll(".eye-dropper");
    const colors = Array.from(droppers).map(dropper => {
        const rgb = dropper.style.backgroundColor.match(/\d+/g).map(Number);
        return { r: rgb[0], g: rgb[1], b: rgb[2] };
    });

    const contrastPairs = findAllContrastPairs(colors);
    displayContrastPairs(contrastPairs);

    document.getElementById("contrastModal").style.display = "flex"; // Show the modal
}

// Close the contrast report modal
document.getElementById("contrastReportButton").addEventListener("click", function() {
    document.getElementById("contrastModal").style.display = "flex";
});

// Close the modal when clicking the close button
document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("contrastModal").style.display = "none";
});

// Close the modal when clicking outside of the modal content
window.onclick = function(event) {
    const modal = document.getElementById("contrastModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Display contrast pairs in the report
function displayContrastPairs(pairs) {
    const contrastDescription = document.getElementById("contrastDescription");
    contrastDescription.innerHTML = '';

    const list = document.createElement("ul");
    list.classList.add("contrast-list");

    pairs.forEach(pair => {
        const color1 = colorToString(pair.color1);
        const color2 = colorToString(pair.color2);
        const contrastStatus = pair.passes ? "pass" : "fail";
        const contrastRatioText = contrastStatus === "pass" ? "Passes" : "Fails";

        const pairContainer = document.createElement("div");
        pairContainer.classList.add("contrast-pair");

        const colorMarkers = document.createElement("div");
        colorMarkers.classList.add("contrast-column", "color-markers");
        const colorMarker1 = document.createElement("div");
        colorMarker1.classList.add("color-marker");
        colorMarker1.style.backgroundColor = color1;

        const colorMarker2 = document.createElement("div");
        colorMarker2.classList.add("color-marker");
        colorMarker2.style.backgroundColor = color2;

        colorMarkers.appendChild(colorMarker1);
        colorMarkers.appendChild(colorMarker2);

        const colorDescription = document.createElement("div");
        colorDescription.classList.add("contrast-column", "color-description");
        colorDescription.textContent = `Color Pair: ${color1} and ${color2}`;

        const contrastResult = document.createElement("div");
        contrastResult.classList.add("contrast-column", "contrast-result");
        const resultSpan = document.createElement("span");
        resultSpan.className = contrastStatus;
        resultSpan.textContent = `${contrastRatioText} (Contrast Ratio: ${pair.contrastRatio})`;
        contrastResult.appendChild(resultSpan);

        pairContainer.appendChild(colorMarkers);
        pairContainer.appendChild(colorDescription);
        pairContainer.appendChild(contrastResult);

        const listItem = document.createElement("li");
        listItem.classList.add("contrast-list-item");
        listItem.appendChild(pairContainer);

        list.appendChild(listItem);
    });

    contrastDescription.appendChild(list);
}

// Helper functions for color, contrast calculation, etc.
function colorToString(color) {
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    const toHex = (value) => clamp(value).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function findAllContrastPairs(colors) {
    const contrastPairs = [];
    const contrastThreshold = 4.5;

    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            const color1 = colors[i];
            const color2 = colors[j];
            const contrastRatio = calculateContrastRatio(color1, color2);

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

function calculateContrastRatio(color1, color2) {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);

    return (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
}

function calculateLuminance({ r, g, b }) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Copy color to clipboard
function copyColor(e) {
    const color = e.currentTarget.dataset.color;
    if (!color) {
        console.error('No color data attribute found.');
        return;
    }

    const colorText = color.toUpperCase();
    navigator.clipboard.writeText(colorText).then(() => {
        showCopyMessage(`Copied ${colorText} to clipboard!`);
    }).catch(err => {
        console.error('Could not copy text:', err);
    });
}

function showCopyMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.textContent = message;
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
        textAlign: 'center'
    });

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 300);
    }, 2000);
}
