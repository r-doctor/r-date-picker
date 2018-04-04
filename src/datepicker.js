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

function hasClass(ele, classStr) {
    let className = ele.className;
    if(!className) {
        return false;
    }
    let classArr = className.replace(/\s{1,}$/, '').replace(/\s{1,}/g, '|').split('|');
    return classArr.indexOf(classStr) > -1;
}

const containerId = "rd-picker-container";
const containerClass = "rd-picker-container";

let hasInstance = false;
let container = null;

const DEFAULTS = {
    type: 'date',
    target: 'web'
};

class RDPikcer {
    constructor(opts) {
        if(!opts.ele) {
            throw new Error('You must provide a DOM element!')
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
                    id: containerId,
                    class: containerClass,
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