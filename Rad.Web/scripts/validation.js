
// add a trim() function
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ""); };

function registerForm(formId) {
    var form = document.getElementById(formId);

    if (form) {
        form.onsubmit = function () {
            submitForm(formId, false); return false;
        }
    }
}
function submitForm(formId, ret) {
    var form = document.getElementById(formId);
    if (form) {
        if (validateForm(form)) {
            form.submit();
            if (ret) return true;
        }
        if (ret) return false;
    }
}

function clearValidation(clearFocus) {
    var ele = document.getElementById('errorMessageList');
    if (ele) {
        ele.innerHTML = "";
        errorMessages.length = 0;
        ele.style.display = 'none';
    }

    if (clearFocus) {
        for (var i = 0; i < errorControls.length; i++) {
            var ctrl = errorControls[i];
            if (ctrl) {
                $(ctrl).removeClass('errorState');
            }
        }
    }
}

// validate the form
function validateForm(form) {
    var good = true;
    for (var i = 0; i < form.elements.length; i++) {
        good = ValidateControl(form.elements[i]) && good;
    }
    return good;
}

var errorMessages = new Array();
var errorControls = new Array();

// Validate a control
function ValidateControl(ctrl) {
    var b = true;

    // Does this subscribe to validation?
    var validationType = $(ctrl).data('validationtype');
    if (validationType) {
        // Is the control hidden?
        if (CheckControlVisibility(ctrl)) {
            if (validationType.indexOf('required') > -1) {
                b = ValidateRequired(ctrl);
            }
        }
    }
    return b;
}


function CheckControlVisibility(ctrl) {
    if ((ctrl.style.visibility != 'hidden') && (ctrl.style.display != 'none')) {
        return IsParentVisible(ctrl);
    }
    return false;
}

function IsParentVisible(ctrl) {

    var parentCtrl = ctrl.parentNode;
    while (parentCtrl != null) {

        if (parentCtrl.style) {

            if (parentCtrl.style.visibility == 'hidden' || parentCtrl.style.display == 'none') {
                return false;
            }
        }
        parentCtrl = parentCtrl.parentNode;

    }
    return true;
}

// validate that a required value is specified
function ValidateRequired(ctrl) {
    if (ctrl.value) {

        if (ctrl.value.trim() === "") {
            DisplayErrorMessage(ctrl);
            return false;
        }
        else {
            RemoveErrorMessage(ctrl);
            return true;
        }
    }
    DisplayErrorMessage(ctrl);
    return false;
}

// determine if we're displaying an error message for this control
function IsShowingErrorMessage(ctrl) {
    for (var i = 0; i < errorMessages.length; i++) {
        if (errorMessages[i] == ctrl)
            return true;
    }
    return false;
}

// display an error message 
//(if a control is specified, show it, also show the specified error message in a display)
function DisplayErrorMessage(ctrl) {
    if ($(ctrl).data("errormessagecontrol")) {
        document.getElementById($(ctrl).data("errormessagecontrol")).style.display = 'inline';
    }
    if (!IsShowingErrorMessage(ctrl)) {
        if ($(ctrl).data("errormessage")) {
            errorMessages.push(ctrl);
            errorControls.push(ctrl);
        }
        ShowErrorList();
    }
    $(ctrl).addClass('errorState');
}

// Remove an error message
function RemoveErrorMessage(ctrl) {
    if ($(ctrl).data("errormessagecontrol")) {
        document.getElementById($(ctrl).data("errormessagecontrol")).style.display = 'none';
    }
    if (IsShowingErrorMessage(ctrl)) {
        for (var i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i] === ctrl) {
                errorMessages.splice(i, 1);
                break;
            }
        }
        ShowErrorList();
    }
    $(ctrl).removeClass('errorState');
}

// Show the list of error messages
function ShowErrorList() {
    var ele = document.getElementById('errorMessageList');
    if (ele) {
        ele.innerHTML = "";
        if (errorMessages.length == 0)
            ele.style.display = 'none';
        else {
            ele.style.display = 'block';
            for (var i = 0; i < errorMessages.length; i++) {
                if ($(errorMessages[i]).data("errormessage"))
                    ele.innerHTML += "<li>" + $(errorMessages[i]).data("errormessage") + "</li>";
            }
        }
    }
}