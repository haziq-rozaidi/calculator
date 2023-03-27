class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operator = null;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (!this.currentOperand.includes('.') || number !== '.') {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperator(operator) {
        if (this.currentOperand !== '') {
            if (this.previousOperand !== '') {
                this.compute();
            }
            this.operator = operator;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        } else if (this.previousOperand !== '') {
            this.operator = operator;
        }
    }

    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (!isNaN(prev) && !isNaN(current)) {
            switch (this.operator) {
                case '+':
                    result = prev + current;
                    break;
                case '−':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '÷':
                    result = prev / current;
                    break;
                case '%':
                    result = prev % current;
                    break;
                default:
                    return;
            }
            this.currentOperand = result.toString();
            this.operator = null;
            this.previousOperand = '';
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits !== undefined) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operator !== null) {
            this.previousOperandTextElement.innerText =
            `${this.getDisplayNumber(this.previousOperand)} ${this.operator}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const allClearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const equalsButton = document.querySelector('[data-equals]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

const convertOperator = key => {
    return key === '-' ? '−'
        : key === '*' ? '×'
        : key === '/' ? '÷'
        : key;
};

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperator(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.addEventListener('keydown', e => {
    const operators = '+-*/%';
    const code = e.code;
    const key = e.key;

    if ((key >= 0 && key <= 9) || key === '.') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
    } else if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (key === '=' || key === 'Enter') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (code === 'KeyC') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (operators.includes(key)) {
        if (key === '/') e.preventDefault();
        calculator.chooseOperator(convertOperator(key));
        calculator.updateDisplay();
    }
});
