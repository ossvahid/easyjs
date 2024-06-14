import { ComponentGlobalOptions, ComponentInterface, ESJinit } from './index.js';
interface ComponentSpecialOptions extends ComponentGlobalOptions {

    itemClass: string,
    itemDataClass: string,
    itemHeadingClass: string,
    allItemOpenable: boolean,
    toggleSpeed: string,
    defaultItemOpen: number,
    itemActiveClass: string | null,
    icon: string

}
export class ESJaccordion implements ComponentInterface {
    options: Partial<ComponentSpecialOptions> = {
        allItemOpenable: true,
        toggleSpeed: '0.5s',
        itemActiveClass: null,
        icon: 'arrow'
    };
    constructor(options: Partial<ComponentSpecialOptions> = {}) {
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            'itemClass',
            'itemDataClass',
            'itemHeadingClass'

        ], this.options, 'ESJaccordion');

        this.ComponentRender();
    }
    ComponentRender(): void {
        this.ComponentUi();
    }
    ComponentUi(): void {
        const self = this;
        let icon: string | undefined = '';
        if (self.options.icon === 'arrow') {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 7l6 6l6-6l2 2l-8 8l-8-8z"/></svg>';
        } else if (self.options.icon === 'plus') {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"/></svg>';
        } else {
            icon = self.options.icon;
        }
        document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(function (accordion) {
            (accordion as HTMLElement).querySelectorAll(`.${self.options.itemHeadingClass}`).forEach((itemHeading, index) => {
                let Indx: number = index + 1;

                itemHeading.insertAdjacentHTML('beforeend', icon as string);

                const accordionItem: any = itemHeading.closest(`.${self.options.itemClass}`)?.querySelector(`.${self.options.itemDataClass}`);
                if (self.options.defaultItemOpen != Indx) {
                    accordionItem.style = 'display: none;';

                } else {
                    accordionItem.closest(`.${self.options.itemClass}`).querySelector(`.${self.options.itemHeadingClass}`).classList.toggle(`${self.options.itemActiveClass}`)
                }




                (itemHeading as HTMLElement).onclick = (e) => {

                    const accordionitemData: HTMLElement | any = (e.target as any).closest(`.${self.options.itemClass}`).querySelector(`.${self.options.itemDataClass}`);

                    if (self.options.allItemOpenable === false) {
                        (accordion as HTMLElement).querySelectorAll(`.${self.options.itemClass}`).forEach((item) => {

                            (item as any).querySelector(`.${self.options.itemDataClass}`).style = `display: none;`;

                            (item as any).querySelector(`.${self.options.itemDataClass}`).removeAttribute("data-is-open");



                        });

                        document.querySelectorAll(`.${self.options.wrapperClass} .${self.options.itemHeadingClass}`).forEach(element => {
                            element.classList.remove(`${self.options.itemActiveClass}`);
                        });

                    }







                    if (e.target !== accordionItem) {

                        if (!accordionitemData.getAttribute('data-is-open')) {

                            accordionitemData.style = `display: block;`;
                            accordionitemData.setAttribute("data-is-open", true);
                            accordionitemData.closest(`.${self.options.itemClass}`).querySelector(`.${self.options.itemHeadingClass}`).classList.add(`${self.options.itemActiveClass}`)
                        } else {
                            accordionitemData.closest(`.${self.options.itemClass}`).querySelector(`.${self.options.itemHeadingClass}`).classList.toggle(`${self.options.itemActiveClass}`)
                            accordionitemData.style = `display: none;`;
                            accordionitemData.removeAttribute("data-is-open");

                        }

                    }



                }
            })
        })
    }
}