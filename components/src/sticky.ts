import { ComponentGlobalOptions, ComponentInterface, ESJinit } from './index.js';
interface ComponentSpecialOptions extends ComponentGlobalOptions {
    stickyClass: string,
    mode: string,

    stickyOnMoving: CallableFunction,
    stickyOnStop: CallableFunction,
    stickyMovingSpeed: string,
    parentClass: string,
    movingInfinite: boolean,
    root: string,
}
export class ESJsticky implements ComponentInterface {
    private static $this: ESJsticky;
    options: Partial<ComponentSpecialOptions> = {
        mode: 'y',
        stickyMovingSpeed: '0.5s',
        movingInfinite: false,
        root: 'window'
    };
    constructor(options: Partial<ComponentSpecialOptions> = {}) {
        ESJsticky.$this = this;

        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'stickyClass',
            'wrapperClass',
        ], this.options, 'ESJsticky');

        this.ComponentRender();





    }

    ComponentRender(): void {
        const self: ESJsticky = this;
        let scrollEl: Window | Element | null = window;
        if (self.options.root === 'window') {
            scrollEl = window;
        } else if (self.options.root === 'wrapper') {
            scrollEl = document.querySelector(`.${this.options.wrapperClass}`);
        } else {
            ESJinit.errorHandler('root in ESJsticky Only Accept : wrapper or window');
            return;
        }

        scrollEl?.addEventListener('scroll', function () {
            self.ComponentUi(scrollEl);
        })
    }


    ComponentUi(root: Element | Window | any) {
        const wrapper = document.querySelector(`.${this.options.wrapperClass}`);
        const sticky = wrapper?.querySelector(`.${this.options.stickyClass}`) as HTMLElement;
        const stickeyHeight: number = sticky.clientHeight;
        // const rootHeight: number = root.clientHeight ?? window.innerHeight;




        let scrolled: number = 0;

        if (root !== window) {
            scrolled = root.scrollTop;
        } else {
            scrolled = root.scrollY;
        }


        // if (scrolled > 0)
        //     scrolled -= document.querySelector('p')?.clientHeight;
        

  

        if (this.options.movingInfinite === false && (((wrapper as Element).scrollHeight - stickeyHeight) <= scrolled)) {
            return;
        }





        //    console.log(wrapper?.scrollHeight + ' ' + scrolled)

        if (this.options.mode === 'y') {



            sticky.style.transform = `translateY(${scrolled}px)`;






        } else {
            sticky.style.transform = `translateX(${scrolled}px)`;
        }

        sticky.style.transition = `${this.options.stickyMovingSpeed}`;

    }



    // ComponentUi(): void {

    //     const root = ESJsticky.$this.options.root;

    //     // const parent = document.querySelector('.parent');
    //     const wrappers = document.querySelectorAll(`.${ESJsticky.$this.options.wrapperClass}`);
    //     let sp: number = 0;
    //     wrappers.forEach(function (wrapper) {
    //         const sticky = wrapper.querySelectorAll(`.${ESJsticky.$this.options.stickyClass}`);
    //         sticky.forEach(function (fixArea) {
    //             if (root !== window) {
    //                 sp = root.scrollTop;
    //             } else {
    //                 sp = root.scrollY;
    //             }



    //             if (parent !== undefined && parent !== null)
    //                 sp = sp - parent.clientHeight;







    //             if ((wrapper.scrollHeight - fixArea.clientHeight) <= sp) {
    //                 return;
    //             }

    //             if (wrapper.getBoundingClientRect().top < 0) {


    //                 fixArea.style.transform = `translateY(${sp}px)`;
    //                 fixArea.style.transition = `${ESJsticky.$this.options.stickyMovingSpeed}`;
    //             }

    //         })

    //     })



    // }
}

