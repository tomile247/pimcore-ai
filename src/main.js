import '@spectrum-web-components/bundle/elements.js';
import {sendRequest} from "./chat-gpt-connect.js";
import {createAdditionalElements} from "./chat-gpt-additional-elements.js";

document.addEventListener('DOMContentLoaded', () => {
    createAdditionalElements();
});

const actionButton = document.getElementById('chat-gpt-button');

actionButton.addEventListener('click', () => {
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
        const textfieldShadow = document.querySelector(`sp-textfield[name="${key}-ai"]`).shadowRoot;
        requestedInputFields[key] = textfieldShadow.querySelector(`textarea[name="${key}-ai"]`)?.value;
    })

    Object.entries(requestedInputFields).forEach(([key, value]) => {
        if(value !== '') {
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

    console.log(messageBuilder);

    sendRequest(messageBuilder).then((result) => {
        return result.choices[0].message.content
    })
        .then((message) => {
            console.log(message)
            return JSON.parse(message);

    }).then(json => {
        for (let input of objectKeys) {
            document.querySelector(`input[name=${input}]`).value = json[input];
        }
    });

    actionButton.removeAttribute('pending');
})