# Casio JS-40B Web Calculator

## Overview

This project is a web-based calculator that emulates the functionality and design of the Casio JS-40B calculator. It is built using HTML, CSS, and JavaScript, following modern web development best practices. The user can perform standard arithmetic calculations, use memory functions, and calculate taxes. The calculator also features multiple color themes for personalization.

## Features

### Core Calculator Functions
- **Basic Arithmetic:** Addition, subtraction, multiplication, and division.
- **Number Input:** Digits 0-9 and a decimal point.
- **Clear Functions:** `C` (Clear Entry) and `AC` (All Clear).
- **Sign Change:** `+/-` button to toggle the sign of the current number.
- **Percentage:** `%` button for percentage calculations.
- **Square Root:** `√` button to calculate the square root.
- **Backspace:** A correction key (`->`) to delete the last digit.

### Advanced Functions (JS-40B Specific)
- **Memory Functions:**
    - `M+`: Add the current display value to memory.
    - `M-`: Subtract the current display value from memory.
    - `MRC`: Recall the value from memory. A second press clears the memory.
- **Tax Calculation:**
    - `TAX+`: Add tax to the current value.
    - `TAX-`: Subtract tax from the current value.
    - `SET`: A button to allow the user to set a custom tax rate.
- **Grand Total (GT):**
    - `GT`: Calculates the grand total of all previous results.

### Design & UI
- **Visual Theme:** The calculator's design is inspired by the Casio JS-40B.
- **Color Themes:** Users can choose between four color schemes:
    - Light Pink
    - Black
    - White
    - Sky Blue
- **Responsive Design:** The layout adapts to different screen sizes, making it usable on both desktop and mobile devices.
- **Modern Aesthetics:** The UI incorporates modern design elements like subtle shadows, clean typography, and a well-structured layout for a premium feel.

## Current Plan

1.  **Structure (`index.html`):** Create the HTML layout for the calculator, including the display screen, all the buttons for numbers and functions, and the color theme selection controls.
2.  **Styling (`style.css`):**
    - Implement the visual design of the calculator, mimicking the Casio JS-40B.
    - Create CSS variables for the four color themes (Light Pink, Black, White, Sky Blue).
    - Add styles for a responsive layout and modern interactive elements.
3.  **Logic (`main.js`):**
    - Implement the full logic for all calculator functions using modern JavaScript (ES Modules, async/await where needed).
    - Handle user input from all buttons.
    - Manage the calculator's state (current number, previous number, operator, memory value, etc.).
    - Implement the color theme switching functionality.
4.  **Review and Refine:** Test the calculator thoroughly for bugs, ensure all features work as expected, and refine the UI/UX based on the development guidelines.
