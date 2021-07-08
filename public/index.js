'use strict'

function throttle(callback, limit) {
    let waiting = false

    return function (...args) {
        if (!waiting) {
            callback.apply(this, args)
            waiting = true

            setTimeout(() => {
                waiting = false
            }, limit)
        }
    }
}


function displayForm(type) {
    const selectedForm = document.getElementById(type + '-form')
    const classicForm = document.getElementById('classic-form')
    const userReposForm = document.getElementById('user-repos-form')
    const addressForm = document.getElementById('address-form')

    selectedForm.style.display = 'block'
    selectedForm.removeAttribute('disabled')

    if (type === 'classic') {
        userReposForm.setAttribute('disabled', 'disabled')
        addressForm.setAttribute('disabled', 'disabled')
    } else if (type === 'user-repos') {
        classicForm.setAttribute('disabled', 'disabled')
        addressForm.setAttribute('disabled', 'disabled')
    } else if (type === 'address') {
        classicForm.setAttribute('disabled', 'disabled')
        userReposForm.setAttribute('disabled', 'disabled')
    }
}

window.onload = function () {
    const mainForm = document.getElementById('main-form')
    const mainSubmitButton = document.getElementById('main-submit')

    mainForm.addEventListener(
        'submit',
        throttle((event) => {
            console.log(event)
            mainSubmitButton.setAttribute('disabled', 'disabled')
        }, 10000)
    )
}
