(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.datepicker = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function addListener(ele, type, fn) {
        ele.addEventListener(type, fn);
    }

    function createElement(tag, attrs, children) {
        var element = document.createElement(tag);
        for (var key in attrs) {
            if (key !== 'events') {
                element.setAttribute(key, attrs[key]);
            } else {
                for (var _key in attrs[key]) {
                    addListener(element, _key, attrs[key][_key]);
                }
            }
        }
        if (children && children.length) {
            children.forEach(function (child) {
                !child.nodeType && (child = document.createTextNode(child));
                element.appendChild(child);
            });
        }
        return element;
    }

    function makeClassArr(className) {
        if (!className) {
            return [];
        }
        return className.replace(/\s{1,}$/, '').replace(/\s{1,}/g, '|').split('|');
    }

    function hasClass(ele, classStr) {
        var className = ele.className;
        if (!className) {
            return false;
        }
        return makeClassArr(className).indexOf(classStr) > -1;
    }

    function addClass(ele, classStr) {
        var originClass = ele.className ? ele.className.replace(/\s{1,}$/, '') : '';
        ele.className = originClass + ' ' + classStr;
    }

    function removeClass(ele, classStr) {}

    function getElementAttribute(ele, attr) {
        return ele.getAttribute(attr);
    }

    function getElementRect(ele) {
        return ele.getBoundingClientRect();
    }

    var pickerUtil = {
        initPicker: function initPicker(container) {
            if (!initFlag) {
                container.appendChild(this.createPickerHeader());
                initFlag = true;
            }
        },
        createPickerHeader: function createPickerHeader() {
            return createElement('div', {
                class: 'rd-picker-header'
            }, ['header']);
        },
        setPickerPosition: function setPickerPosition(ele, container) {
            var rect = getElementRect(ele);
            container.style.top = rect.top + rect.height + 'px';
            container.style.left = rect.left + 'px';
        },
        showPicker: function showPicker(container) {
            container.style.display = 'block';
        },
        hidePicker: function hidePicker(container) {
            container.style.display = 'none';
        },
        destoryPicker: function destoryPicker(container) {
            container && container.remove();
        }
    };

    var containerId = "rd-picker-container";
    var containerClass = "rd-picker-container";

    var hasInstance = false;
    var initFlag = false;
    var container = null;
    var instances = [];

    var DEFAULTS = {
        type: 'date',
        target: 'web'
    };

    var RDPikcer = function () {
        function RDPikcer(opts) {
            _classCallCheck(this, RDPikcer);

            if (!opts.ele) {
                throw new Error('You must provide a DOM element!');
                return;
            }
            this.opts = Object.assign({}, DEFAULTS, opts);
            this.ele = this.opts.ele;
            this.init();
            instances.push(this.ele);
            !hasInstance && (hasInstance = true);
        }

        _createClass(RDPikcer, [{
            key: 'init',
            value: function init() {
                var _this = this;

                if (!hasInstance) {
                    var pickerContainer = createElement('div', {
                        id: containerId,
                        class: containerClass,
                        events: {
                            click: function click() {
                                alert('click ok!!');
                            }
                        }
                    });
                    document.body.appendChild(pickerContainer);
                    container = pickerContainer;
                }

                addListener(this.ele, 'focus', function () {
                    if (_this.opts.target === 'web') {
                        pickerUtil.setPickerPosition(_this.ele, container);
                        pickerUtil.initPicker(container);
                        pickerUtil.showPicker(container);
                    }
                });
            }
        }, {
            key: 'destory',
            value: function destory() {
                pickerUtil.destoryPicker(container);
            }
        }]);

        return RDPikcer;
    }();

    addListener(document, 'click', function (event) {
        if (instances.indexOf(event.target) == -1 && event.target !== container) {
            pickerUtil.hidePicker(container);
        }
    });

    exports.default = RDPikcer;
});