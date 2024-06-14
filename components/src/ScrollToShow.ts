import { ComponentGlobalOptions, ComponentInterface, ESJinit } from './index.js';
interface ComponentSpecialOptions extends ComponentGlobalOptions {
    targetElements: string,
    threshold: number,
    scrollArea: Document | Element,
    onScreen: CallableFunction | any,
    outScreen: CallableFunction | any,
    animationDelay: string
}
export class ESJscrollToShow implements ComponentInterface {
    options: Partial<ComponentSpecialOptions> = {
        animationIn: 'fadeInDown',
        animationOut: 'fadeOut',
        animationDelay: '0s',
        threshold: 1,
        scrollArea: window.document,
        onScreen: (element: HTMLElement) => { },
        outScreen: (element: HTMLElement) => { },
    };
    constructor(options: Partial<ComponentSpecialOptions> = {}) {
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'targetElements',
        ], this.options, 'ESJscrollToShow');


        if (('IntersectionObserver' in window) !== true) {
            ESJinit.errorHandler('IntersectionObserver Object NOT SUPPORT IN YOUR BROWSER : you cant use ESJscrollToShow Class');
            return;
        }




        this.ComponentRender();




    }

    ComponentRender(): void {
        this.ComponentUi();
    }
    ComponentUi(): void {
        const self: ESJscrollToShow = this;

        const $$ObServer = new IntersectionObserver(function (entrys, ObServer) {
            entrys.forEach(function (entry) {
                const ELM = (entry.target as HTMLElement);

                ELM.style.animationDuration = `${self.options.animationSpeed ?? '2s'}`;
                ELM.style.animationDelay = `${self.options.animationDelay}`;
                if (entry.isIntersecting) {
                    ELM.onanimationstart = function () {
                        ELM.style.visibility = 'visible';
                    }
                    ESJinit.initializeAnimation(ELM, (self.options.animationIn as string), (self.options.animationOut as string));
                    self.options.onScreen(ELM);
                } else {
                    // ELM.style.visibility = 'hidden';
                    // ESJinit.initializeAnimation(ELM, (self.options.animationOut as string),(self.options.animationIn as string));
                    self.options.outScreen(ELM);
                }


            })
        }, {
            root: self.options.scrollArea,
            threshold: self.options.threshold
        })


        document.querySelectorAll(`${this.options.targetElements}`).forEach((element: Element) => {
            (element as HTMLElement).style.visibility = 'hidden';
            $$ObServer.observe(element);
        });
    }
}

