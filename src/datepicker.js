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

const pickerUtil = {
    initPicker: function (container) {
        if(!initFlag) {
            container.appendChild(this.createPickerHeader());
            initFlag = true;
        }
    },
    createPickerHeader: function() {
        return createElement(
            'div',
            {
                class: 'rd-picker-header'
            },
            [
                'header'
            ]
        );
    },
    setPickerPosition: function (ele, container) {
        let rect = getElementRect(ele);
        container.style.top = (rect.top + rect.height) + 'px';
        container.style.left = rect.left + 'px';
    },
    showPicker: function (container) {
        container.style.display = 'block';
    },
    hidePicker: function (container) {
        container.style.display = 'none';
    },
    destoryPicker: function(container) {
        container && container.remove();
    }
};

const containerId = "rd-picker-container";
const containerClass = "rd-picker-container";

let hasInstance = false;
let initFlag = false;
let container = null;
let instances = [];

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
        instances.push(this.ele);
        !hasInstance && (hasInstance = true);
    }
    init() {
        if(!hasInstance) {
            const pickerContainer = createElement(
                'div',
                {
                    id: containerId,
                    class: containerClass,
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
                pickerUtil.setPickerPosition(this.ele, container);
                pickerUtil.initPicker(container);
                pickerUtil.showPicker(container);
            }
        });
    }
    destory() {
        pickerUtil.destoryPicker(container);
    }
}

addListener(document, 'click', (event) => {
    if(instances.indexOf(event.target) == -1 && event.target !== container) {
        pickerUtil.hidePicker(container);
    }
});

export default RDPikcer;