document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
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

    const formatNumber = (numStr) => {
        if (typeof numStr !== 'string' || numStr.includes('e')) return numStr;
        const [integerPart, decimalPart] = numStr.split('.');
        const formattedIntegerPart = parseFloat(integerPart).toLocaleString('en-US', { maximumFractionDigits: 0 });
        return decimalPart !== undefined ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    };

    const updateDisplay = () => {
        let formattedInput = formatNumber(currentInput);
        const unformattedLength = currentInput.replace(/[.,]/g, '').length;

        if (unformattedLength > 14) {
             if (parseFloat(currentInput) !== 0) {
                formattedInput = parseFloat(currentInput).toExponential(8);
            } else {
                formattedInput = formatNumber(currentInput.substring(0, 15));
             }
        }

        display.textContent = formattedInput;
        gtIndicator.style.opacity = grandTotal !== 0 ? '1' : '0';
        memoryIndicator.style.opacity = memory !== 0 ? '1' : '0';
    };

    const calculate = () => {
        let result;
        const prev = parseFloat(previousInput.replace(/,/g, ''));
        const current = parseFloat(currentInput.replace(/,/g, ''));

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
        grandTotal += result;
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

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button') || e.target.disabled) return;

        const key = e.target.textContent;
        const keyClass = e.target.classList;

        if (keyClass.contains('number-btn')) {
            if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }
            const unformattedInput = currentInput.replace(/[.,]/g, '');
            if (unformattedInput.length < 14) {
                currentInput = currentInput === '0' ? key : currentInput + key;
            }
        } else if (keyClass.contains('decimal-btn')) {
            if (shouldResetDisplay) currentInput = '0';
            if (!currentInput.includes('.') && currentInput.length < 14) {
                currentInput += '.';
            }
        } else if (keyClass.contains('operator-btn') && !keyClass.contains('equal-btn')) {
            if (operator && !shouldResetDisplay) calculate();
            previousInput = currentInput;
            operator = key;
            shouldResetDisplay = true;
        } else if (keyClass.contains('equal-btn')) {
            if (operator) calculate();
        } else if (key === 'AC') {
            clearAll();
            grandTotal = 0;
        } else if (key === 'C') {
            currentInput = '0';
        } else if (key === '√') {
            const value = parseFloat(currentInput.replace(/,/g, ''));
            if (value >= 0) {
                currentInput = Math.sqrt(value).toString();
                shouldResetDisplay = true;
            }
        } else if (key === '+/-') {
            currentInput = (parseFloat(currentInput.replace(/,/g, '')) * -1).toString();
        } else if (key === '%') {
            currentInput = (parseFloat(currentInput.replace(/,/g, '')) / 100).toString();
            shouldResetDisplay = true;
        } else if (keyClass.contains('correction-btn')) {
            if (currentInput === 'Error') return;
            currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
        } else if (key === 'MC') {
            memory = 0;
        } else if (key === 'MR') {
            currentInput = memory.toString();
            shouldResetDisplay = true;
        } else if (key === 'M+') {
            memory += parseFloat(currentInput.replace(/,/g, ''));
        } else if (key === 'M-') {
            memory -= parseFloat(currentInput.replace(/,/g, ''));
        } else if (keyClass.contains('gt-btn')) {
            currentInput = grandTotal.toString();
            shouldResetDisplay = true;
        }

        updateDisplay();
    });

    // Initialize
    updateDisplay();
});
