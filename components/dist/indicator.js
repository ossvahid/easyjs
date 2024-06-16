import { ESJinit } from './index.js';
export class ESJindicator {
    constructor(options = {}) {
        this.options = {
            mode: 'both', // done
            events: ['mousemove', 'click'], // done
            indicatorDefaultHidden: false, // done
            indicatorAnimationIn: '', // done
            indicatorAnimationOut: '', // done
            destroyAfterEventEnded: false, // done
            indicatorMove: (indicator, targetItem) => { }, // done
            indicatorStop: (indicator, targetItem) => { }, // done
            indicatorMovingSpeed: '1s', // done
            indicatorAnimationSpeed: '1s', // done
            indicatorPositionMode: 'absolute', // done
            indicatorRatio: 'center', // done
            indicatorYmargin: '0px', // done
            indicatorXmargin: '0px', // done
            cover: true, // done
            eventsMaxSensitivity: false // done
        };
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            'itemsClass',
            'indicatorClass',
        ], this.options, 'ESJindicator');
        this.ComponentRender();
    }
    ComponentRender() {
        var _a;
        const self = this;
        //  document.querySelector(`.${this.options.indicatorClass as string}`).style = 'position: fixed; visibility: hidden;';
        document.querySelectorAll(`.${self.options.indicatorClass}`).forEach((element) => {
            element.style = `position: ${self.options.indicatorPositionMode}; visibility: ${(self.options.indicatorDefaultHidden === true) ? 'hidden' : 'visible'};`;
        });
        (_a = this.options.events) === null || _a === void 0 ? void 0 : _a.forEach(eventname => {
            document.querySelectorAll(`.${self.options.wrapperClass}`).forEach((wrap) => {
                wrap.querySelectorAll(`.${self.options.itemsClass}`).forEach((item) => {
                    item.addEventListener(`${eventname}`, function (e) {
                        self.ComponentUi(item, e);
                    });
                });
            });
        });
    }
    ComponentUi(currentItem, event) {
        var _a;
        const self = this;
        let y = event.pageY;
        let x = event.pageX;
        const indicator = document.querySelector(`.${self.options.indicatorClass}`);
        indicator.style.visibility = 'visible';
        ESJinit.initializeAnimation(indicator, self.options.indicatorAnimationIn, self.options.indicatorAnimationOut);
        if (self.options.cover) {
            indicator.style.width = currentItem.scrollWidth + 'px';
            indicator.style.height = currentItem.scrollHeight + 'px';
        }
        const indicatorWidth = indicator === null || indicator === void 0 ? void 0 : indicator.clientWidth;
        const indicatorHeight = indicator === null || indicator === void 0 ? void 0 : indicator.clientHeight;
        const indicatorXmargin = (self.options.indicatorXmargin === 'auto') ? currentItem.clientWidth + 'px' : self.options.indicatorXmargin;
        const indicatorYmargin = (self.options.indicatorYmargin === 'auto') ? currentItem.clientHeight + 'px' : self.options.indicatorYmargin;
        (_a = self.options.events) === null || _a === void 0 ? void 0 : _a.forEach(eventname => {
            if (self.options.destroyAfterEventEnded) {
                window.addEventListener(`${eventname}`, function (ew) {
                    var _a;
                    if (ew.target === currentItem.closest(`.${self.options.wrapperClass}`)) {
                        indicator.style.visibility = 'visible';
                    }
                    if ((_a = currentItem.closest(`.${self.options.wrapperClass}`)) === null || _a === void 0 ? void 0 : _a.contains(ew.target)) {
                        indicator.style.visibility = 'visible';
                    }
                    else {
                        if (self.options.indicatorAnimationOut === '') {
                            indicator.style.visibility = 'hidden';
                        }
                        ESJinit.initializeAnimation(indicator, self.options.indicatorAnimationOut, self.options.indicatorAnimationIn);
                    }
                });
            }
            window.addEventListener(`${eventname}`, function (e) {
                if ((e.pageX + indicatorWidth) >= window.innerWidth && mode === 'x') {
                    indicator.style.left = `${window.innerWidth - indicatorWidth}px`;
                }
                if (indicator.getBoundingClientRect().left < 0 && mode === 'x') {
                    indicator.style.left = `0px`;
                }
            });
        });
        const mode = self.options.mode;
        if (self.options.indicatorRatio === 'center') {
            x = x - currentItem.scrollWidth / 2;
            y = y - currentItem.scrollHeight / 2;
        }
        else if (self.options.indicatorRatio === 'end') {
            x = x - currentItem.scrollWidth;
            y = y - currentItem.scrollHeight;
        }
        if (self.options.eventsMaxSensitivity === false) {
            x = currentItem.offsetLeft;
            y = currentItem.offsetTop;
        }
        if (mode === 'both' || mode === 'x') {
            indicator.style.left = `${x}px`;
        }
        if (mode === 'both' || mode === 'y') {
            indicator.style.top = `${y}px`;
        }
        indicator.style.margin = `${indicatorYmargin} ${indicatorXmargin}`;
        indicator.style.transition = `${this.options.indicatorMovingSpeed} `;
        indicator.style.animationDuration = `${this.options.indicatorAnimationSpeed} `;
        if (self.options.indicatorMove)
            self.options.indicatorMove(indicator, currentItem);
        indicator === null || indicator === void 0 ? void 0 : indicator.addEventListener('transitionend', function () {
            if (self.options.indicatorStop)
                self.options.indicatorStop(indicator, currentItem);
        });
    }
}
