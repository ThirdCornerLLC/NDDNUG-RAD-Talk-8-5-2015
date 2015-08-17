var pageIndex = 0;
var pageCount = 0;
var sortColumn = defaultSortColumn;
var sortDirection = "asc";
//use filter certificates to get code for the html table
function doSearch(reset, exportToExcel) {

    if (reset) {
        pageCount = 0;
        pageIndex = 0;
        sortColumn = defaultSortColumn;
        sortDirection = "asc";
    }
    $('#pageCount').val(pageCount);
    $('#pageIndex').val(pageIndex);
    $('#sortColumn').val(sortColumn);
    $('#sortDirection').val(sortDirection);
    var vals = gatherFormFields('searchForm');
    if (!exportToExcel) {
        location.hash = vals;
        $('#results').html('<img src="' + loadingUrl + '" />');
        $('#results').show();
        var form = $('#searchForm');
        $.post(searchUrl + "?r=" + Math.random(), form.serialize(), function (data) {
            $('#results').html(data);
            var colTD = document.getElementById('col' + sortColumn);
            if (colTD) {
                for (var i = 0; i < colTD.parentNode.childNodes.length; i++) {
                    $(colTD.parentNode.childNodes[i]).removeClass('asc').removeClass('desc');
                }
                $(colTD).addClass(sortDirection);
            }
        });
    } else {

        var form = document.getElementById('searchForm');
        form.action = exportExcelUrl;
        form.submit();
    }

    return false;
}

//$(document).ready(function () {
//    doHistorySetup();
//});

function doHistorySetup(forceGo) {
    var state = location.hash;
    if (state != '') {
        setupScreenBasedOnHistoryState(state);
        doSearch();
    }
    else {
        if (forceGo)
            doSearch();
    }
}


function doSort(column) {
    if (column == sortColumn)
        sortDirection = sortDirection == "asc" ? "desc" : "asc";
    else {
        sortColumn = column;
        sortDirection = "asc";
        pageIndex = 0;
        pageCount = 0;
    }
    doSearch();
}

function nextPage() {
    pageIndex++;
    doSearch();
}

function gotoPage(index) {
    pageIndex = index;
    doSearch();
}

function previousPage() {
    pageIndex--;
    doSearch();
}

function gatherFormFields(formId) {
    var s = "";
    if (!formId)
        formId = 'searchForm';
    var form = document.getElementById(formId);
    var eles = form.getElementsByTagName('input');
    for (var i = 0; i < eles.length; i++) {
        if (eles[i].name) {
            if (eles[i].type == 'checkbox') {
                s += "&" + eles[i].name + '=' + escape(eles[i].checked);
            } else {
                s += "&" + eles[i].name + '=' + escape(eles[i].value);
            }
        }
    }

    eles = form.getElementsByTagName('select');
    for (var i = 0; i < eles.length; i++) {
        if (eles[i].name) {
            if (eles[i].multiple && eles[i].value != "") {
                var vals = "";
                for (var j = 0; j < eles[i].options.length; j++) {
                    if (eles[i].options[j].selected) {
                        vals += eles[i].options[j].value + "|";
                    }
                }
                s += "&" + eles[i].name + '=' + escape(vals);
            } else {
                s += "&" + eles[i].name + '=' + escape(eles[i].value);
            }
        }
    }
    return s;
}

function buildValues(state) {
    var o = {};
    var tokens = state.split('&');
    for (var i = 0; i < tokens.length; i++) {
        var ts = tokens[i].split('=');
        o[ts[0]] = unescape(ts[1]);
    }
    return o;
}

function setupScreenBasedOnHistoryState(state) {

    var values = buildValues(state);
    pageIndex = values["pageIndex"];
    pageCount = values["pageCount"];
    sortColumn = values["sortColumn"];
    sortDirection = values["sortDirection"];
    var form = document.getElementById('searchForm');
    setupChildFormElementValues(form, values);
}

function setupChildFormElementValues(ele, values) {
    var eles = ele.getElementsByTagName('input');
    for (var i = 0; i < eles.length; i++) {
        if (eles[i].name && values[eles[i].name]) {
            eles[i].value = values[eles[i].name];
        }
    }

    eles = ele.getElementsByTagName('select');

    for (var i = 0; i < eles.length; i++) {
        if (eles[i].name && values[eles[i].name]) {
            if (eles[i].multiple) {
                var vals = unescape(values[eles[i].name]).split('|');
                for (var j = 0; j < eles[i].options.length; j++) {
                    for (var k = 0; k < vals.length - 1; k++) {
                        if (eles[i].options[j].value == vals[k]) {
                            eles[i].options[j].selected = true;
                        }
                    }
                }
            } else {
                eles[i].value = values[eles[i].name];
                if (eles[i].value !== "")
                    $(eles[i]).removeClass('placeholder');
                if (eles[i].onchange)
                    eles[i].onchange();
            }

        }
    }
}