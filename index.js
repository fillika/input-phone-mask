"use strict";
var inputs = document.querySelectorAll('input[type="tel"]');
var config = {
    countryCode: "1-784",
    mask: "([9]99) 4 44 44",
    placeholder: true,
};
var re = new RegExp("\\+" + config.countryCode, "gi");
var codeTemplate = "+" + config.countryCode;
inputs.forEach(function (input) { return InitEasyMask(input, config); });
function InitEasyMask(input, config) {
    var state = {
        value: "",
    };
    if (typeof config.placeholder === "boolean" && config.placeholder) {
        input.placeholder = "+" + config.countryCode.toString();
    }
    else if (typeof config.placeholder === "string") {
        input.placeholder = config.placeholder;
    }
    input.addEventListener("focus", inputEventFocus.bind(input));
    input.addEventListener("input", inputEventInput.bind(input));
    function inputEventFocus() {
        var _this = this;
        var value = this.value;
        if (value.length === 0) {
            this.value = codeTemplate;
            var timeoutID_1 = setTimeout(function () {
                _this.selectionStart = _this.selectionEnd = _this.value.length;
                clearTimeout(timeoutID_1);
            }, 10);
        }
    }
    function inputEventInput(event) {
        if (event.target !== undefined && event.target !== null) {
            var value = event.target.value;
            var inputType = event.inputType;
            var result = getPhoneWithTemplate(value);
            switch (inputType) {
                case "insertText":
                    this.value = state.value = result;
                    this.selectionStart = this.selectionEnd = result.length;
                    break;
                case "deleteContentBackward":
                    var diff = state.value.replace(value, "");
                    if (diff.length === 1) {
                        var isNan = isNaN(Number(diff)) || diff === " ";
                        if (isNan) {
                            this.value = removeChar(value);
                        }
                    }
                    state.value = this.value;
                    break;
                case "insertFromPaste":
                    var valueWithoutCodetemplate = value.replace(re, "");
                    this.value = state.value = getPhoneWithTemplate(valueWithoutCodetemplate);
                    break;
                default:
                    break;
            }
        }
    }
}
function parseTemplate(mask) {
    var regExpNumbersGroup = /(\[\d+\]\+)|(\[\d+\])/gm;
    var regex = /(\d+)|(\D+)|(\s+)/gim;
    var result = [];
    var m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    return result.filter(Boolean);
}
function getPhoneWithTemplate(value) {
    var valueWithoutCodetemplate = value.replace(re, "").replace(/\D/g, "");
    var parsedArray = parseTemplate(config.mask);
    var result = createNumber(parsedArray, valueWithoutCodetemplate);
    return codeTemplate + " " + result;
}
function createNumber(parsedArray, currentValue) {
    var croppedResult = currentValue;
    return parsedArray
        .map(function (item) {
        if (croppedResult.length !== 0) {
            if (item === "" || item === " ") {
                return item;
            }
            else if (!isNaN(Number(item))) {
                var result = croppedResult.slice(0, item.length);
                croppedResult = croppedResult.slice(item.length);
                return result;
            }
            else {
                return item;
            }
        }
    })
        .join("");
}
function removeChar(value) {
    var newValue = value.slice(0, value.length - 1);
    var diff = value.replace(newValue, "");
    var isNan = isNaN(Number(diff)) || diff === " ";
    switch (isNan) {
        case true:
            return removeChar(newValue);
        default:
            return newValue;
    }
}
function searchRegExpInMask() {
    var mask = "([9]99) [999]-99-99";
    var maskRegExp = mask.replace(/\D/gmi, "");
    console.log(maskRegExp);
}
searchRegExpInMask();
//# sourceMappingURL=index.js.map