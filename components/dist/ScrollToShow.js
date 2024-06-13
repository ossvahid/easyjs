import { ESJinit } from './index.js';
export class ESJscrollToShow {
    constructor(options = {}) {
        this.options = {
            animationIn: 'fadeInDown',
            animationOut: 'fadeOut',
            animationDelay: '0s',
            threshold: 1,
            scrollArea: window.document,
            onScreen: (element) => { },
            outScreen: (element) => { },
        };
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
    ComponentRender() {
        this.ComponentUi();
    }
    ComponentUi() {
        const self = this;
        const $$ObServer = new IntersectionObserver(function (entrys, ObServer) {
            entrys.forEach(function (entry) {
                var _a;
                const ELM = entry.target;
                ELM.style.animationDuration = `${(_a = self.options.animationSpeed) !== null && _a !== void 0 ? _a : '2s'}`;
                ELM.style.animationDelay = `${self.options.animationDelay}`;
                if (entry.isIntersecting) {
                    ELM.onanimationstart = function () {
                        ELM.style.visibility = 'visible';
                    };
                    ESJinit.initializeAnimation(ELM, self.options.animationIn, self.options.animationOut);
                    self.options.onScreen(ELM);
                }
                else {
                    // ELM.style.visibility = 'hidden';
                    // ESJinit.initializeAnimation(ELM, (self.options.animationOut as string),(self.options.animationIn as string));
                    self.options.outScreen(ELM);
                }
            });
        }, {
            root: self.options.scrollArea,
            threshold: self.options.threshold
        });
        document.querySelectorAll(`${this.options.targetElements}`).forEach((element) => {
            element.style.visibility = 'hidden';
            $$ObServer.observe(element);
        });
    }
}
