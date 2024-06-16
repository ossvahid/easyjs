import { ComponentGlobalOptions, ComponentInterface, ESJinit } from './index.js';

interface ComponentSpecialOptions extends ComponentGlobalOptions {
    itemsClass: string,
    indicatorClass: string,
    mode: string, // x | y | both
    events: string[],
    indicatorDefaultHidden: boolean,
    indicatorAnimationIn: string,
    indicatorAnimationOut: string,
    indicatorAnimationSpeed: string,
    indicatorMovingSpeed: string,
    destroyAfterEventEnded: boolean,
    indicatorMove: CallableFunction,
    indicatorStop: CallableFunction,
    indicatorPositionMode: string,
    indicatorRatio: string,
    indicatorXmargin: string,
    indicatorYmargin: string,
    cover: boolean,
    eventsMaxSensitivity: boolean
}

export class ESJindicator implements ComponentInterface {
    options: Partial<ComponentSpecialOptions> = {
        mode: 'both', // done
        events: ['mousemove', 'click'], // done
        indicatorDefaultHidden: false, // done
        indicatorAnimationIn: '', // done
        indicatorAnimationOut: '', // done
        destroyAfterEventEnded: false, // done
        indicatorMove: (indicator: Element, targetItem: Element) => { }, // done
        indicatorStop: (indicator: Element, targetItem: Element) => { }, // done
        indicatorMovingSpeed: '1s', // done
        indicatorAnimationSpeed: '1s', // done
        indicatorPositionMode: 'absolute', // done
        indicatorRatio: 'center', // done
        indicatorYmargin: '0px', // done
        indicatorXmargin: '0px', // done
        cover: true, // done
        eventsMaxSensitivity: false // done
    };
    constructor(options: Partial<ComponentSpecialOptions> = {}) {
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            'itemsClass',
            'indicatorClass',
        ], this.options, 'ESJindicator');

        this.ComponentRender();
    }
    ComponentRender(): void {
        const self: ESJindicator = this;
        //  document.querySelector(`.${this.options.indicatorClass as string}`).style = 'position: fixed; visibility: hidden;';
        (document.querySelectorAll(`.${self.options.indicatorClass}`) as any).forEach((element: HTMLElement) => {
            (element as any).style = `position: ${self.options.indicatorPositionMode}; visibility: ${(self.options.indicatorDefaultHidden === true) ? 'hidden' : 'visible'};`
        });







        this.options.events?.forEach(eventname => {




            document.querySelectorAll(`.${self.options.wrapperClass}`).forEach((wrap) => {
                wrap.querySelectorAll(`.${self.options.itemsClass}`).forEach((item) => {




                    item.addEventListener(`${eventname}`, function (e) {

                        self.ComponentUi(item, e);
                    })
                })
            })

        });



    }
    ComponentUi(currentItem: Element, event: any): void {
        const self: ESJindicator = this;
        let y: number = event.pageY;
        let x: number = event.pageX;
        const indicator: HTMLElement | null = document.querySelector(`.${self.options.indicatorClass}`);










        (indicator as HTMLElement).style.visibility = 'visible';
        ESJinit.initializeAnimation(indicator as HTMLElement, self.options.indicatorAnimationIn as string, self.options.indicatorAnimationOut as string);




        if (self.options.cover) {
            (indicator as HTMLElement).style.width = currentItem.scrollWidth + 'px';
            (indicator as HTMLElement).style.height = currentItem.scrollHeight + 'px';
        }

















        const indicatorWidth = indicator?.clientWidth as number;
        const indicatorHeight = indicator?.clientHeight as number;

        const indicatorXmargin = (self.options.indicatorXmargin === 'auto') ? currentItem.clientWidth + 'px' : self.options.indicatorXmargin;
        const indicatorYmargin = (self.options.indicatorYmargin === 'auto') ? currentItem.clientHeight + 'px' : self.options.indicatorYmargin;




        self.options.events?.forEach(eventname => {


            if (self.options.destroyAfterEventEnded) {
                window.addEventListener(`${eventname}`, function (ew) {
                    if (ew.target === currentItem.closest(`.${self.options.wrapperClass}`)) {
                        (indicator as HTMLElement).style.visibility = 'visible';
                    }
                    if (currentItem.closest(`.${self.options.wrapperClass}`)?.contains(ew.target as HTMLElement)) {
                        (indicator as HTMLElement).style.visibility = 'visible';
                    } else {
                        if (self.options.indicatorAnimationOut === '') {
                            (indicator as HTMLElement).style.visibility = 'hidden';
                        }
                        ESJinit.initializeAnimation(indicator as HTMLElement, self.options.indicatorAnimationOut as string, self.options.indicatorAnimationIn as string)
                    }
                });
            }


            window.addEventListener(`${eventname}`, function (e: Event) {
                if (((e as any).pageX + indicatorWidth) >= window.innerWidth && mode === 'x') {
                    (indicator as HTMLElement).style.left = `${window.innerWidth - indicatorWidth}px`;
                }

                if ((indicator as HTMLElement).getBoundingClientRect().left < 0 && mode === 'x') {
                    (indicator as HTMLElement).style.left = `0px`;
                }


            })

        });

        const mode: string | undefined = self.options.mode;

        if (self.options.indicatorRatio === 'center') {
            x = x - currentItem.scrollWidth / 2;
            y = y - currentItem.scrollHeight / 2;
        } else if (self.options.indicatorRatio === 'end') {
            x = x - currentItem.scrollWidth;
            y = y - currentItem.scrollHeight;
        }


        if (self.options.eventsMaxSensitivity === false) {
            x = (currentItem as HTMLElement).offsetLeft;
            y = (currentItem as HTMLElement).offsetTop;
        }

        if (mode === 'both' || mode === 'x') {
            (indicator as HTMLElement).style.left = `${x}px`;
        }
        if (mode === 'both' || mode === 'y') {
            (indicator as HTMLElement).style.top = `${y}px`;
        }



        (indicator as HTMLElement).style.margin = `${indicatorYmargin} ${indicatorXmargin}`;




        (indicator as HTMLElement).style.transition = `${this.options.indicatorMovingSpeed} `;



        (indicator as HTMLElement).style.animationDuration = `${this.options.indicatorAnimationSpeed} `;








        if (self.options.indicatorMove)
            self.options.indicatorMove(indicator, currentItem);

        indicator?.addEventListener('transitionend', function () {
            if (self.options.indicatorStop)
                self.options.indicatorStop(indicator, currentItem);
        })

    }
}

