document.addEventListener('DOMContentLoaded', () => {
    const palettesContainer = document.getElementById('popular-palettes');
    const paletteModal = document.getElementById('palette-modal');
    const paletteTitle = document.getElementById('palette-title');
    const paletteDisplay = document.getElementById('palette-display-pop');
    const closeModal = document.getElementById('close-modal');


    // Example data for popular palettes; replace this with real data as needed
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

    // Populate the grid
    popularPalettes.forEach((palette, index) => {
        const paletteItem = document.createElement('div');
        paletteItem.classList.add('palette-item');

        // Palette Name
        const paletteName = document.createElement('div');
        paletteName.classList.add('palette-name');
        paletteName.textContent = palette.name;

        // Color Blocks
        const paletteColors = document.createElement('div');
        paletteColors.classList.add('palette-colors');

        palette.colors.forEach(color => {
            const colorBlock = document.createElement('div');
            colorBlock.classList.add('color-block');
            colorBlock.style.backgroundColor = color;
            paletteColors.appendChild(colorBlock);
        });

        paletteItem.appendChild(paletteName);
        paletteItem.appendChild(paletteColors);
        palettesContainer.appendChild(paletteItem);

        // Add click event to open modal with selected palette
        paletteItem.addEventListener('click', () => openModal(palette));
    });

    // Open modal and display selected palette
    function openModal(palette) {
        // Update currentPalette with hex colors directly from palette.colors
        currentPalette = palette.colors;

        paletteTitle.textContent = palette.name;
        paletteDisplay.innerHTML = ''; // Clear previous colors

        palette.colors.forEach(color => {
            const colorString = colorToString(color); // Simply returns hex string in this case
            const colorSwatch = document.createElement('div');
            colorSwatch.classList.add('color-swatch');
            colorSwatch.style.backgroundColor = colorString;
            colorSwatch.setAttribute('data-color', colorString);
            colorSwatch.dataset.color = colorString;
            colorSwatch.dataset.originalColor = colorString;

            // Add click event to copy color code
            colorSwatch.addEventListener('click', copyColor); // Use the copyColor function

            paletteDisplay.appendChild(colorSwatch);
        });

        paletteModal.style.display = 'flex';
    }

    // Helper function for color string (returns hex as-is)
    function colorToString(color) {
        return typeof color === 'string' ? color : ''; // Returns color directly if it’s a hex string
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

    // Close modal
    closeModal.addEventListener('click', () => {
        paletteModal.style.display = 'none';
    });
});

console.log(paletteDisplay); // Check if paletteDisplay is defined
console.log(paletteDisplay.children.length); // Check if it has any children