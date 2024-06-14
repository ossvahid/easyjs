import { Components } from './index.js';
export class EasyJS {
    /*
      component method
     handle esj component
     name : component name
     options : component options
    */
    static component(name, options = {}) {
        const Component = Components[name];
        if (Component) {
            new Component(options);
        }
        else {
            ESJinit.errorHandler(`Component ${name} does not exist.`);
        }
        this.components = Components;
        // return Component;
    }
    /*
     debug method
     handle esj debug
     mode : off | console | alert : default : console
    */
    static debug(mode = 'console') {
        this._debug = mode;
    }
}
EasyJS._debug = 'console';
export class ESJinit {
    static initializeAnimation(elm, NEWanimationname, OLDanimationname = '') {
        elm.classList.remove('animate__animated', 'animate__' + OLDanimationname);
        elm.classList.add('animate__animated', 'animate__' + NEWanimationname);
    }
    static findEndOptions(defaultoptions, useroptions) {
        let endoptions = {};
        for (let defitem in defaultoptions) {
            for (let usitem in useroptions) {
                if (!(usitem in defaultoptions)) {
                    endoptions[usitem] = useroptions[usitem];
                }
                if (usitem in defaultoptions) {
                    endoptions[usitem] = useroptions[usitem];
                }
                if (!(defitem in useroptions)) {
                    endoptions[defitem] = defaultoptions[defitem];
                }
            }
        }
        return endoptions;
    }
    static errorHandler(message = null) {
        switch (EasyJS._debug) {
            case 'console':
                window.console.error('ESJ Error : ' + message);
                break;
            case 'alert':
                window.alert('ESJ Error : ' + message);
                break;
            case 'off':
                return;
        }
    }
    static CheckRequiredOptions(requiredOptions = [], options, componentName) {
        requiredOptions.forEach(option => {
            if (!(option in options)) {
                ESJinit.errorHandler(option + ' is required option in ' + componentName + ' constructor');
            }
        });
    }
    static QueryAll(searchElmsClass, searchElm) {
        if (Array.from(document.querySelectorAll(`.${searchElmsClass}`)).includes(searchElm))
            return true;
        else
            return false;
    }
}
