(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.rdatepicker = mod.exports;
    }
})(this, function (exports) {
    "use strict";

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

    var containerId = "rd-picker-container";
    var containerClass = "rd-picker-container";

    var w = 300;
    var h = 260;
    var hasInstance = false;
    var initFlag = false;
    var container = null;
    var instances = [];
    var currentTarget = null;
    var currentOptions = null;
    var mStart = 0;
    var mEnd = 0;
    var dateData = {
        year: '',
        month: '',
        date: '',
        hour: '',
        minute: '',
        second: ''
    };
    var monthMap = {
        '01': '一月',
        '02': '二月',
        '03': '三月',
        '04': '四月',
        '05': '五月',
        '06': '六月',
        '07': '七月',
        '08': '八月',
        '09': '九月',
        '10': '十月',
        '11': '十一月',
        '12': '十二月'
    };
    var daysArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var currentYear = 0;
    var initValue = '';
    var initMonth = '';
    var initYear = '';

    var DEFAULTS = {
        type: 'date',
        target: 'web'
    };

    function perMonthDays(year) {
        if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
            return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        } else {
            return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        }
    }

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

    function removeClass(ele, classStr) {
        var className = ele.className;
        if (!className) {
            return false;
        }
        var classArr = makeClassArr(className);
        if (classArr.indexOf(classStr) > -1) {
            classArr.splice(classArr.indexOf(classStr), 1);
        }
        ele.className = classArr.join(' ');
    }

    function getElementAttribute(ele, attr) {
        return ele.getAttribute(attr);
    }

    function getElementRect(ele) {
        return ele.getBoundingClientRect();
    }

    function isEleInContainer(container, ele) {
        return container.compareDocumentPosition(ele) === 10;
    }

    function createDays(year, month) {
        var days = [];
        var d = new Date();
        var m = d.getMonth();
        year = year || d.getFullYear();
        month = month || formatMonth(m);
        var mIndex = Number(month) - 1;
        var firstDay = new Date(year + '-' + month + '-01').getDay();
        var start = firstDay;
        var end = firstDay + perMonthDays(Number(year))[mIndex] - 1;
        var tempDate = 0;
        var nextDate = 0;
        var preDate = 0;
        if (mIndex == 0) {
            preDate = 31 - start;
        } else {
            preDate = perMonthDays(Number(year))[mIndex - 1] - start;
        }
        for (var i = 0; i < 42; i++) {
            if (i >= start && i <= end) {
                days.push(tempDate + 1);
                tempDate++;
            } else if (i > end) {
                days.push(++nextDate);
            } else {
                days.push(++preDate);
            }
        }
        mStart = start;
        mEnd = end;
        return days;
    }

    function createYears(year) {
        var arr = [];
        var y = Number(year);
        var start = y - 8;
        var end = y + 7;
        for (var i = start; i < end; i++) {
            arr.push(i);
        }
        return arr;
    }

    function getYearRange(year) {
        var y = year || Number(dateData.year);
        return {
            preFirstYear: y - 23,
            preLastYear: y - 9,
            nextFirstYear: y + 7,
            nextLastYear: y + 21
        };
    };

    function formatDate(date) {
        var d = date.split(' ');
        var ymd = d[0];
        var hms = d[1];
        var ymdArr = ymd.split('-');
        var hmsArr = ['00', '00', '00'];
        if (hms) {
            hmsArr = hms.split(':');
        }
        return {
            year: ymdArr[0],
            month: ymdArr[1],
            date: ymdArr[2],
            hour: hmsArr[0],
            minute: hmsArr[1],
            second: hmsArr[2]
        };
    }

    function formatMonth(m) {
        return m > 9 ? '' + m : '0' + m;
    }

    function zeroPad(s) {
        return s.length < 2 ? '0' + s : s;
    }

    function getNow() {
        var now = new Date();
        var _year = now.getFullYear();
        var _month = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : '' + (now.getMonth() + 1);
        var _date = now.getDate();
        var _hour = now.getHours();
        var _minute = now.getMinutes();
        var _second = now.getSeconds();

        return {
            year: _year,
            month: _month,
            date: _date,
            hour: _hour,
            minute: _minute,
            second: _second,
            ymd: _year + '-' + _month + '-' + _date
        };
    }

    function showOrHideEle(ele) {
        if (window.getComputedStyle(ele, null).getPropertyValue('display') === 'none') {
            ele.style.display = 'block';
        } else {
            ele.style.display = 'none';
        }
    }

    function showEle(ele) {
        ele.style.display = 'block';
    }
    function hideEle(ele) {
        ele.style.display = 'none';
    }

    var pickerUtil = {
        initPicker: function initPicker(container) {
            if (!initFlag) {
                var pickerFragment = document.createDocumentFragment();
                pickerFragment.appendChild(this.createPickerHeader());
                pickerFragment.appendChild(this.createPickerBody());
                // pickerFragment.appendChild(this.createPickerFooter());
                pickerFragment.appendChild(this.createYearBox());
                pickerFragment.appendChild(this.createMonthBox());
                container.appendChild(pickerFragment);
                initFlag = true;
            }
        },
        createPickerHeader: function createPickerHeader() {
            var _this = this;

            var preYear = createElement('i', {
                class: 'rd-picker-icon',
                events: {
                    click: function click(e) {
                        if (container.querySelector('#rd-picker-year-box').style.display === 'block') {
                            return;
                        }
                        dateData.year = dateData.year - 1;
                        _this.refreshPicker();
                    }
                }
            });

            var yearText = createElement('div', {
                class: 'ym-text',
                id: 'yearText',
                events: {
                    click: function click() {
                        currentYear = Number(dateData.year);
                        initYear = currentYear;
                        showOrHideEle(container.querySelector('#rd-picker-year-box'));
                        if (currentOptions.type !== 'month') {
                            hideEle(container.querySelector('#rd-picker-month-box'));
                        }
                        container.querySelector('#rd-picker-year-box').replaceChild(_this.createYearList(), container.querySelector('#rd-picker-year-list'));
                        container.querySelector('#rd-picker-year-box').replaceChild(_this.createYearNav(), container.querySelector('#rd-picker-year-nav'));
                    }
                }
            }, ['2018']);

            var nextYear = createElement('span', {
                class: 'rd-picker-icon icon-next',
                events: {
                    click: function click(e) {
                        if (container.querySelector('#rd-picker-year-box').style.display === 'block') {
                            return;
                        }
                        dateData.year = Number(dateData.year) + 1;
                        _this.refreshPicker();
                    }
                }
            });
            var preMonth = createElement('i', {
                class: 'rd-picker-icon icon-pre',
                events: {
                    click: function click(e) {
                        if (container.querySelector('#rd-picker-month-box').style.display === 'block') {
                            return;
                        }
                        if (Number(dateData.month) == 1) {
                            dateData.year = dateData.year - 1;
                            dateData.month = '12';
                        } else {
                            dateData.month = formatMonth(Number(dateData.month) - 1);
                        }
                        _this.refreshPicker();
                    }
                }
            });

            var monthText = createElement('div', {
                class: 'ym-text',
                id: 'monthText',
                events: {
                    click: function click() {
                        initMonth = dateData.month;
                        container.replaceChild(_this.createMonthBox(), container.querySelector('#rd-picker-month-box'));
                        showOrHideEle(container.querySelector('#rd-picker-month-box'));
                        hideEle(container.querySelector('#rd-picker-year-box'));
                    }
                }
            }, ['四月']);

            var nextMonth = createElement('i', {
                class: 'rd-picker-icon icon-next',
                events: {
                    click: function click(e) {
                        if (container.querySelector('#rd-picker-month-box').style.display === 'block') {
                            return;
                        }
                        if (Number(dateData.month) == 12) {
                            dateData.year = Number(dateData.year) + 1;
                            dateData.month = '01';
                        } else {
                            dateData.month = formatMonth(Number(dateData.month) + 1);
                        }
                        _this.refreshPicker();
                    }
                }
            });

            return createElement('div', {
                class: 'rd-picker-header'
            }, [createElement('div', { class: 'rd-picker-change', id: 'rd-picker-changer-year' }, [preYear, yearText, nextYear]), createElement('div', { class: 'rd-picker-change', id: 'rd-picker-changer-month' }, [preMonth, monthText, nextMonth])]);
        },
        createPickerMask: function createPickerMask() {
            return createElement('div', {
                class: 'rd-picker-mask',
                id: 'rd-picker-mask',
                events: {
                    click: function click(e) {
                        hideEle(e.target);
                    }
                }
            });
        },
        createPickerBody: function createPickerBody() {
            var _this2 = this;

            var daysTextFragment = document.createDocumentFragment();
            var daysFragment = document.createDocumentFragment();
            var days = createDays(dateData.year, dateData.month);
            daysArr.forEach(function (day) {
                daysTextFragment.appendChild(createElement('span', { class: 'rd-picker-day' }, [day]));
            });
            days.forEach(function (day, index) {
                var classStr = 'day-text';
                if (dateData.date && dateData.date == day && initValue === dateData.year + '-' + dateData.month + '-' + dateData.date) {
                    classStr = classStr + ' selected';
                }
                if (index < mStart || index > mEnd) {
                    classStr = classStr + ' disabled';
                }
                daysFragment.appendChild(createElement('li', { class: 'rd-picker-day-item' }, [createElement('span', {
                    class: classStr,
                    events: {
                        click: function click(e) {
                            dateData.date = zeroPad(e.target.innerText);
                            if (hasClass(e.target, 'disabled')) {
                                return;
                            }
                            if (container.querySelector('.selected')) {
                                removeClass(container.querySelector('.selected'), 'selected');
                            }
                            addClass(e.target, 'selected');
                            var returnStr = '';
                            if (currentOptions.type === 'date') {
                                returnStr = dateData.year + '-' + dateData.month + '-' + dateData.date;
                            } else if (currentOptions.type === 'month') {
                                returnStr = dateData.year + '-' + dateData.month;
                            }
                            if (currentOptions.selectCallback) {
                                currentOptions.selectCallback(returnStr);
                            } else {
                                currentTarget.value = returnStr;
                            }
                            hideEle(container.querySelector('#rd-picker-year-box'));
                            hideEle(container.querySelector('#rd-picker-month-box'));
                            setTimeout(function () {
                                _this2.hidePicker(container);
                                if (currentOptions.target === 'mobile') {
                                    hideEle(document.querySelector('#rd-picker-mask'));
                                }
                            }, 200);
                        }
                    }
                }, [day])]));
            });
            return createElement('div', {
                class: 'rd-picker-body',
                id: 'rd-picker-body'
            }, [createElement('div', { class: 'rd-picker-day-box' }, [daysTextFragment]), createElement('ul', { class: 'rd-picker-day-list' }, [daysFragment])]);
        },
        createPickerFooter: function createPickerFooter(ele) {
            var _this3 = this;

            return createElement('div', {
                class: 'rd-picker-footer',
                id: 'rd-picker-footer'
            }, [createElement('button', {
                class: 'picker-btn cancel-btn',
                events: {
                    click: function click() {
                        _this3.hidePicker(container);
                        hideEle(container.querySelector('#rd-picker-year-box'));
                        hideEle(container.querySelector('#rd-picker-month-box'));
                    }
                }
            }, ['取消']), createElement('button', {
                class: 'picker-btn confirm-btn',
                events: {
                    click: function click() {
                        var returnStr = '';
                        if (currentOptions.type === 'date') {
                            returnStr = dateData.year + '-' + dateData.month + '-' + dateData.date;
                        } else if (currentOptions.type === 'month') {
                            returnStr = dateData.year + '-' + dateData.month;
                        }
                        if (currentOptions.selectCallback) {
                            currentOptions.selectCallback(returnStr);
                        } else {
                            currentTarget.value = returnStr;
                        }
                        _this3.hidePicker(container);
                        hideEle(container.querySelector('#rd-picker-year-box'));
                        hideEle(container.querySelector('#rd-picker-month-box'));
                    }
                }
            }, ['确定'])]);
        },
        createYearBox: function createYearBox() {
            return createElement('div', {
                class: "rd-picker-ym-box year",
                id: "rd-picker-year-box"
            }, [this.createYearList(), this.createYearNav()]);
        },
        createYearList: function createYearList(year) {
            var _this4 = this;

            var yearsArr = year ? createYears(year) : dateData.year ? createYears(dateData.year) : [];
            var yFragment = '';
            if (yearsArr.length) {
                yFragment = document.createDocumentFragment();
                yearsArr.forEach(function (year) {
                    var classStr = 'ym-text';
                    if (initYear == year) {
                        classStr = classStr + ' selected';
                    }
                    yFragment.appendChild(createElement('li', {
                        class: "rd-picker-ym-item"
                    }, [createElement('span', {
                        class: classStr,
                        "data-year": year,
                        events: {
                            click: function click(e) {
                                var y = getElementAttribute(e.target, 'data-year');
                                dateData.year = y;
                                _this4.refreshPicker();
                                hideEle(container.querySelector('#rd-picker-year-box'));
                            }
                        }
                    }, [year])]));
                });
            }
            return createElement('ul', {
                class: "rd-picker-ym-list",
                id: 'rd-picker-year-list'
            }, [yFragment]);
        },
        createYearNav: function createYearNav(year) {
            var _this5 = this;

            var y = year || Number(dateData.year);
            return createElement('div', {
                class: 'rd-picker-year-nav',
                id: 'rd-picker-year-nav'
            }, [createElement('button', {
                class: 'year-nav-button pre-years',
                events: {
                    click: function click() {
                        currentYear = currentYear - 15;
                        container.querySelector('#rd-picker-year-box').replaceChild(_this5.createYearList(currentYear), container.querySelector('#rd-picker-year-list'));
                    }
                }
            }, ['上一页']), createElement('button', {
                class: 'year-nav-button next-years',
                style: 'float: right;',
                events: {
                    click: function click() {
                        currentYear = currentYear + 15;
                        container.querySelector('#rd-picker-year-box').replaceChild(_this5.createYearList(currentYear), container.querySelector('#rd-picker-year-list'));
                    }
                }
            }, ['下一页'])]);
        },
        createMonthBox: function createMonthBox() {
            var _this6 = this;

            var mFragement = document.createDocumentFragment();
            ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(function (item) {
                var classStr = "ym-text";
                if (initMonth == item) {
                    classStr = classStr + " selected";
                }
                mFragement.appendChild(createElement('li', { class: "rd-picker-ym-item" }, [createElement('span', {
                    class: classStr,
                    "data-month": item,
                    events: {
                        click: function click(e) {
                            var m = getElementAttribute(e.target, 'data-month');
                            dateData.month = m;
                            if (currentOptions.type === 'month') {
                                if (currentOptions.selectCallback) {
                                    currentOptions.selectCallback(dateData.year + '-' + dateData.month);
                                } else {
                                    currentTarget.value = dateData.year + '-' + dateData.month;
                                }
                                _this6.hidePicker(container);
                            } else {
                                _this6.refreshPicker();
                            }
                            hideEle(container.querySelector('#rd-picker-month-box'));
                            if (currentOptions.target === 'mobile') {
                                hideEle(document.querySelector('#rd-picker-mask'));
                            }
                        }
                    }
                }, [monthMap[item]])]));
            });
            return createElement('div', {
                class: "rd-picker-ym-box",
                id: "rd-picker-month-box"
            }, [createElement('ul', { class: "rd-picker-ym-list" }, [mFragement])]);
        },
        refreshPicker: function refreshPicker(value, init) {
            if (value) {
                var initObj = formatDate(value);
                dateData = Object.assign({}, dateData, initObj);
            } else if (init) {
                var _initObj = getNow();
                dateData = Object.assign({}, dateData, _initObj);
            }
            if (currentOptions.type === 'month') {
                document.querySelector('#yearText').innerText = dateData.year;
            } else {
                document.querySelector('#yearText').innerText = dateData.year;
                document.querySelector('#monthText').innerText = monthMap[dateData.month];
                container.replaceChild(this.createPickerBody(), container.querySelector('#rd-picker-body'));
            }
        },
        setPickerPosition: function setPickerPosition(ele, container) {
            if (currentOptions.target === 'web') {
                var rect = getElementRect(ele);
                var w1 = window.innerWidth - rect.left;
                var h1 = window.innerHeight - (rect.top + rect.height);
                if (w1 < w) {
                    container.style.left = 'initail';
                    container.style.right = window.innerWidth - rect.right + 'px';
                } else {
                    container.style.right = 'initail';
                    container.style.left = rect.left + 'px';
                }
                if (h1 < h) {
                    container.style.top = rect.top - h + 'px';
                } else {
                    container.style.top = rect.top + rect.height + 'px';
                }
            } else {
                container.style.left = '0';
                container.style.bottom = '0';
                container.style.width = '100%';
            }
        },
        showPicker: function showPicker(container) {
            container.style.display = 'block';
        },
        hidePicker: function hidePicker(container) {
            container.style.display = 'none';
        },
        destoryPicker: function destoryPicker(container) {
            container && container.remove();
        },
        resetPicker: function resetPicker() {
            container.style.height = '260px';
            if (currentOptions.target === 'mobile') {
                // hideEle(container.querySelector('#rd-picker-footer'));
                showEle(document.querySelector('#rd-picker-mask'));
            }
            if (currentOptions.type === 'month') {
                container.querySelector('#rd-picker-changer-year').style.width = '100%';
                hideEle(container.querySelector('#rd-picker-changer-month'));
                hideEle(container.querySelector('#rd-picker-body'));
                // hideEle((container.querySelector('#rd-picker-footer')));
                showEle(container.querySelector('#rd-picker-month-box'));
            } else {
                container.querySelector('#rd-picker-changer-year').style.width = '50%';
                showEle(container.querySelector('#rd-picker-changer-month'));
                showEle(container.querySelector('#rd-picker-body'));
                // showEle((container.querySelector('#rd-picker-footer')));
                hideEle(container.querySelector('#rd-picker-month-box'));
            }
        }
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
            key: "init",
            value: function init() {
                var _this7 = this;

                if (!hasInstance) {
                    var pickerContainer = createElement('div', {
                        id: containerId,
                        class: containerClass
                    });
                    document.body.appendChild(pickerUtil.createPickerMask());
                    document.body.appendChild(pickerContainer);
                    pickerUtil.initPicker(pickerContainer);
                    container = pickerContainer;
                }

                addListener(this.ele, 'click', function () {
                    console.log('click');
                    currentTarget = _this7.ele;
                    currentOptions = _this7.opts;
                    initValue = currentTarget.value || getNow().ymd;
                    initYear = currentTarget.value ? currentTarget.value.split('-')[0] : getNow().year;
                    initMonth = currentTarget.value ? currentTarget.value.split('-')[1] : getNow().month;
                    if (currentOptions.type === 'month') {
                        container.replaceChild(pickerUtil.createMonthBox(), container.querySelector('#rd-picker-month-box'));
                    }

                    pickerUtil.setPickerPosition(_this7.ele, container);
                    pickerUtil.refreshPicker(initValue, true);
                    pickerUtil.resetPicker();
                    pickerUtil.showPicker(container);
                });
            }
        }, {
            key: "destory",
            value: function destory() {
                pickerUtil.destoryPicker(container);
            }
        }]);

        return RDPikcer;
    }();

    addListener(document, 'click', function (event) {
        if (instances.indexOf(event.target) == -1 && event.target !== container && container && !isEleInContainer(event.target, container)) {
            pickerUtil.hidePicker(container);
            hideEle(container.querySelector('#rd-picker-year-box'));
            hideEle(container.querySelector('#rd-picker-month-box'));
        }
    });

    exports.default = RDPikcer;
});