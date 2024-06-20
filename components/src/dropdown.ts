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
        document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(dropdown => {
            if (self.options.defaultHidden) {
                (dropdown as HTMLElement).style.visibility = 'hidden';
            }

            if (self.options.width === 'auto') {
                (dropdown as HTMLElement).style.width = 'auto';
            } else if (self.options.width === 'fit-parent') {
                (dropdown as HTMLElement).style.width = dropdown.previousElementSibling?.clientWidth + 'px';
            } else {
                (dropdown as HTMLElement).style.width = self.options.width as string;
            }

            (dropdown as HTMLElement).style.position = 'absolute';
            (dropdown as HTMLElement).style.zIndex = '9999999999';
            window.onload = function () {
                self.changePosition(dropdown as HTMLElement);
            }

        });

        window.onscroll = function () {
            self.options.events?.forEach(event => {
                document.querySelectorAll(`.${self.options.handlerClass}`).forEach(handler => {
                    self.ToggleDropDown(event, handler);

                    self.changePosition(handler.nextElementSibling as HTMLElement);
                });
            });
        }
    }
    ComponentUi(handler: Element, event: any | Event): void {
        const self = this;
        const dropdown = handler.nextElementSibling as HTMLElement;

        dropdown.style.visibility = 'visible';
        self.changePosition(dropdown);

    }


    private changePosition(dropdown: HTMLElement) {
        dropdown.style.transition = '0s';
        const handler = dropdown.previousElementSibling as Element;
        const x = handler.getBoundingClientRect().left + window.scrollX;
        if (this.options.position === 'auto') {
            const dropdownRect = dropdown.getBoundingClientRect();
            const dropdownBottom = dropdownRect.bottom + window.scrollY - 150;
            const dropdownTop = dropdownRect.top + window.scrollY + 150;



            if (dropdownBottom > window.innerHeight + window.scrollY) {
                const newY = handler.getBoundingClientRect().top - dropdown.clientHeight + window.scrollY;
                dropdown.style.top = `${newY}px`;
            } else if (dropdownTop < window.scrollY) {
                const newY = handler.getBoundingClientRect().bottom + window.scrollY;
                dropdown.style.top = `${newY}px`;
            }
            dropdown.style.left = `${x}px`;





        }
    }


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