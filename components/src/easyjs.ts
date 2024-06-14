import { ComponentGlobalOptions, Components } from './index.js';

export class EasyJS {
    public static components: object;
    public static _debug: string = 'console';
    /* 
      component method 
     handle esj component 
     name : component name
     options : component options
    */
    public static component(name: string, options: Partial<ComponentGlobalOptions> = {}): void {

        const Component = Components[name];
        if (Component) {
            new Component(options);
        } else {
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
    public static debug(mode: string = 'console'): void {
        this._debug = mode;
    }
}







export class ESJinit {
    public static initializeAnimation(elm: Element, NEWanimationname: string, OLDanimationname: string = ''): void {
        elm.classList.remove('animate__animated','animate__' + OLDanimationname);
        elm.classList.add('animate__animated', 'animate__' + NEWanimationname);
    }
    public static findEndOptions(defaultoptions: object | any, useroptions: object | any): object {
        let endoptions: any = {};
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
    public static errorHandler(message: string | null = null) {
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

    public static CheckRequiredOptions(requiredOptions: string[] = [], options: object, componentName: string): void {
        requiredOptions.forEach(option => {
            if (!(option in options)) {
                ESJinit.errorHandler(option + ' is required option in ' + componentName + ' constructor');
            }
        });
    }
    public static QueryAll(searchElmsClass: string, searchElm: HTMLElement) {
        if ((Array.from(document.querySelectorAll(`.${searchElmsClass}`)) as any).includes(searchElm))
            return true;
        else
            return false;
    }
}