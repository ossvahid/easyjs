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
        // ***************** get total dropdowns And set some options ***************** //
        document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(dropdown => {
            var _a;
            // ******* visibility option ******* //
            if (self.options.defaultHidden) {
                dropdown.style.visibility = 'hidden';
            }
            // ******* width option ******* //
            if (self.options.width === 'auto') {
                dropdown.style.width = 'auto';
            }
            else if (self.options.width === 'fit-parent') {
                dropdown.style.width = ((_a = dropdown.previousElementSibling) === null || _a === void 0 ? void 0 : _a.clientWidth) + 'px';
            }
            else {
                dropdown.style.width = self.options.width;
            }
            // ******* position option ******* //
            dropdown.style.position = 'absolute';
            dropdown.style.zIndex = '9999999999';
        });
        // ***************** register events ***************** //
        function Handle() {
            document.querySelectorAll(`.${self.options.wrapperClass}`).forEach(dropdown => {
                var _a;
                (_a = self.options.events) === null || _a === void 0 ? void 0 : _a.forEach(event => {
                    // **** show and hide dropdown when event fired on that **** //
                    self.ToggleDropDown(event, dropdown.previousElementSibling);
                });
                // **** change dropdown position **** //
                self.changePosition(dropdown);
            });
        }
        window.addEventListener("scroll", Handle);
        window.addEventListener("resize", Handle);
        Handle();
    }
    ComponentUi(handler, event) {
        const self = this;
        const dropdown = handler.nextElementSibling;
        dropdown.style.visibility = 'visible';
        self.changePosition(dropdown);
    }
    // ***************** _::changePosition for change dropdown position ***************** //
    changePosition(dropdown) {
        // Temporarily disable transition for immediate position change
        dropdown.style.transition = '0s';
        // Get handler element
        const handler = dropdown.previousElementSibling;
        // Get handler's position
        const handlerRect = handler.getBoundingClientRect();
        const handlerLeft = handlerRect.left + window.scrollX;
        const handlerBottom = handlerRect.bottom + window.scrollY;
        // Positioning based on 'auto' setting
        if (this.options.position === 'auto') {
            const dropdownRect = dropdown.getBoundingClientRect();
            const dropdownHeight = dropdownRect.height;
            const dropdownWidth = dropdownRect.width;
            // Check available space below and above the handler
            const availableSpaceBelow = window.innerHeight - handlerRect.bottom;
            const availableSpaceAbove = handlerRect.top;
            // Decide whether to place the dropdown above or below the handler
            let newTop;
            if (availableSpaceBelow < dropdownHeight && availableSpaceAbove >= dropdownHeight) {
                // Place above the handler
                newTop = handlerRect.top - dropdownHeight + window.scrollY;
            }
            else {
                // Place below the handler
                newTop = handlerBottom;
            }
            // Apply new position
            dropdown.style.top = `${newTop}px`;
            dropdown.style.left = `${handlerLeft}px`;
            // Ensure the dropdown is fully visible horizontally
            const dropdownRight = handlerLeft + dropdownWidth;
            if (dropdownRight > window.innerWidth) {
                dropdown.style.left = `${window.innerWidth - dropdownWidth}px`;
            }
            // Ensure the dropdown is fully visible from the left side
            if (handlerLeft < 0) {
                dropdown.style.left = '0px';
            }
        }
    }
    // ***************** _::ToggleDropDown for toggle dropdown ***************** //
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
