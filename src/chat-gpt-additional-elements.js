import editIcon from '/edit.svg';
import wandIcon from '/wand.svg';

export function createAdditionalElements() {
    document.querySelectorAll('input').forEach((input) => {

        const positionRight = input.getBoundingClientRect().right;
        const positionTop = input.getBoundingClientRect().top;

        const themeElement = document.createElement('sp-theme');
        themeElement.setAttribute('color', 'dark');
        themeElement.setAttribute('scale', 'medium');

        const dialogElement = document.createElement('overlay-trigger');
        dialogElement.setAttribute('type', 'modal');

        themeElement.innerHTML = `
            <sp-action-button id="js-single-input-button-${input.name}" class="js-single-input-button" data-target="${input.name}">
                <img src="${wandIcon}" slot="icon">
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
                            variant="secondary"
                            treatment="fill"
                            slot="button"
                            onclick="this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));"
                        >
                            Close
                        </sp-button>           
                    </sp-dialog>
                </sp-dialog-base>
      
                <sp-button slot="trigger">
                    <img slot="icon" src="${editIcon}"/>
                        Edit
                </sp-button>                             
            </overlay-trigger>
        `
        themeElement.classList.add('additional-input');
        themeElement.style.left = `${positionRight + 20}px`;
        themeElement.style.top = `${positionTop}px`;

        if(input.name !== 'ean') {
            input.parentNode.insertBefore(themeElement, input.nextSibling);
        }
    })
}

