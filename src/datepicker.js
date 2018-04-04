function getElementRect(ele) {
    return ele.getBoundingClientRect();
}

function createElement(tag, attrs, children) {
    let element = document.createElement(tag);
    for(let key in attrs) {
        if(key !== 'events') {
            element.setAttribute(key, attrs[key]);
        } else {
            for(let _key in attrs[key]) {
                element.addEventListener(_key, attrs[key][_key]);
            }
        }
    }
    if(children && children.length) {
        children.forEach((child) => {
            !child.nodeType && (child = document.createTextNode(child));
            element.appendChild(child);
        });
    }
    return element;
}

let hasInstance = false;
let container = null;

const DEFAULTS = {
    type: 'date',
    target: 'web'
};

class RDPikcer {
    constructor(opts) {
        if(!opts.ele) {
            throw new Error('You must provide a dom element!')
            return;
        }
        this.opts = Object.assign({}, DEFAULTS, opts);
        this.ele = this.opts.ele;
        this.init();
        !hasInstance && (hasInstance = true);
    }
    init() {
        if(!hasInstance) {
            const pickerContainer = createElement(
                'div',
                {
                    id: "rd-picker-container",
                    class: "rd-picker-container",
                    style: "height: 300px; background: red;",
                    events: {
                        click: () => {
                            alert('click ok!!');
                        }
                    }
                },
                [
                    'hello'
                ]
            );
            document.body.appendChild(pickerContainer);
            container = pickerContainer;
        }
        this.ele.addEventListener('focus', () => {
            console.log(this.opts);
            console.log(getElementRect(this.ele));
        });
    }
    destory() {
        console.log('destory');
        // container && container.remove();
    }
}

export default RDPikcer;