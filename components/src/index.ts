
// components
import { ESJmodal } from "./modal.js";
import { ESJscrollToShow } from './ScrollToShow.js';
import { ESJindicator } from './indicator.js';
import { ESJaccordion } from './accordion.js';
import { ESJsticky } from './sticky.js';
// easyjs main
import { ESJinit } from './easyjs.js';




export interface ComponentGlobalOptions {
    // props
    handlerClass: string,
    wrapperClass: string,
    animationIn: string,
    animationOut: string,
    animationSpeed: string
    // callback functions
    onOpen: CallableFunction | any,
    onClose: CallableFunction | any
};

export interface ComponentInterface {
    options: Partial<ComponentGlobalOptions>;
    ComponentRender(): void;
    ComponentUi(elm: Element , any : any): void;
}


export const Components: any | object = {
    modal: ESJmodal,
    scrollToShow: ESJscrollToShow,
    accordion:ESJaccordion,
    indicator : ESJindicator,
    sticky: ESJsticky
};

export { ESJinit };

