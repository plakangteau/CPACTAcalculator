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

        if (output.includes('e') || output.replace(/[-.]/g, '').length > MAX_DIGITS) {
            output = 'Error';
        }

        // Clear all digits first
        displayDigits.forEach(d => d.setAttribute('value', ' '));

        let characters;
        if (output === 'Error') {
            characters = ['E', 'r', 'r', 'o', 'r'];
        } else {
            let [integerPart, decimalPart] = output.split('.');
            
            // Add commas to the integer part
            integerPart = parseFloat(integerPart).toLocaleString('en-US');

            let combined = integerPart;
            if (decimalPart !== undefined) {
                combined += '.' + decimalPart;
            }
             if (output.endsWith('.')) {
                combined += '.';
            }

            characters = combined.split('');
        }

        let digitIndex = MAX_DIGITS - 1;
        for (let i = characters.length - 1; i >= 0; i--) {
            if (digitIndex < 0) break;

            let char = characters[i];

            if (char === '.' && i > 0) {
                 const prevChar = characters[i-1];
                 if(prevChar !== ',') {
                    const targetDigit = displayDigits[digitIndex + 1];
                    if(targetDigit) {
                        targetDigit.setAttribute('value', prevChar + '.');
                        i--; // Skip the previous character as it's now part of the decimal
                    }
                 } else {
                     displayDigits[digitIndex].setAttribute('value', char);
                 }
            } else {
                displayDigits[digitIndex].setAttribute('value', char);
            }
            digitIndex--;
        }

        gtIndicator.style.opacity = grandTotal !== 0 ? '1' : '0';
        memoryIndicator.style.opacity = memory !== 0 ? '1' : '0';
        errorIndicator.style.opacity = output === 'Error' ? '1' : '0';
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
        const originalInput = currentInput;
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
