document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelector('.button-grid');
    const themeButtons = document.querySelector('.theme-selector');
    const body = document.body;
    const memoryIndicator = document.querySelector('.memory-indicator');
    const errorIndicator = document.querySelector('.error-indicator');
    const gtIndicator = document.querySelector('.gt-indicator');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let memory = 0;
    let grandTotal = 0;
    let taxRate = 0.1; // Default 10% tax rate
    let shouldResetDisplay = false;
    let mrcPressedOnce = false;

    // Set default theme
    const savedTheme = localStorage.getItem('calculator-theme') || 'light-pink';
    body.dataset.theme = savedTheme;

    const updateDisplay = () => {
        display.textContent = currentInput;
        memoryIndicator.style.opacity = memory !== 0 ? '1' : '0';
        gtIndicator.style.opacity = grandTotal !== 0 ? '1' : '0';
    };

    const calculate = () => {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    showError();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        currentInput = result.toString();
        grandTotal += result;
        operator = null;
        previousInput = '';
        shouldResetDisplay = true;
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
        mrcPressedOnce = false;
        updateDisplay();
    };

    const clearEntry = () => {
        currentInput = '0';
        updateDisplay();
    };

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const key = e.target.textContent;
        const keyType = e.target.classList;

        mrcPressedOnce = key !== 'MRC' ? false : mrcPressedOnce;

        if (keyType.contains('number-btn')) {
            if (currentInput === '0' || shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            // Limit number length to prevent overflow
            if (currentInput.length < 15) {
                currentInput += key;
            }
        } else if (keyType.contains('operator-btn') && key !== '=') {
            if (operator) {
                calculate();
            }
            previousInput = currentInput;
            operator = key;
            shouldResetDisplay = true;
        } else if (key === '=') {
            calculate();
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
            if (previousInput && operator) {
                const prev = parseFloat(previousInput);
                const current = parseFloat(currentInput);
                currentInput = (prev * (current / 100)).toString();
                calculate();
            } else {
                currentInput = (parseFloat(currentInput) / 100).toString();
            }
        } else if (key === '→') {
            currentInput = currentInput.slice(0, -1) || '0';
        } else if (key === 'MRC') {
            if (mrcPressedOnce) {
                memory = 0;
                mrcPressedOnce = false;
            } else {
                currentInput = memory.toString();
                mrcPressedOnce = true;
                shouldResetDisplay = true;
            }
        } else if (key === 'M+') {
            memory += parseFloat(currentInput);
        } else if (key === 'M-') {
            memory -= parseFloat(currentInput);
        } else if (key === 'TAX+') {
            const value = parseFloat(currentInput);
            currentInput = (value + (value * taxRate)).toString();
        } else if (key === 'TAX-') {
            const value = parseFloat(currentInput);
            currentInput = (value - (value * taxRate)).toString();
        } else if (key === 'SET') {
            const newRate = prompt('새로운 세율을 % 단위로 입력하세요 (예: 10).', taxRate * 100);
            if (newRate !== null && !isNaN(parseFloat(newRate))) {
                taxRate = parseFloat(newRate) / 100;
            }
        } else if (key === 'GT') {
            currentInput = grandTotal.toString();
            shouldResetDisplay = true;
        }

        updateDisplay();
    });

    themeButtons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;
        const theme = e.target.dataset.theme;
        body.dataset.theme = theme;
        localStorage.setItem('calculator-theme', theme);
    });

    updateDisplay(); // Initial display update
});
