document.addEventListener('DOMContentLoaded', () => {
    const displayLabel = document.querySelector('.display-label')
    const displayCalc = document.querySelector('.display-calc')
    const preview = document.querySelector('.result-preview')
    const inputBtns = document.querySelectorAll('.input-btn')
    const clearBtn = document.querySelector('.clear-btn')
    const backspaceBtn = document.querySelector('.backspace-btn')
    const sqrtBtn = document.querySelector('.sqrt-btn')
    const equalBtn = document.querySelector('.equal-btn')
    const operators = /[-+*/%]/

    const updatePreview = () => {
        try {
            preview.innerHTML =
                displayLabel.value && `=${eval(displayCalc.value)}`
        } catch (e) {
            console.log('eval ошибка')
        }
    }

    const updateDisplayInput = () => {
        displayCalc.value = displayLabel.value
        replaceOperators(true)
    }

    const replaceOperators = reverse => {
        if (reverse) {
            displayCalc.value = displayCalc.value.replaceAll('÷', '/')
            displayCalc.value = displayCalc.value.replaceAll('×', '*')
            displayCalc.value = displayCalc.value.replaceAll('%', '/100*')
        } else {
            displayLabel.value = displayLabel.value.replaceAll('/', '÷')
            displayLabel.value = displayLabel.value.replaceAll('*', '×')
        }
    }

    const lastChar = () => displayCalc.value[displayCalc.value.length - 1] || ''

    const activateBtns = btns => {
        btns.forEach(btn => {
            if (displayLabel.value) {
                btn.classList.remove('disabled')
            } else {
                btn.classList.add('disabled')
            }
        })
    }

    activateBtns([
        clearBtn,
        sqrtBtn,
        backspaceBtn,
        equalBtn,
        ...[...inputBtns].filter(btn => !btn.dataset.value.match(/[0-9]/)),
    ])

    const render = () => {
        updateDisplayInput()
        updatePreview()
        replaceOperators()
        activateBtns([
            clearBtn,
            sqrtBtn,
            backspaceBtn,
            equalBtn,
            ...[...inputBtns].filter(btn => !btn.dataset.value.match(/[0-9]/)),
        ])
    }

    const eventListener = (element, callback) => {
        element.addEventListener('click', () => {
            if (!element.classList.contains('disabled')) {
                callback()
                render()
            }
        })
    }

    window.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            equalBtn.click()
        }
    })

    displayLabel.addEventListener('keypress', e => {
        const isOperator = e.key.match(operators)
        const emptyDisplay = displayLabel.value === ''
        const prevents = [
            !e.key.match(/[-+*./%0-9]/),
            emptyDisplay && isOperator,
            emptyDisplay && e.key === '.',
            lastChar() === '.' && e.key === '.',
        ]

        prevents.map(prevent => prevent && e.preventDefault())

        if (lastChar().match(operators) && isOperator) {
            displayLabel.value = displayLabel.value.slice(0, -1)
            render()
        }
    })

    displayLabel.addEventListener('input', render)

    inputBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isOperator = btn.dataset.value.match(operators) !== null
            if (displayLabel.value === '') {
                if (!isOperator && btn.dataset.value !== '.') {
                    displayLabel.value += btn.dataset.value
                }
            } else {
                if (lastChar().match(operators) && isOperator) {
                    displayLabel.value = displayLabel.value.slice(0, -1)
                    displayLabel.value += btn.dataset.value
                } else if (!(lastChar() === '.' && btn.dataset.value === '.')) {
                    displayLabel.value += btn.dataset.value
                }
            }

            render()
        })
    })

    eventListener(clearBtn, () => {
        displayLabel.value = ''
    })

    eventListener(backspaceBtn, () => {
        displayLabel.value = displayLabel.value.slice(0, -1)
    })

    eventListener(equalBtn, () => {
        if (displayLabel.value) {
            try {
                displayLabel.value = eval(displayCalc.value)
            } catch (e) {
                console.log('eval ошибка')
            }
        }
    })

    eventListener(sqrtBtn, () => {
        displayLabel.value = Math.sqrt(displayLabel.value) || 0
    })

    const { remote } = require('electron')
    const hide = document.getElementById('hide')
    const close = document.getElementById('close')

    hide.addEventListener('click', () => {
        const win = remote.getCurrentWindow()
        win.minimize()
    })

    close.addEventListener('click', () => {
        const win = remote.getCurrentWindow()
        win.close()
    })
})
