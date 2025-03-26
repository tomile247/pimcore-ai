import '@spectrum-web-components/bundle/elements.js';
import './chat-gpt-message.js';
import {sendRequest} from "./chat-gpt-connect.js";
import {renderMessage} from "./toast-message.js";
import {createAdditionalElements} from "./chat-gpt-additional-elements.js";

document.addEventListener('DOMContentLoaded', () => {
    createAdditionalElements();
});

document.addEventListener('DOMContentLoaded', () => {
    const actionButton = document.getElementById('chat-gpt-button');

    actionButton.addEventListener('click', () => {
        const modelSelectElement = document.querySelector(`#ai-model-select`);
        const model = modelSelectElement.value;


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
    Please provide me also source link from which data is taken under the same JSON using key "source".       
    `

        if (additionalModifications.length > 0) {
            messageBuilder += `Please respect next attributes description: ${additionalModifications}`;
        }

        messageBuilder.trim();

        console.log(messageBuilder);

        if(isEanValid()) {
            sendRequest(messageBuilder, model).then((result) => {

                const sidebar = document.createElement('sp-theme');
                sidebar.id = 'response-toast';
                sidebar.setAttribute('color', 'dark');
                sidebar.setAttribute('scale', 'medium');
                sidebar.innerHTML = `                                       
                    <sp-overlay trigger="trigger@click" type="manual">
                        <sp-popover class="chat-container">
                            <sp-dialog dismissable>                                
                                <span slot="heading">
                                ChatGPT response                               
                                </span>
                                <p>
                                    <pre>
                                        <code contenteditable="true">
                                            ${result.choices[0].message.content}
                                        </code>
                                    </pre>
                                </p>
                                <sp-action-button>Copy to clipboard</sp-action-button>                               
                            </sp-dialog>
                        </sp-popover>
                    </sp-overlay>                   
                `;

                // const sidebarTrigger= document.createElement('sp-button');
                document.querySelector('.chat-gpt-response-button').removeAttribute('disabled');

                // document.querySelector('#chat-gpt-action-container').appendChild(sidebarTrigger)

                document.body.appendChild(sidebar);


                return result.choices[0].message.content



            })
                .then((message) => {
                    return JSON.parse(message);

                }).then(json => {
                console.log(json)
                for (let input of objectKeys) {
                    document.querySelector(`input[name=${input}]`).value = json.attributes[input]?.value;
                }

                renderMessage('info', `Data source for EAN code ${productEANInputField.value}: <a target="_blank" href="${json.attributes.source.value}">${json.attributes.source.value}</a>`, false);
                renderMessage('positive', 'Form filled successfully.');
            })
                .catch(error => {
                    renderMessage('negative',error);
                });
        } else {
            renderMessage('negative','EAN code is not valid');
        }

        actionButton.removeAttribute('pending');
    })
})

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

function sendSingleInputRequest(element, event) {
    console.log('triggered');
    const modelSelectElement = document.querySelector(`#ai-model-select`);
    const model = modelSelectElement.value;
    const inputField = document.querySelector(`input[name="${element.dataset.target}"]`);
    const eanInputField = document.querySelector(`input[name="ean"]`);

    const textfieldShadow = document?.querySelector(`sp-textfield[name="${inputField.name}-ai"]`)?.shadowRoot;
    const additionalMessage = textfieldShadow?.querySelector(`textarea[name="${inputField.name}-ai"]`)?.value;

    let message = `
                Provide me ${element.dataset.target} attribute value for product with EAN: ${eanInputField.value}.                              
                If there are multiple values for the targeted attribute, please separate values with comma.               
                Please provide me also source link from which data is taken under the same JSON using key "source".               
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
                console.log(message);

                return JSON.parse(message);
            })
            .then(json => {
                inputField.value = json.attributes[element.dataset.target].value;
                renderMessage('positive',`${inputField.name.toUpperCase()} input field filled successfully.`);
                console.log(json)
            }).catch(error => {
            renderMessage('negative',error);
        });
    } else {
        event.preventDefault();
        event.stopPropagation();

        renderMessage('negative',`EAN code not valid. Input field ${inputField.name.toUpperCase()} can not be filled`);
    }
}

function isEanValid() {
    const eanInputField = document.querySelector('input[name="ean"]');
    return eanInputField.value.length <= 13 && eanInputField.value.length >= 8;
}