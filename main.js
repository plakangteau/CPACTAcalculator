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
        let formattedInput = currentInput.toString();

        // Handle scientific notation for very large/small numbers
        if (formattedInput.includes('e')) {
            formattedInput = 'Error'; // Or a more sophisticated display
        }

        // Truncate if longer than max digits (should be prevented by input handling, but as a safeguard)
        if (formattedInput.replace(/[-.]/g, '').length > MAX_DIGITS) {
             formattedInput = formattedInput.substring(0, MAX_DIGITS);
        }
        
        const hasDecimal = formattedInput.includes('.');
        const chars = formattedInput.replace('.', '').split('');
        
        let digitIndex = MAX_DIGITS - 1;
        let charIndex = chars.length - 1;

        // Clear all digits first
        displayDigits.forEach(d => d.setAttribute('value', ' '));

        while (digitIndex >= 0 && charIndex >= 0) {
            let value = chars[charIndex];
            
            if (hasDecimal && charIndex === chars.length - (formattedInput.split('.')[1] || '').length - 1) {
                 const digitToUpdate = displayDigits[digitIndex + 1];
                 const currentValue = digitToUpdate.getAttribute('value');
                 if(currentValue && currentValue !== ' ') {
                    digitToUpdate.setAttribute('value', currentValue + '.');
                 }
            }
            
            displayDigits[digitIndex].setAttribute('value', value);
            
            digitIndex--;
            charIndex--;
        }
        
        // Handle the decimal point for the last integer digit
        if (hasDecimal && formattedInput.endsWith('.')) {
             displayDigits[MAX_DIGITS - 1].setAttribute('value', '.');
        } else if (hasDecimal && charIndex === -1) { // Case like "123."
            let intLength = formattedInput.split('.')[0].length;
            const targetDigit = displayDigits[MAX_DIGITS - (chars.length - intLength) -1];
            if (targetDigit) {
                const val = targetDigit.getAttribute('value');
                if (val && val !== ' ')
                 targetDigit.setAttribute('value', val + '.');
            }
        }

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
        errorIndicator.style.opacity = '1';
        updateDisplay();
        setTimeout(() => {
            clearAll();
            errorIndicator.style.opacity = '0';
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
            if (operator && !shouldResetDisplay) calculate();
            previousInput = currentInput;
            operator = key;
            shouldResetDisplay = true;
        } else if (keyClass.contains('equal-btn')) {
            if (operator) {
                calculate();
                grandTotal += parseFloat(currentInput);
            }
        } else if (key === 'AC') {
            clearAll();
            grandTotal = 0;
        } else if (key === 'C') {
            currentInput = '0';
        } else if (key === '√') {
            const value = parseFloat(currentInput);
            if (value >= 0) {
                currentInput = Math.sqrt(value).toString();
                shouldResetDisplay = true;
            }
        } else if (key === '+/-') {
            currentInput = (parseFloat(currentInput) * -1).toString();
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
