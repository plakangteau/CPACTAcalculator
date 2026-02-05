document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelector('.button-grid');
    const memoryIndicator = document.querySelector('.memory-indicator');
    const errorIndicator = document.querySelector('.error-indicator');
    const gtIndicator = document.querySelector('.gt-indicator');

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
        if (formattedInput.length > 16) {
            formattedInput = parseFloat(currentInput).toExponential(9);
        }
        display.textContent = formattedInput;
        memoryIndicator.style.opacity = memory !== 0 ? '1' : '0';
        gtIndicator.style.opacity = grandTotal !== 0 ? '1' : '0';
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
        grandTotal += result;
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
        updateDisplay();
    };

    const showError = () => {
        currentInput = 'Error';
        updateDisplay();
        errorIndicator.style.opacity = '1';
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
        updateDisplay();
    };

    const clearEntry = () => {
        currentInput = '0';
        shouldResetDisplay = false;
        updateDisplay();
    };

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button') || e.target.disabled) return;

        const key = e.target.textContent;
        const keyClass = e.target.classList;

        if (keyClass.contains('number-btn')) {
            if (currentInput === '0' || shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            if (currentInput.length < 16) {
                 currentInput += key;
            }
        } else if (keyClass.contains('decimal-btn')) {
             if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else if (keyClass.contains('operator-btn') && key !== '=') {
            if (operator && !shouldResetDisplay) {
                calculate();
            }
            previousInput = currentInput;
            operator = key;
            shouldResetDisplay = true;
        } else if (key === '=') {
            if(operator) calculate();
        } else if (key === 'AC') {
            clearAll();
            grandTotal = 0;
        } else if (key === 'C') {
            clearEntry();
        } else if (key === '√') {
            const value = parseFloat(currentInput);
            if (value >= 0) {
                currentInput = Math.sqrt(value).toString();
                shouldResetDisplay = true;
            }
        } else if (key === '+/-') {
            currentInput = (parseFloat(currentInput) * -1).toString();
        } else if (key === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            shouldResetDisplay = true;
        } else if (key === '지우기') {
            if(currentInput === 'Error') return;
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
        } else if (key === 'MC') {
            memory = 0;
        } else if (key === 'MR') {
            currentInput = memory.toString();
            shouldResetDisplay = true;
        } else if (key === 'M+') {
            memory += parseFloat(currentInput);
        } else if (key === 'M-') {
            memory -= parseFloat(currentInput);
        } else if (key === 'GT') {
            currentInput = grandTotal.toString();
            shouldResetDisplay = true;
        }

        updateDisplay();
    });

    // Initialize
    updateDisplay();
});
