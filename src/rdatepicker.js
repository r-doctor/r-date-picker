const containerId = "rd-picker-container";
const containerClass = "rd-picker-container";

let w = 300;
let h = 260;
let hasInstance = false;
let initFlag = false;
let container = null;
let instances = [];
let currentTarget = null;
let currentOptions = null;
let mStart = 0;
let mEnd = 0;
let dateData = {
    year: '',
    month: '',
    date: '',
    hour: '',
    minute: '',
    second: ''
};
let monthMap = {
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
let daysArr = ['周日', '周一', '周二', '周三' , '周四', '周五', '周六'];
let currentYear = 0;
let initValue = '';
let initMonth = '';
let initYear = '';

const DEFAULTS = {
    type: 'date',
    target: 'web'
};

function perMonthDays(year) {
    if((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
        return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    } else {
        return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
}

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
    let className = ele.className;
    if(!className) {
        return false;
    }
    let classArr = makeClassArr(className);
    if(classArr.indexOf(classStr) > -1) {
        classArr.splice(classArr.indexOf(classStr), 1);
    }
    ele.className =  classArr.join(' ');
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
    let days = [];
    let d = new Date();
    let m = d.getMonth();
    year = year || d.getFullYear();
    month = month || formatMonth(m);
    let mIndex = Number(month) - 1;
    let firstDay = new Date(year + '-' + month + '-01').getDay();
    let start = firstDay;
    let end = firstDay + perMonthDays(Number(year))[mIndex] - 1;
    let tempDate = 0;
    let nextDate = 0;
    let preDate = 0;
    if(mIndex == 0) {
        preDate = 31 - start;
    } else {
        preDate = perMonthDays(Number(year))[mIndex - 1] - start;
    }
    for(let i = 0; i < 42; i++) {
        if(i >= start && i <= end) {
            days.push(tempDate + 1);
            tempDate++;
        } else if(i > end) {
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
    let arr = [];
    let y = Number(year);
    let start = y - 8;
    let end = y + 7;
    for(let i = start; i < end; i++) {
        arr.push(i);
    }
    return arr;
}

function getYearRange(year) {
     let y = year || Number(dateData.year);
    return {
        preFirstYear: y - 23,
        preLastYear: y - 9,
        nextFirstYear: y + 7,
        nextLastYear: y + 21
    }
};

function formatDate(date) {
    let d = date.split(' ');
    let ymd = d[0];
    let hms = d[1];
    let ymdArr = ymd.split('-');
    let hmsArr = ['00', '00', '00'];
    if(hms) {
        hmsArr = hms.split(':');
    }
    return {
        year: ymdArr[0],
        month: ymdArr[1],
        date: ymdArr[2],
        hour: hmsArr[0],
        minute: hmsArr[1],
        second: hmsArr[2]
    }
}

function formatMonth(m) {
    return m > 9 ? ('' + m) : ('0' + m);
}

function zeroPad(s) {
    return s.length < 2 ? '0' + s : s;
}

function getNow() {
    let now = new Date();
    let _year = now.getFullYear();
    let _month = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : '' + (now.getMonth() + 1);
    let _date = now.getDate();
    let _hour = now.getHours();
    let _minute = now.getMinutes();
    let _second = now.getSeconds();

    return {
        year: _year,
        month: _month,
        date: _date,
        hour: _hour,
        minute: _minute,
        second: _second,
        ymd: _year + '-' + _month + '-' + _date
    }
}

function showOrHideEle(ele) {
    if(window.getComputedStyle(ele, null).getPropertyValue('display') === 'none') {
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

const pickerUtil = {
    initPicker: function (container) {
        if(!initFlag) {
            let pickerFragment = document.createDocumentFragment();
            pickerFragment.appendChild(this.createPickerHeader());
            pickerFragment.appendChild(this.createPickerBody());
            // pickerFragment.appendChild(this.createPickerFooter());
            pickerFragment.appendChild(this.createYearBox());
            pickerFragment.appendChild(this.createMonthBox());
            container.appendChild(pickerFragment);
            initFlag = true;
        }
    },
    createPickerHeader: function() {
        const preYear = createElement('i', {
            class: 'rd-picker-icon',
            events: {
                click: (e) => {
                    if(container.querySelector('#rd-picker-year-box').style.display === 'block') {
                        return;
                    }
                    dateData.year = dateData.year - 1;
                    this.refreshPicker();
                }
            }
        });

        const yearText = createElement('div', {
            class: 'ym-text',
            id: 'yearText',
            events: {
                click: () => {
                    currentYear = Number(dateData.year);
                    initYear = currentYear;
                    showOrHideEle(container.querySelector('#rd-picker-year-box'));
                    if(currentOptions.type !== 'month') {
                        hideEle(container.querySelector('#rd-picker-month-box'));
                    }
                    container.querySelector('#rd-picker-year-box').replaceChild(this.createYearList(), container.querySelector('#rd-picker-year-list'));
                    container.querySelector('#rd-picker-year-box').replaceChild(this.createYearNav(), container.querySelector('#rd-picker-year-nav'));
                }
            }
        }, ['2018']);

        const nextYear = createElement('span', {
            class: 'rd-picker-icon icon-next',
            events: {
                click: (e) => {
                    if(container.querySelector('#rd-picker-year-box').style.display === 'block') {
                        return;
                    }
                    dateData.year = Number(dateData.year) + 1;
                    this.refreshPicker();
                }
            }
        });
        const preMonth = createElement('i', {
            class: 'rd-picker-icon icon-pre',
            events: {
                click: (e) => {
                    if(container.querySelector('#rd-picker-month-box').style.display === 'block') {
                        return;
                    }
                    if(Number(dateData.month) == 1) {
                        dateData.year = dateData.year - 1;
                        dateData.month = '12';
                    } else {
                        dateData.month = formatMonth(Number(dateData.month) - 1);
                    }
                    this.refreshPicker();
                }
            }
        });

        const monthText = createElement('div', {
            class: 'ym-text',
            id: 'monthText',
            events: {
                click: () => {
                    initMonth = dateData.month;
                    container.replaceChild(this.createMonthBox(), container.querySelector('#rd-picker-month-box'));
                    showOrHideEle(container.querySelector('#rd-picker-month-box'));
                    hideEle(container.querySelector('#rd-picker-year-box'));
                }
            }
        }, ['四月']);

        const nextMonth = createElement('i', {
            class: 'rd-picker-icon icon-next',
            events: {
                click: (e) => {
                    if(container.querySelector('#rd-picker-month-box').style.display === 'block') {
                        return;
                    }
                    if(Number(dateData.month) == 12) {
                        dateData.year = Number(dateData.year) + 1;
                        dateData.month = '01';
                    } else {
                        dateData.month = formatMonth(Number(dateData.month) + 1);
                    }
                    this.refreshPicker();
                }
            }
        });

        return createElement(
            'div',
            {
                class: 'rd-picker-header'
            },
            [
                createElement('div', { class : 'rd-picker-change', id: 'rd-picker-changer-year' }, [
                    preYear,
                    yearText,
                    nextYear
                ]),
                createElement('div', { class : 'rd-picker-change', id: 'rd-picker-changer-month' }, [
                    preMonth,
                    monthText,
                    nextMonth
                ])
            ]
        );
    },
    createPickerMask: function() {
        return createElement('div', {
            class: 'rd-picker-mask',
            id: 'rd-picker-mask',
            events: {
                click: (e) => {
                    hideEle(e.target);
                }
            }
        });
    },
    createPickerBody: function() {
        let daysTextFragment = document.createDocumentFragment();
        let daysFragment = document.createDocumentFragment();
        let days = createDays(dateData.year, dateData.month);
        daysArr.forEach((day) => {
            daysTextFragment.appendChild(createElement('span', {class: 'rd-picker-day'}, [day]));
        });
        days.forEach((day, index) => {
            let classStr = 'day-text';
            if(dateData.date && (dateData.date == day) && (initValue === (dateData.year + '-' + dateData.month + '-' + dateData.date))) {
                classStr = classStr + ' selected';
            }
            if(index < mStart || index > mEnd) {
                classStr = classStr + ' disabled';
            }
            daysFragment.appendChild(createElement('li', {class: 'rd-picker-day-item'}, [
                createElement('span', {
                    class: classStr,
                    events: {
                        click: (e) => {
                            dateData.date = zeroPad(e.target.innerText);
                            if(hasClass(e.target, 'disabled')) {
                                return;
                            }
                            if(container.querySelector('.selected')) {
                                removeClass(container.querySelector('.selected'), 'selected');
                            }
                            addClass(e.target, 'selected');
                            let returnStr = '';
                            if(currentOptions.type === 'date') {
                                returnStr = dateData.year + '-' + dateData.month + '-' + dateData.date;
                            } else if(currentOptions.type === 'month') {
                                returnStr = dateData.year + '-' + dateData.month;
                            }
                            if(currentOptions.selectCallback) {
                                currentOptions.selectCallback(returnStr);
                            } else {
                                currentTarget.value = returnStr;
                            }
                            hideEle(container.querySelector('#rd-picker-year-box'));
                            hideEle(container.querySelector('#rd-picker-month-box'));
                            setTimeout(() => {
                                this.hidePicker(container);
                                if(currentOptions.target === 'mobile') {
                                    hideEle(document.querySelector('#rd-picker-mask'));
                                }
                            }, 200);
                        }
                    },
                }, [ day ])
            ]));
        });
        return createElement(
            'div',
            {
                class: 'rd-picker-body',
                id: 'rd-picker-body'
            },
            [
                createElement('div', { class: 'rd-picker-day-box'}, [ daysTextFragment ]),
                createElement('ul', { class: 'rd-picker-day-list' }, [ daysFragment ])
            ]
        );
    },
    createPickerFooter: function(ele) {
        return createElement(
            'div',
            {
                class: 'rd-picker-footer',
                id: 'rd-picker-footer'
            },
            [
                createElement('button', {
                    class: 'picker-btn cancel-btn',
                    events: {
                        click: () => {
                            this.hidePicker(container);
                            hideEle(container.querySelector('#rd-picker-year-box'));
                            hideEle(container.querySelector('#rd-picker-month-box'));
                        }
                    }
                }, [ '取消' ]),
                createElement('button', {
                    class: 'picker-btn confirm-btn',
                    events: {
                        click: () => {
                            let returnStr = '';
                            if(currentOptions.type === 'date') {
                                returnStr = dateData.year + '-' + dateData.month + '-' + dateData.date;
                            } else if(currentOptions.type === 'month') {
                                returnStr = dateData.year + '-' + dateData.month;
                            }
                            if(currentOptions.selectCallback) {
                                currentOptions.selectCallback(returnStr);
                            } else {
                                currentTarget.value = returnStr;
                            }
                            this.hidePicker(container);
                            hideEle(container.querySelector('#rd-picker-year-box'));
                            hideEle(container.querySelector('#rd-picker-month-box'));
                        }
                    }
                }, [ '确定' ])
            ]
        );
    },
    createYearBox: function() {
        return createElement('div', {
            class: "rd-picker-ym-box year",
            id: "rd-picker-year-box"
        }, [
            this.createYearList(),
            this.createYearNav()
        ]);
    },
    createYearList: function(year) {
        let yearsArr = year? createYears(year) : (dateData.year ? createYears(dateData.year) : []);
        let yFragment = '';
        if(yearsArr.length) {
            yFragment = document.createDocumentFragment();
            yearsArr.forEach((year) => {
                let classStr = 'ym-text';
                if(initYear == year) {
                    classStr = classStr + ' selected';
                }
                yFragment.appendChild(createElement('li', {
                    class: "rd-picker-ym-item"
                }, [
                    createElement('span', {
                        class: classStr,
                        "data-year": year,
                        events: {
                            click: (e) => {
                                let y = getElementAttribute(e.target, 'data-year');
                                dateData.year = y;
                                this.refreshPicker();
                                hideEle(container.querySelector('#rd-picker-year-box'));
                            }
                        }
                    }, [ year ])
                ]));
            })
        }
        return createElement('ul', {
            class: "rd-picker-ym-list",
            id: 'rd-picker-year-list'
        }, [ yFragment ]);
    },
    createYearNav: function(year) {
        let y = year || Number(dateData.year);
        return createElement('div', {
            class: 'rd-picker-year-nav',
            id: 'rd-picker-year-nav'
        }, [
            createElement('button', {
                class: 'year-nav-button pre-years',
                events: {
                    click: () => {
                        currentYear = currentYear - 15;
                        container.querySelector('#rd-picker-year-box').replaceChild(this.createYearList(currentYear), container.querySelector('#rd-picker-year-list'));
                    }
                }
            }, [ '上一页' ]),
            createElement('button', {
                class: 'year-nav-button next-years',
                style: 'float: right;',
                events: {
                    click: () => {
                        currentYear = currentYear + 15;
                        container.querySelector('#rd-picker-year-box').replaceChild(this.createYearList(currentYear), container.querySelector('#rd-picker-year-list'));
                    }
                }
            }, [ '下一页' ])
        ]);
    },
    createMonthBox: function() {
        let mFragement = document.createDocumentFragment();
        ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach((item) => {
            let classStr = "ym-text";
            if(initMonth == item) {
                classStr = classStr + " selected";
            }
            mFragement.appendChild(createElement('li', { class: "rd-picker-ym-item" }, [
                createElement('span', {
                    class: classStr,
                    "data-month": item,
                    events: {
                        click: (e) => {
                            let m = getElementAttribute(e.target, 'data-month');
                            dateData.month = m;
                            if(currentOptions.type === 'month') {
                                if(currentOptions.selectCallback) {
                                    currentOptions.selectCallback(dateData.year + '-' + dateData.month);
                                } else {
                                    currentTarget.value = dateData.year + '-' + dateData.month;
                                }
                                this.hidePicker(container);
                            } else {
                                this.refreshPicker();
                            }
                            hideEle(container.querySelector('#rd-picker-month-box'));
                            if(currentOptions.target === 'mobile') {
                                hideEle(document.querySelector('#rd-picker-mask'));
                            }
                        }
                    }
                } , [ monthMap[item] ])
            ]));
        });
        return createElement('div', {
            class: "rd-picker-ym-box",
            id: "rd-picker-month-box"
        }, [
            createElement('ul', { class: "rd-picker-ym-list"}, [
                mFragement
            ])
        ]);
    },
    refreshPicker: function(value, init) {
        if(value) {
            let initObj = formatDate(value);
            dateData = Object.assign({}, dateData, initObj);
        } else if(init) {
            let initObj = getNow();
            dateData = Object.assign({}, dateData, initObj);
        }
        if(currentOptions.type === 'month') {
            document.querySelector('#yearText').innerText = dateData.year;
        } else {
            document.querySelector('#yearText').innerText = dateData.year;
            document.querySelector('#monthText').innerText = monthMap[dateData.month];
            container.replaceChild(this.createPickerBody(), container.querySelector('#rd-picker-body'));
        }
    },
    setPickerPosition: function (ele, container) {
        if(currentOptions.target === 'web') {
            let rect = getElementRect(ele);
            let w1 = window.innerWidth - rect.left;
            let h1 = window.innerHeight - (rect.top + rect.height);
            if(w1 < w) {
                container.style.left = 'initail';
                container.style.right = (window.innerWidth - rect.right) + 'px';
            } else {
                container.style.right = 'initail';
                container.style.left = rect.left + 'px';
            }
            if(h1 < h) {
                container.style.top = (rect.top - h) + 'px';
            } else {
                container.style.top = (rect.top + rect.height) + 'px';
            }
        } else {
            container.style.left = '0';
            container.style.bottom = '0';
            container.style.width = '100%';
        }
    },
    showPicker: function (container) {
        container.style.display = 'block';
    },
    hidePicker: function (container) {
        container.style.display = 'none';
    },
    destoryPicker: function(container) {
        container && container.remove();
    },
    resetPicker: function() {
        container.style.height = '260px';
        if(currentOptions.target === 'mobile') {
            // hideEle(container.querySelector('#rd-picker-footer'));
            showEle(document.querySelector('#rd-picker-mask'));
        }
        if(currentOptions.type === 'month') {
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
                    class: containerClass
                }
            );
            document.body.appendChild(pickerUtil.createPickerMask());
            document.body.appendChild(pickerContainer);
            pickerUtil.initPicker(pickerContainer);
            container = pickerContainer;
        }

        addListener(this.ele, 'click', () => {
            console.log('click');
            currentTarget = this.ele;
            currentOptions = this.opts;
            initValue = currentTarget.value || getNow().ymd;
            initYear = currentTarget.value ? currentTarget.value.split('-')[0] : getNow().year;
            initMonth = currentTarget.value ? currentTarget.value.split('-')[1] : getNow().month;
            if(currentOptions.type === 'month') {
                container.replaceChild(pickerUtil.createMonthBox(), container.querySelector('#rd-picker-month-box'));
            }

            pickerUtil.setPickerPosition(this.ele, container);
            pickerUtil.refreshPicker(initValue, true);
            pickerUtil.resetPicker();
            pickerUtil.showPicker(container);

        });
    }
    destory() {
        pickerUtil.destoryPicker(container);
    }
}

addListener(document, 'click', (event) => {
    if(instances.indexOf(event.target) == -1 && event.target !== container && (container && !isEleInContainer(event.target, container))) {
        pickerUtil.hidePicker(container);
        hideEle(container.querySelector('#rd-picker-year-box'));
        hideEle(container.querySelector('#rd-picker-month-box'));
    }
});


export default RDPikcer;