import { ESJinit } from './index.js';
export class ESJdropdown {
    constructor(options = {}) {
        this.options = {
            events: ['click'],
            position: 'auto',
            animationIn: 'fadeIn',
            animationOut: 'fadeOut',
            defaultHidden: true,
            width: 'auto',
            destroyAfterEventEnded: true,
            onOpen: (dropdown, handler) => { }
        };
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            'handlerClass',
        ], this.options, 'ESJdropdown');
        this.ComponentRender();
    }
    ComponentRender() {
        var _a;
        const self = this;
        document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(dropdown => {
            var _a;
            if (self.options.defaultHidden) {
                dropdown.style.visibility = 'hidden';
            }
            if (self.options.width === 'auto') {
                dropdown.style.width = 'auto';
            }
            else if (self.options.width === 'fit-parent') {
                dropdown.style.width = ((_a = dropdown.previousElementSibling) === null || _a === void 0 ? void 0 : _a.clientWidth) + 'px';
            }
            else {
                dropdown.style.width = self.options.width;
            }
            dropdown.style.position = 'absolute';
            dropdown.style.zIndex = '9999999999';
            window.onload = function () {
                self.changePosition(dropdown, dropdown.previousElementSibling);
            };
            window.onscroll = function () {
                self.changePosition(dropdown, dropdown.previousElementSibling);
            };
        });
        (_a = self.options.events) === null || _a === void 0 ? void 0 : _a.forEach(event => {
            document.querySelectorAll(`.${self.options.handlerClass}`).forEach(handler => {
                handler.addEventListener(`${event}`, function (e) {
                    self.ComponentUi(e.target, e);
                });
                if (self.options.destroyAfterEventEnded) {
                    window.addEventListener(`${event}`, function (ew) {
                        const dropdown = handler.nextElementSibling;
                        if (ew.target === dropdown || ew.target === handler || dropdown.contains(ew.target)) {
                            // ESJinit.initializeAnimation(dropdown, `${self.options.animationIn}`);
                            dropdown.style.visibility = 'visible';
                        }
                        else {
                            // ESJinit.initializeAnimation(dropdown, `${self.options.animationOut}`);
                            dropdown.style.visibility = 'hidden';
                        }
                    });
                }
            });
        });
    }
    ComponentUi(handler, event) {
        const self = this;
        const dropdown = handler.nextElementSibling;
        if (self.options.onOpen !== undefined) {
            self.options.onOpen(dropdown, handler);
        }
        dropdown.style.visibility = 'visible';
        ESJinit.initializeAnimation(dropdown, `${self.options.animationIn}`);
        self.changePosition(dropdown, handler);
    }
    changePosition(dropdown, handler) {
        dropdown.style.transition = '0.2s';
        const x = handler.getBoundingClientRect().left + window.scrollX;
        if (this.options.position === 'auto') {
            const dropdownRect = dropdown.getBoundingClientRect();
            const dropdownBottom = dropdownRect.bottom + window.scrollY;
            const dropdownTop = dropdownRect.top + window.scrollY;
            if (dropdownBottom > window.innerHeight + window.scrollY) {
                const newY = handler.getBoundingClientRect().top - dropdown.clientHeight + window.scrollY;
                dropdown.style.top = `${newY}px`;
            }
            else if (dropdownTop < window.scrollY) {
                const newY = handler.getBoundingClientRect().bottom + window.scrollY;
                dropdown.style.top = `${newY}px`;
            }
            dropdown.style.left = `${x}px`;
        }
    }
}
