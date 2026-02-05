document.addEventListener('DOMContentLoaded', () => {
    const displayDigits = document.querySelectorAll('seven-segment-digit');
    const buttons = document.querySelector('.button-grid');
    const gtIndicator = document.querySelector('.gt-indicator');
    const memoryIndicator = document.querySelector('.memory-indicator');
    const errorIndicator = document.querySelector('.error-indicator');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let memory = 0;
    let grandTotal = 0;
    let shouldResetDisplay = false;

    const updateDisplay = () => {
        const MAX_DIGITS = 14;
        let output = currentInput.toString();

        // Clear all digits first
        displayDigits.forEach(d => d.setAttribute('value', ' '));

        // Handle Error state
        if (output.includes('e') || output.replace(/[-.]/g, '').length > MAX_DIGITS || output === 'Error') {
            'Error'.split('').forEach((char, index) => {
                if(displayDigits[index]) displayDigits[index].setAttribute('value', char);
            });
            errorIndicator.style.opacity = '1';
            return;
        } else {
            errorIndicator.style.opacity = '0';
        }

        const displayValues = Array(MAX_DIGITS).fill(' ');
        let digitIndex = MAX_DIGITS - 1;

        let [integerPart, decimalPart] = output.split('.');
        const hasDecimal = output.includes('.');

        // 1. Process Decimal Part (from right to left)
        if (decimalPart) {
            for (let i = decimalPart.length - 1; i >= 0; i--) {
                if (digitIndex < 0) break;
                displayValues[digitIndex] = decimalPart[i];
                digitIndex--;
            }
        }

        // 2. Process Integer Part (from right to left)
        let integerDigitCount = 0;
        for (let i = integerPart.length - 1; i >= 0; i--) {
            if (digitIndex < 0) break;

            let value = integerPart[i];

            // Add decimal point to the right of the last integer digit
            if (integerDigitCount === 0 && hasDecimal) {
                value += '.';
            }

            // Add comma every 3 digits (after the first group)
            if (integerDigitCount > 0 && integerDigitCount % 3 === 0 && value !== '-') {
                value += ',';
            }

            displayValues[digitIndex] = value;
            integerDigitCount++;
            digitIndex--;
        }

        // 3. Render the final values to the display components
        displayValues.forEach((value, index) => {
            displayDigits[index].setAttribute('value', value);
        });

        gtIndicator.style.opacity = grandTotal !== 0 ? '1' : '0';
        memoryIndicator.style.opacity = memory !== 0 ? '1' : '0';
    };
    
    const calculate = () => {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case 'X': result = prev * current; break;
            case '÷':
                if (current === 0) {
                    showError();
                    return;
                }
                result = prev / current;
                break;
            default: return;
        }
        currentInput = result.toString();
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
    };

    const showError = () => {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            if (currentInput === 'Error') { 
                clearAll();
                updateDisplay();
            }
        }, 1500);
    };

    const clearAll = () => {
        currentInput = '0';
        previousInput = '';
        operator = null;
        shouldResetDisplay = false;
    };
    
    const handleNumberInput = (key) => {
        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
        }
        if (currentInput.replace(/[-.]/g, '').length >= 14) return;

        if (key === '.') {
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else {
            currentInput = currentInput === '0' ? key : currentInput + key;
        }
    };

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button') || e.target.disabled) return;

        const key = e.target.textContent;
        const keyClass = e.target.classList;

        if (keyClass.contains('number-btn')) {
            handleNumberInput(key);
        } else if (keyClass.contains('operator-btn') && !keyClass.contains('equal-btn')) {
            if (currentInput === 'Error') return;
            if (operator && !shouldResetDisplay) calculate();
            previousInput = currentInput;
            operator = key;
            shouldResetDisplay = true;
        } else if (keyClass.contains('equal-btn')) {
            if (operator) {
                calculate();
                if (currentInput !== 'Error') grandTotal += parseFloat(currentInput);
            }
        } else if (key === 'AC') {
            clearAll();
            grandTotal = 0;
        } else if (key === 'C') {
            currentInput = '0';
            shouldResetDisplay = false;
        } else if (key === '√') {
            const value = parseFloat(currentInput);
            if (value >= 0) {
                currentInput = Math.sqrt(value).toString();
                shouldResetDisplay = true;
            }
        } else if (key === '+/-') {
            if (currentInput !== '0') {
                currentInput = (parseFloat(currentInput) * -1).toString();
            }
        } else if (key === '%') {
            const baseValue = parseFloat(previousInput) || 1;
            const percentage = parseFloat(currentInput);
            currentInput = (baseValue * (percentage / 100)).toString();
            shouldResetDisplay = true;
        } else if (keyClass.contains('correction-btn')) {
            if (currentInput === 'Error' || shouldResetDisplay) return;
            currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
        } else if (key === 'MC') {
            memory = 0;
        } else if (key === 'MR') {
            currentInput = memory.toString();
            shouldResetDisplay = true;
        } else if (key === 'M+') {
            memory += parseFloat(currentInput);
            shouldResetDisplay = true;
        } else if (key === 'M-') {
            memory -= parseFloat(currentInput);
            shouldResetDisplay = true;
        } else if (keyClass.contains('gt-btn')) {
            currentInput = grandTotal.toString();
            shouldResetDisplay = true;
        }

        updateDisplay();
    });

    updateDisplay();
});
