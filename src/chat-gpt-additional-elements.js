import editIcon from '/edit.svg';
import wandIcon from '/wand.svg';

export function createAdditionalElements() {
    const actionContainer = document.createElement('div');
    actionContainer.innerHTML = `
        <sp-theme color="dark" scale="medium">
            <div id="toast-messages-container"></div>
        </sp-theme>

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
        
                <sp-action-group size="m">
                    <sp-action-button id="chat-gpt-button">Autocomplete via ChatGPT</sp-action-button>
<!--                    <sp-action-button disabled id="chat-gpt-response-button">See AI response</sp-action-button>-->
                    <sp-action-button disabled id="trigger" class="chat-gpt-response-button">See AI response</sp-action-button>
                </sp-action-group>               
            </div>
        </sp-theme>
    `

    document.body.insertAdjacentElement("afterbegin", actionContainer);


    setTimeout(() => {
        document.querySelectorAll('input').forEach((input) => {
            const positionRight = input.getBoundingClientRect().right;
            const positionTop = input.getBoundingClientRect().top;

            const themeElement = document.createElement('sp-theme');
            themeElement.setAttribute('color', 'dark');
            themeElement.setAttribute('scale', 'medium');

            const dialogElement = document.createElement('overlay-trigger');
            dialogElement.setAttribute('type', 'modal');

            themeElement.innerHTML = `
            <div class="input-action-container">
            
            <sp-action-button id="js-single-input-button-${input.name}" class="js-single-input-button" data-target="${input.name}">
                <img src="${wandIcon}" slot="icon">
                Generate
            </sp-action-button>

            <overlay-trigger type="modal">
                <sp-dialog-base underlay slot="click-content">
                    <sp-dialog size="m">
                        <h2 slot="heading">Add more specifications to ${input.name.toUpperCase()} input field</h2>
                        <p>e.g. Return data in cm without measurement unit</p>
                        <sp-field-label for="story-0-m">Additional specs</sp-field-label>
                        <sp-textfield
                            name="${input.name}-ai"
                            style="width: 100%"
                            id="story-0-m"
                            multiline
                            placeholder="Add additional input description"
                        ></sp-textfield>                                        
                
                        <sp-button  
                            id="dialog-generate-${input.name}"                                                     
                            slot="button"
                            onclick="this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));"
                            data-target="${input.name}"
                            class="js-single-input-dialog-generate-button"
                        >
                            Generate
                        </sp-button>  
                
                        <sp-button
                            variant="secondary"
                            treatment="fill"
                            slot="button"
                            onclick="this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));"
                            data-target="${input.name}"
                            class="js-single-input-dialog-close-button"
                        >
                            Close
                        </sp-button>           
                    </sp-dialog>
                </sp-dialog-base>
      
                <sp-action-button slot="trigger">
                    <img slot="icon" src="${editIcon}"/>
                        Edit
                </sp-action-button>                                       
            </overlay-trigger>
            </div>
        `
            themeElement.classList.add('additional-input');
            themeElement.style.left = `${positionRight + 20}px`;
            themeElement.style.top = `${positionTop}px`;

            if(input.name !== 'ean') {
                input.parentNode.insertBefore(themeElement, input.nextSibling);
            }
        })

        const aiElementsRenderedEvent = new Event('ai-elements-rendered', { bubbles: true, composed: true });
        document.dispatchEvent(aiElementsRenderedEvent);

    }, 0)
}

