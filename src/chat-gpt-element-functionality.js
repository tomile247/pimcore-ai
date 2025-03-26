
/* Autofill one */
document.addEventListener('ai-elements-rendered', () => {
    document.querySelectorAll('.js-single-input-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            sendSingleInputRequest(button, event);
        })
    })

    document.querySelectorAll('.js-single-input-dialog-generate-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            sendSingleInputRequest(button, event);
        })
    })
})