function addListener(ele, type, fn) {
    ele.addEventListener(type, fn);
}

function createElement(tag, attrs, children) {
    let element = document.createElement(tag);
    for(let key in attrs) {
        if(key !== 'events') {
            element.setAttribute(key, attrs[key]);
        } else {
            for(let _key in attrs[key]) {
                addListener(element, _key, attrs[key][_key]);
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

function makeClassArr(className) {
    if(!className) {
        return [];
    }
    return className.replace(/\s{1,}$/, '').replace(/\s{1,}/g, '|').split('|');
}

function hasClass(ele, classStr) {
    let className = ele.className;
    if(!className) {
        return false;
    }
    return makeClassArr(className).indexOf(classStr) > -1;
}

function addClass(ele, classStr) {
    let originClass = ele.className ? ele.className.replace(/\s{1,}$/, '') : '';
    ele.className = originClass + ' ' + classStr;
}

function removeClass(ele, classStr) {

}

function getElementAttribute(ele, attr) {
    return ele.getAttribute(attr);
}

function getElementRect(ele) {
    return ele.getBoundingClientRect();
}

function setPickerPosition(ele) {
    let rect = getElementRect(ele);
    ele.style.top = rect.top + 'px';
    ele.style.left = rect.left + 'px';
}

function showPicker(container) {
    container.style.display = 'block';
}

function hidePicker(container) {
    container.style.display = 'none';
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
                    style: "position: fixed; width: 400px; height: 300px; background: red; display: none;",
                    events: {
                        click: () => {
                            alert('click ok!!');
                        }
                    }
                }
            );
            document.body.appendChild(pickerContainer);
            container = pickerContainer;
        }

        addListener(this.ele, 'focus', () => {
            if(this.opts.target === 'web') {
                setPickerPosition(this.ele);
                showPicker(container);
            }
        });

        addListener(document, 'click', (event) => {
            if(event.target !== this.ele && event.target !== container) {
                hidePicker(container);
            }
        });
    }
    destory() {
        console.log('destory');
        // container && container.remove();
    }
}

export default RDPikcer;