import { ESJinit } from './index.js';
export class ESJdropdown {
    constructor(options = {}) {
        this.options = {
            events: ['click'],
            position: 'auto',
            animationIn: 'fadeIn',
            animationOut: 'fadeOut',
            animationSpeed: '0.5s',
            defaultHidden: true,
            width: 'auto',
            destroyAfterEventEnded: true,
            onOpen: (dropdown, handler) => { },
            onClose: (dropdown, handler) => { },
        };
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            'handlerClass',
        ], this.options, 'ESJdropdown');
        this.ComponentRender();
    }
    ComponentRender() {
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
        });
        window.onscroll = Handle;
        function Handle() {
            var _a;
            (_a = self.options.events) === null || _a === void 0 ? void 0 : _a.forEach(event => {
                document.querySelectorAll(`.${self.options.handlerClass}`).forEach(handler => {
                    self.ToggleDropDown(event, handler);
                    self.changePosition(handler.nextElementSibling);
                });
            });
        }
        Handle();
    }
    ComponentUi(handler, event) {
        const self = this;
        const dropdown = handler.nextElementSibling;
        dropdown.style.visibility = 'visible';
        self.changePosition(dropdown);
    }
    changePosition(dropdown) {
        dropdown.style.transition = '0s';
        const handler = dropdown.previousElementSibling;
        const x = handler.getBoundingClientRect().left + window.scrollX;
        if (this.options.position === 'auto') {
            const dropdownRect = dropdown.getBoundingClientRect();
            const dropdownBottom = dropdownRect.bottom + window.scrollY - 150;
            const dropdownTop = dropdownRect.top + window.scrollY + 150;
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
    ToggleDropDown(event, handler) {
        const self = this;
        if (self.options.destroyAfterEventEnded) {
            window.addEventListener(`${event}`, function (ew) {
                const dropdown = handler.nextElementSibling;
                dropdown.style.animationDuration = `${self.options.animationSpeed}`;
                if ((ew.target === dropdown || ew.target === handler || dropdown.contains(ew.target)) && (!handler.hasAttribute('data-esj-dropdown'))) {
                    ESJinit.initializeAnimation(dropdown, `${self.options.animationIn}`, `${self.options.animationOut}`);
                    dropdown.onanimationend = function () {
                        dropdown.style.visibility = 'visible';
                        handler.setAttribute('data-esj-dropdown', 'true');
                        if (self.options.onOpen !== undefined) {
                            self.options.onOpen(dropdown, handler);
                        }
                    };
                    self.ComponentUi(handler, event);
                }
                else {
                    if (dropdown.contains(ew.target))
                        return;
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
