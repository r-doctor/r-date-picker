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

    function getElementRect(ele) {
        return ele.getBoundingClientRect();
    }

    function createElement(tag, attrs, children) {
        var element = document.createElement(tag);
        for (var key in attrs) {
            if (key !== 'events') {
                element.setAttribute(key, attrs[key]);
            } else {
                for (var _key in attrs[key]) {
                    element.addEventListener(_key, attrs[key][_key]);
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

    var hasInstance = false;
    var container = null;

    var DEFAULTS = {
        type: 'date',
        target: 'web'
    };

    var RDPikcer = function () {
        function RDPikcer(opts) {
            _classCallCheck(this, RDPikcer);

            if (!opts.ele) {
                throw new Error('You must provide a dom element!');
                return;
            }
            this.opts = Object.assign({}, DEFAULTS, opts);
            this.ele = this.opts.ele;
            this.init();
            !hasInstance && (hasInstance = true);
        }

        _createClass(RDPikcer, [{
            key: 'init',
            value: function init() {
                var _this = this;

                if (!hasInstance) {
                    var pickerContainer = createElement('div', {
                        id: "rd-picker-container",
                        class: "rd-picker-container",
                        style: "height: 300px; background: red;",
                        events: {
                            click: function click() {
                                alert('click ok!!');
                            }
                        }
                    }, ['hello']);
                    document.body.appendChild(pickerContainer);
                    container = pickerContainer;
                }
                this.ele.addEventListener('focus', function () {
                    console.log(_this.opts);
                    console.log(getElementRect(_this.ele));
                });
            }
        }, {
            key: 'destory',
            value: function destory() {
                console.log('destory');
                // container && container.remove();
            }
        }]);

        return RDPikcer;
    }();

    exports.default = RDPikcer;
});
