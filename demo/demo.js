var RDPicker = rdatepicker.default;

var picker = new RDPicker({
    ele: document.getElementById("oInput"),
    target: 'mobile'
});

var picker2= new RDPicker({
    ele: document.getElementById("oInput2"),
    target: 'web',
    type: 'month'
});