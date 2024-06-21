import { ESJinit } from './index.js';
export class ESJmodal {
    constructor(options = {}) {
        this.options = {
            animationIn: 'bounceIn',
            animationOut: 'bounceOut',
            animationSpeed: '1s',
            closeByClickModal: true,
            onOpen: () => { },
            onClose: () => { },
            onAccept: () => { },
            position: 'center',
            closeAfterAccepted: true
        };
        this.options = ESJinit.findEndOptions(this.options, options);
        ESJinit.CheckRequiredOptions([
            'wrapperClass',
            // 'handlerClass'
        ], this.options, 'ESJmodal');
        this.ComponentRender();
    }
    ComponentRender() {
        const self = this;
        if (!self.options.handlerClass) {
            self.ComponentUi();
            return;
        }
        // ***************** get total modal handlers ***************** //
        document.querySelectorAll(`.${this.options.handlerClass}`).forEach(element => {
            // ******* trigger modal when client clicked on handler ******* //
            element.onclick = function () {
                self.ComponentUi();
            };
        });
    }
    ComponentUi() {
        const self = this;
        const modal = document.createElement('section');
        const modalId = `modal-${Date.now()}`;
        modal.id = modalId;
        let position = '';
        if (self.options.position === 'center' || self.options.position === '') {
            position = 'align-items: center; justify-content: center;';
        }
        else if (self.options.position === 'top-center') {
            position = 'align-items: flex-start; justify-content: center;';
        }
        else if (self.options.position === 'top-left') {
            position = 'align-items: flex-start; justify-content: flex-start;';
        }
        else if (self.options.position === 'top-right') {
            position = 'align-items: flex-start; justify-content: flex-end;';
        }
        else if (self.options.position === 'bottom-center') {
            position = 'align-items: flex-end; justify-content: center;';
        }
        else if (self.options.position === 'bottom-left') {
            position = 'align-items: flex-end; justify-content: flex-start;';
        }
        else if (self.options.position === 'bottom-right') {
            position = 'align-items: flex-end; justify-content: flex-end;';
        }
        modal.style = `position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7); display: flex; z-index: ${9999 + document.querySelectorAll('section').length}; padding: 20px; ${position}`;
        let popup = document.querySelector(`.${self.options.wrapperClass}`);
        popup = popup.cloneNode(true);
        popup.style = `display: block; animation-duration: ${self.options.animationSpeed};`;
        ESJinit.initializeAnimation(popup, `${self.options.animationIn}`, `${self.options.animationOut}`);
        document.body.prepend(modal);
        modal.prepend(popup);
        self.options.onOpen();
        window.addEventListener('click', function (e) {
            if ((e.target === modal && self.options.closeByClickModal) || ESJinit.QueryAll(self.options.closeButtonClass, e.target)) {
                ESJinit.initializeAnimation(popup, `${self.options.animationOut}`, `${self.options.animationIn}`);
                popup.onanimationend = () => {
                    document.body.removeChild(modal);
                    self.options.onClose();
                };
            }
        }, true);
        if (self.options.acceptButtonClass) {
            popup.querySelector(`.${self.options.acceptButtonClass}`).onclick = function () {
                if (self.options.closeAfterAccepted) {
                    ESJinit.initializeAnimation(popup, `${self.options.animationIn}`, `${self.options.animationOut}`);
                    popup.onanimationend = () => {
                        document.body.removeChild(modal);
                    };
                }
                if (self.options.onAccept === undefined) {
                    return;
                }
                self.options.onAccept();
            };
        }
    }
}
