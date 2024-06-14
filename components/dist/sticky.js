import { ESJinit } from './index.js';
export class ESJsticky {
    constructor(options = {}) {
        this.options = {
            mode: 'y',
            stickyMovingSpeed: '0.5s',
            movingInfinite: false,
            root: 'window'
        };
        ESJsticky.$this = this;
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'stickyClass',
            'wrapperClass',
        ], this.options, 'ESJsticky');
        this.ComponentRender();
    }
    ComponentRender() {
        const self = this;
        let scrollEl = window;
        if (self.options.root === 'window') {
            scrollEl = window;
        }
        else if (self.options.root === 'wrapper') {
            scrollEl = document.querySelector(`.${this.options.wrapperClass}`);
        }
        else {
            ESJinit.errorHandler('root in ESJsticky Only Accept : wrapper or window');
            return;
        }
        scrollEl === null || scrollEl === void 0 ? void 0 : scrollEl.addEventListener('scroll', function () {
            self.ComponentUi(scrollEl);
        });
    }
    ComponentUi(root) {
        const wrapper = document.querySelector(`.${this.options.wrapperClass}`);
        const sticky = wrapper === null || wrapper === void 0 ? void 0 : wrapper.querySelector(`.${this.options.stickyClass}`);
        const stickeyHeight = sticky.clientHeight;
        // const rootHeight: number = root.clientHeight ?? window.innerHeight;
        let scrolled = 0;
        if (root !== window) {
            scrolled = root.scrollTop;
        }
        else {
            scrolled = root.scrollY;
        }
        // if (scrolled > 0)
        //     scrolled -= document.querySelector('p')?.clientHeight;
        if (this.options.movingInfinite === false && ((wrapper.scrollHeight - stickeyHeight) <= scrolled)) {
            return;
        }
        //    console.log(wrapper?.scrollHeight + ' ' + scrolled)
        if (this.options.mode === 'y') {
            sticky.style.transform = `translateY(${scrolled}px)`;
        }
        else {
            sticky.style.transform = `translateX(${scrolled}px)`;
        }
        sticky.style.transition = `${this.options.stickyMovingSpeed}`;
    }
}
