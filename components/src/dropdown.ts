import { ComponentGlobalOptions, ComponentInterface, ESJinit } from './index.js';
interface ComponentSpecialOptions extends ComponentGlobalOptions {
    handlerClass: string,
    wrapperClass: string,
    events: string[],
    position: string,
    defaultHidden: boolean,
    onOpen: CallableFunction,
    width: string,
    destroyAfterEventEnded: boolean
}


export class ESJdropdown implements ComponentInterface {

    options: Partial<ComponentSpecialOptions> = {
        events: ['click'],
        position: 'auto',
        animationIn: 'fadeIn',
        animationOut: 'fadeOut',
        defaultHidden: true,
        width: 'auto',
        destroyAfterEventEnded: true,
        onOpen: (dropdown: Element, handler: Element) => { }
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
                self.changePosition(dropdown as HTMLElement, dropdown.previousElementSibling as HTMLElement);
            }
            window.onscroll = function () {
                self.changePosition(dropdown as HTMLElement, dropdown.previousElementSibling as HTMLElement);
            }
        });

        self.options.events?.forEach(event => {











            document.querySelectorAll(`.${self.options.handlerClass}`).forEach(handler => {
                handler.addEventListener(`${event}`, function (e) {
                    self.ComponentUi(e.target as Element, e)
                })



                if (self.options.destroyAfterEventEnded) {
                    window.addEventListener(`${event}`, function (ew) {
                        const dropdown = handler.nextElementSibling as HTMLElement;
                        if (ew.target === dropdown || ew.target === handler || dropdown.contains(ew.target as HTMLElement)) {
                            // ESJinit.initializeAnimation(dropdown, `${self.options.animationIn}`);
                            dropdown.style.visibility = 'visible';
                        } else {
                            // ESJinit.initializeAnimation(dropdown, `${self.options.animationOut}`);
                            dropdown.style.visibility = 'hidden';
                        }

                    });
                }












            });


        });



    }
    ComponentUi(handler: Element, event: any | Event): void {
        const self = this;
        const dropdown = handler.nextElementSibling as HTMLElement;
        if (self.options.onOpen !== undefined) {
            self.options.onOpen(dropdown, handler)
        }
        dropdown.style.visibility = 'visible';

        ESJinit.initializeAnimation(dropdown, `${self.options.animationIn}`);
        self.changePosition(dropdown, handler);

    }


    private changePosition(dropdown: HTMLElement, handler: Element) {
        dropdown.style.transition = '0.2s';
        const x = handler.getBoundingClientRect().left + window.scrollX;
        if (this.options.position === 'auto') {
            const dropdownRect = dropdown.getBoundingClientRect();
            const dropdownBottom = dropdownRect.bottom + window.scrollY;
            const dropdownTop = dropdownRect.top + window.scrollY;



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
}