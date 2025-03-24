import '@spectrum-web-components/bundle/elements.js';
import {sendRequest} from "./chat-gpt-connect.js";
import {createAdditionalElements} from "./chat-gpt-additional-elements.js";

document.addEventListener('DOMContentLoaded', () => {
    createAdditionalElements();
});

const actionButton = document.getElementById('chat-gpt-button');

actionButton.addEventListener('click', () => {

    const modelSelectElement = document.querySelector(`#ai-model-select`);
    const model = modelSelectElement.value;

    actionButton.setAttribute('pending', '');
    const requestedInputFields = {};
    const productEANInputField = document.querySelector('input[name="ean"]');

    for (let input of document.querySelectorAll('input')) {
        if (input.value === '' || input.value === 'undefined') {
            requestedInputFields[input.name] = '';
        }
    }

    let additionalModifications = '';

    Object.entries(requestedInputFields).forEach(([key, value]) => {
        const textfieldShadow = document?.querySelector(`sp-textfield[name="${key}-ai"]`)?.shadowRoot;
        requestedInputFields[key] = textfieldShadow?.querySelector(`textarea[name="${key}-ai"]`)?.value;
    })

    Object.entries(requestedInputFields).forEach(([key, value]) => {
        if (value !== '') {
            additionalModifications += `\n${key}: ${value}`;
        }
    })

    const objectKeys = [];

    Object.keys(requestedInputFields).forEach((key) => {
        objectKeys.push(key);
    })

    let messageBuilder = `
    Find product which has EAN code ${productEANInputField.value}.
    Provide me ${objectKeys.join(', ')} attribute values for that product.                     
    Return data in json format without beautifying and without extra text content.
    Please do not return extra information about the product or questions or attributes I didn't mentioned.       
    `

    if (additionalModifications.length > 0) {
        messageBuilder += `Please respect next attributes description: ${additionalModifications}`;
    }

    messageBuilder.trim();

    if(isEanValid()) {
        sendRequest(messageBuilder, model).then((result) => {
            return result.choices[0].message.content
        })
            .then((message) => {
                return JSON.parse(message);

            }).then(json => {
            for (let input of objectKeys) {
                document.querySelector(`input[name=${input}]`).value = json[input];
            }
            showMessage('positive', 'Form filled successfully.');
        });
    } else {
        showMessage('negative','Something went wrong');
    }

    actionButton.removeAttribute('pending');
})


/* Autofill one */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-single-input-button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const modelSelectElement = document.querySelector(`#ai-model-select`);
            const model = modelSelectElement.value;
            const inputField = document.querySelector(`input[name="${button.dataset.target}"]`);
            const eanInputField = document.querySelector(`input[name="ean"]`);

            const textfieldShadow = document?.querySelector(`sp-textfield[name="${inputField.name}-ai"]`)?.shadowRoot;
            const additionalMessage = textfieldShadow?.querySelector(`textarea[name="${inputField.name}-ai"]`)?.value;

            let message = `
                Provide me ${button.dataset.target} attribute value for product with EAN: ${eanInputField.value}.
                Please return values in JSON format.               
                `;

            if(additionalMessage.length > 0) {
                message += `\nReturn value respecting additional attribute value description: ${additionalMessage}`;
            }

            if(isEanValid()) {
                sendRequest(message, model)
                    .then((result) => {
                        return result.choices[0].message.content
                    })
                    .then((message) => {
                        return JSON.parse(message);
                    })
                    .then(json => {
                        inputField.value = json[button.dataset.target];
                        showMessage('positive',`${inputField.name.toUpperCase()} input field filled successfully.`);
                    })
            } else {
                event.preventDefault();
                event.stopPropagation();

                showMessage('negative','EAN code not valid');
            }
        })
    })
})

function isEanValid() {
    const eanInputField = document.querySelector('input[name="ean"]');
    return eanInputField.value.length <= 13 && eanInputField.value.length >= 8;
}

function showMessage(variant, message) {

    const toastElement = document.createElement('sp-toast');
    const toastMessagesContainerElement = document.querySelector('#toast-messages-container');

    toastMessagesContainerElement.appendChild(toastElement);

    toastElement.innerHTML = message;
    toastElement.setAttribute('variant', variant);
    toastElement.setAttribute('open', '');

    setTimeout(() => {
        toastElement.removeAttribute('open');
        toastElement.remove();
    }, 5000)
}