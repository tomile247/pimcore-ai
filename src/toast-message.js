export function renderMessage(variant, message, timeout = true) {
    const toastElement = document.createElement('sp-toast');
    const toastMessagesContainerElement = document.querySelector('#toast-messages-container');

    toastMessagesContainerElement.appendChild(toastElement);

    toastElement.innerHTML = message;
    toastElement.setAttribute('variant', variant);
    toastElement.setAttribute('open', '');

    if(timeout) {
        setTimeout(() => {
            toastElement.removeAttribute('open');
            toastElement.remove();
        }, 5000)
    }
}