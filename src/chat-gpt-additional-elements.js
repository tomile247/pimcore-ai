import openaiIcon from '/openai.svg';

export function createAdditionalElements() {

    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('id', 'button-container');
    buttonContainer.innerHTML = `
        <img src="${openaiIcon}">
    `;

    buttonContainer.addEventListener('click', (event) => {
        document.querySelector('#button-action-container').toggleAttribute('open')
    })

    const buttonActionContainer = document.createElement('div');
    buttonActionContainer.setAttribute('id', 'button-action-container');

    const messagesContainer = document.createElement('sp-theme');
    messagesContainer.setAttribute('id', 'messages-container');
    messagesContainer.setAttribute('color', 'dark');
    messagesContainer.setAttribute('scale', 'medium');
    messagesContainer.innerHTML = `
       <div id="toast-messages-container"></div>       
    `


    const actionContainer = document.createElement('div');
    actionContainer.innerHTML = `       
        <sp-theme color="dark" scale="medium">                        
            <div id="chat-gpt-action-container" class="form-action-container">
                <sp-field-label for="ai-model-select">AI Model:</sp-field-label>
                <sp-picker id="ai-model-select" value="gpt-3.5-turbo">
                    <sp-menu-item value="gpt-3.5-turbo">gpt-3.5-turbo</sp-menu-item>
                    <sp-menu-item disabled value="gpt-4o-mini-search-preview">gpt-4o-mini-search-preview</sp-menu-item>
                    <sp-menu-item value="gpt-4o-search-preview">gpt-4o-search-preview</sp-menu-item>
                    <sp-menu-item disabled value="gpt-4o">gpt-4o</sp-menu-item>
                    <sp-menu-item value="gpt-4o-mini">gpt-4o-mini</sp-menu-item>
                </sp-picker>
        
                <sp-button id="chat-gpt-button">Autocomplete via ChatGPT</sp-button>
                <sp-button disabled id="trigger" class="chat-gpt-response-button">See AI response</sp-button>
            </div>
        </sp-theme>
    `

    document.body.appendChild(buttonContainer);
    document.body.appendChild(buttonActionContainer);
    document.body.appendChild(messagesContainer);
    buttonActionContainer.appendChild(actionContainer);
}

