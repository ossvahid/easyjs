import { ComponentGlobalOptions, ComponentInterface, ESJinit } from './index.js';
interface ComponentSpecialOptions extends ComponentGlobalOptions {
    handlerClass: string,
    wrapperClass: string,
    events: string[],
    position: string,
    defaultHidden: boolean,
    onOpen: CallableFunction,
    onClose: CallableFunction,
    width: string,
    destroyAfterEventEnded: boolean
}

export class ESJdropdown implements ComponentInterface {

    options: Partial<ComponentSpecialOptions> = {
        events: ['click'],
        position: 'auto',
        animationIn: 'fadeIn',
        animationOut: 'fadeOut',
        animationSpeed: '0.5s',
        defaultHidden: true,
        width: 'auto',
        destroyAfterEventEnded: true,
        onOpen: (dropdown: Element, handler: Element) => { },
        onClose: (dropdown: Element, handler: Element) => { },
    }
    constructor(options: Partial<ComponentSpecialOptions> = {}) {
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            'handlerClass',
        ], this.options, 'ESJdropdown');
        this.ComponentRender();
    }
    ComponentRender(): void {
        const self = this;
        // ***************** get total dropdowns And set some options ***************** //
        document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(dropdown => {
            // ******* visibility option ******* //
            if (self.options.defaultHidden) {
                (dropdown as HTMLElement).style.visibility = 'hidden';
            }
            // ******* width option ******* //
            if (self.options.width === 'auto') {
                (dropdown as HTMLElement).style.width = 'auto';
            } else if (self.options.width === 'fit-parent') {
                (dropdown as HTMLElement).style.width = dropdown.previousElementSibling?.clientWidth + 'px';
            } else {
                (dropdown as HTMLElement).style.width = self.options.width as string;
            }
            // ******* position option ******* //
            (dropdown as HTMLElement).style.position = 'absolute';
            (dropdown as HTMLElement).style.zIndex = '9999999999';
        });


        // ***************** register events ***************** //

        function Handle() {
            document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(dropdown => {
     
                self.options.events?.forEach(event => {
                    // **** show and hide dropdown when event fired on that **** //
                    self.ToggleDropDown(event, dropdown.previousElementSibling as HTMLElement);
                });
                // **** change dropdown position **** //
                self.changePosition(dropdown as HTMLElement);

            });
        }
        window.addEventListener("scroll", Handle);
        window.addEventListener("resize", Handle);
        Handle();
    }
    ComponentUi(handler: Element, event: any | Event): void {
        const self = this;
        const dropdown = handler.nextElementSibling as HTMLElement;
        dropdown.style.visibility = 'visible';
        self.changePosition(dropdown);
    }

    // ***************** _::changePosition for change dropdown position ***************** //
    private changePosition(dropdown: HTMLElement) {
        // Temporarily disable transition for immediate position change
        dropdown.style.transition = '0s';
    
        // Get handler element
        const handler = dropdown.previousElementSibling as HTMLElement;
    
        // Get handler's position
        const handlerRect = handler.getBoundingClientRect();
        const handlerLeft = handlerRect.left + window.scrollX;
        const handlerBottom = handlerRect.bottom + window.scrollY;
    
        // Positioning based on 'auto' setting
        if (this.options.position === 'auto') {
            const dropdownRect = dropdown.getBoundingClientRect();
            const dropdownHeight = dropdownRect.height;
            const dropdownWidth = dropdownRect.width;
            
            // Check available space below and above the handler
            const availableSpaceBelow = window.innerHeight - handlerRect.bottom;
            const availableSpaceAbove = handlerRect.top;
    
            // Decide whether to place the dropdown above or below the handler
            let newTop: number;
            if (availableSpaceBelow < dropdownHeight && availableSpaceAbove >= dropdownHeight) {
                // Place above the handler
                newTop = handlerRect.top - dropdownHeight + window.scrollY;
            } else {
                // Place below the handler
                newTop = handlerBottom;
            }
    
            // Apply new position
            dropdown.style.top = `${newTop}px`;
            dropdown.style.left = `${handlerLeft}px`;
    
            // Ensure the dropdown is fully visible horizontally
            const dropdownRight = handlerLeft + dropdownWidth;
            if (dropdownRight > window.innerWidth) {
                dropdown.style.left = `${window.innerWidth - dropdownWidth}px`;
            }
    
            // Ensure the dropdown is fully visible from the left side
            if (handlerLeft < 0) {
                dropdown.style.left = '0px';
            }
        }
    }
    

    // ***************** _::ToggleDropDown for toggle dropdown ***************** //
    private ToggleDropDown(event: string, handler: Element) {
        const self = this;

        if (self.options.destroyAfterEventEnded) {
            window.addEventListener(`${event}`, function (ew) {
                const dropdown = handler.nextElementSibling as HTMLElement;
                dropdown.style.animationDuration = `${self.options.animationSpeed}`;

                if ((ew.target === dropdown || ew.target === handler || dropdown.contains(ew.target as HTMLElement)) && (!handler.hasAttribute('data-esj-dropdown'))) {

                    ESJinit.initializeAnimation(dropdown, `${self.options.animationIn}`, `${self.options.animationOut}`);
                    dropdown.onanimationend = function () {
                        dropdown.style.visibility = 'visible';
                        handler.setAttribute('data-esj-dropdown', 'true');
                        if (self.options.onOpen !== undefined) {
                            self.options.onOpen(dropdown, handler);
                        }
                    };
                    self.ComponentUi(handler, event);

                } else {
                    if (dropdown.contains(ew.target as HTMLElement)) return;

                    ESJinit.initializeAnimation(dropdown, `${self.options.animationOut}`, `${self.options.animationIn}`);
                    dropdown.onanimationend = function () {
                        dropdown.style.visibility = 'hidden';
                        handler.removeAttribute('data-esj-dropdown');
                        if (self.options.onClose !== undefined) {
                            self.options.onClose(dropdown, handler);
                        }
                    };

                }
            });
        }
        
    }

}