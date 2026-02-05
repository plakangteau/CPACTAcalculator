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
        let displayValue;
        // 숫자가 아닐 경우(Error 등) 포매팅하지 않음
        if (isNaN(parseFloat(currentInput))) {
            displayValue = currentInput;
        } else {
            // 지수 표기법 변환 로직 (14자리 초과 시)
            if (currentInput.replace(/[-.]/g, '').length > 14) {
                displayValue = parseFloat(currentInput).toExponential(8);
            } else {
                // 일반 숫자 포매팅
                const [integer, decimal] = currentInput.split('.');
                displayValue = `${parseInt(integer, 10).toLocaleString('en-US')}${decimal !== undefined ? `.${decimal}` : ''}`;
            }
        }
        display.textContent = displayValue;

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
        // grandTotal += result; // GT는 = 누를때마다 더해지는게 아님.
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

        // 소수점을 포함한 전체 길이가 14자리 이상이면 입력 불가
        if (currentInput.length >= 14) return;

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
                grandTotal += parseFloat(currentInput); // = 을 누른 최종 결과를 GT에 더함
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
            // 퍼센트 계산은 연산자가 있을 때와 없을 때 다르게 동작
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
            shouldResetDisplay = true; // M+, M- 후 새 숫자 입력 시작
        } else if (key === 'M-') {
            memory -= parseFloat(currentInput);
            shouldResetDisplay = true;
        } else if (keyClass.contains('gt-btn')) {
            currentInput = grandTotal.toString();
            shouldResetDisplay = true;
        }

        updateDisplay();
    });

    // Initialize
    updateDisplay();
});
