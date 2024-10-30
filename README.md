# Color Palette Generator & Accessibility Checker

Welcome to the **Color Palette Generator & Accessibility Checker** project! This web application allows users to create and export color palettes, simulate color blindness, and check accessibility compliance through contrast analysis.

![Logo](./cpg_logo.svg)

## Features

### 1. Color Palette Generator
- **Base Color Selection**: Choose a base color to generate various harmonies.
- **Color Harmonies**: Generate palettes with different harmonies like monochromatic, analogous, complementary, triadic, and more.
- **Popular Palettes**: Quickly access predefined palettes inspired by various themes.
- **Export Options**: Export palettes in multiple formats, including PNG, JPEG, CSS, JSON, Text, and SVG.
- **Simulation of Color Blindness**: View palettes through simulated protanopia, deuteranopia, tritanopia, and achromatopsia to ensure inclusivity.

### 2. Contrast Checker
- **Contrast Ratio Check**: Ensure color combinations meet WCAG AA standards for accessibility.
- **Image Analysis**: Upload images for color extraction and contrast verification.
  
### 3. Theme Customization
- **Dark & Light Modes**: Toggle between themes for a comfortable viewing experience.
- **Persistent Themes**: Your chosen theme is saved in local storage for convenience.

## Installation

To set up the project locally:
1. Clone this repository.
2. Ensure an internet connection to load external libraries (e.g., TinyColor.js, html2canvas).
3. Open `index.html` in your preferred browser to start using the application.

## Usage

1. **Generate Palettes**: Pick a color, select a harmony, and view or export your palette.
2. **Check Accessibility**: Navigate to the Contrast Checker, pick colors, or upload an image to test contrast.
3. **Theme Toggle**: Choose between light and dark modes using the selector at the top.

## Technologies Used
- **HTML & CSS**: Structuring and styling the layout.
- **JavaScript**: For functionality, including palette generation, color conversions, and contrast checking.
- **TinyColor.js**: Handling color manipulations and conversions.
- **html2canvas**: For exporting palettes as images.
- **Color-Blind.js**: For color blindness simulations.

## Project Structure

- `index.html` - Main page with color palette features.
- `accessibility_checker.html` - Separate page for contrast ratio checks and accessibility features.
- `styles.css` - Contains styling for both the palette and accessibility checker pages.
- `index.js` - Core logic for generating color palettes.
- `accessibility_checker.js` - Script for contrast checking and image analysis.
- `site.js` - Theme management and shared scripts.

## Future Enhancements
- Add more predefined popular palettes.
- Enhance the contrast checker with additional accessibility tests.
- Allow users to save palettes directly to their accounts.

## License

This project is open-source and available under the [MIT License](LICENSE).
