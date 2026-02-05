document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const displaySection = document.querySelector('.display-section');
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

    const adjustFontSize = () => {
        const baseFontSize = 52; // CSS의 --base-font-size와 동일한 값
        display.style.fontSize = `${baseFontSize}px`;

        // 텍스트가 컨테이너를 넘어가는지 확인
        if (display.scrollWidth > displaySection.clientWidth) {
            // 넘어간다면, 비율을 계산하여 폰트 크기를 줄임
            const ratio = displaySection.clientWidth / display.scrollWidth;
            const newSize = Math.floor(baseFontSize * ratio);
            display.style.fontSize = `${newSize}px`;
        }
    };

    const updateDisplay = () => {
        let displayValue;
        if (isNaN(parseFloat(currentInput))) {
            displayValue = currentInput;
        } else {
            if (currentInput.replace(/[-.]/g, '').length > 14 && currentInput.includes('e') === false) {
                displayValue = parseFloat(currentInput).toExponential(8);
            } else {
                const [integer, decimal] = currentInput.split('.');
                displayValue = `${parseFloat(integer).toLocaleString('en-US')}${decimal !== undefined ? `.${decimal}` : ''}`;
            }
        }
        display.textContent = displayValue;
        adjustFontSize(); // 디스플레이 업데이트 후 폰트 크기 조절

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

    // Initialize with font adjustment
    updateDisplay();
    
    // Resize event listener for responsive font size
    window.addEventListener('resize', adjustFontSize);
});
