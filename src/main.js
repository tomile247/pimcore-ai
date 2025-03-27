import '@spectrum-web-components/bundle/elements.js';
import {sendRequest} from "./chat-gpt-connect.js";
import {renderMessage} from "./toast-message.js";
import {createAdditionalElements} from "./chat-gpt-additional-elements.js";

document.addEventListener('DOMContentLoaded', () => {
    createAdditionalElements();
});

document.addEventListener('DOMContentLoaded', () => {
    const actionButton = document.getElementById('chat-gpt-button');


    function getFormFieldNames(formId) {
        const form = document.querySelector(formId);
        const formData = new FormData(form);
        return [...formData.keys()];
    }

    console.log(getFormFieldNames("form"));

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

        const objectKeys = [];

        Object.keys(requestedInputFields).forEach((key) => {
            objectKeys.push(key);
        })

        let messageBuilder = `
            Find product which has EAN code ${productEANInputField.value}.
            Provide me ${objectKeys.join(', ')} attribute values for that product.                       
            Please provide me also source link from which data is taken under the same JSON using key "source".       
        `
        messageBuilder.trim();

        if (isEanValid()) {
            sendRequest(messageBuilder, model).then((result) => {
                console.log(result.choices[0].message.content);
                return result.choices[0].message.content;

            })
                .then((message) => {
                    console.log(message);
                    return JSON.parse(message);

                }).then(json => {

                console.log(json);

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
                                    ${json.response}                                    
                                </p>
                                <sp-action-button>Copy to clipboard</sp-action-button>                               
                            </sp-dialog>
                        </sp-popover>
                    </sp-overlay>                   
                `;


                document.querySelector('.chat-gpt-response-button').removeAttribute('disabled');
                document.body.appendChild(sidebar);

                for (let input of objectKeys) {
                    if(document.querySelector(`input[name=${input}]`)) {
                        document.querySelector(`input[name=${input}]`).value = json.attributes[input]?.value;
                    }
                }

                renderMessage('info', `Data source for EAN code ${productEANInputField.value}: <a target="_blank" href="${json.source?.value}">${json.source?.value}</a>`, false);
                renderMessage('positive', 'Form filled successfully.');
            })
                .catch(error => {
                    renderMessage('negative', error);
                });
        } else {
            renderMessage('negative', 'EAN code is not valid');
        }

        actionButton.removeAttribute('pending');
    })
})

function isEanValid() {
    const eanInputField = document.querySelector('input[name="ean"]');
    return eanInputField.value.length <= 13 && eanInputField.value.length >= 8;
}