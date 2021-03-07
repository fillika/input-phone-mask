"use strict";
var inputs = document.querySelectorAll('input[type="tel"]');
var config = {
    countryCode: 7,
    mask: "([9]99) [123]-99-92",
    placeholder: true,
};
var re = new RegExp("\\+" + config.countryCode, "gi");
var codeTemplate = "+" + config.countryCode;
inputs.forEach(function (input) { return InitEasyMask(input, config); });
function InitEasyMask(input, config) {
    var state = {
        value: "",
        myTemplate: searchRegExpInMask(config.mask),
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
            var result = getPhoneWithTemplate(value, state);
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
                    this.value = state.value = getPhoneWithTemplate(valueWithoutCodetemplate, state);
                    break;
                default:
                    break;
            }
        }
    }
}
function parseTemplate(mask) {
    var regex = /(\D+)|(\s+)|(\d+(?=\]))|(\d)/gim;
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
function getPhoneWithTemplate(value, state) {
    var valueWithoutCodetemplate = value.replace(re, "").replace(/\D/g, "");
    var parsedArray = parseTemplate(config.mask);
    var result = createNumber(parsedArray, valueWithoutCodetemplate, state);
    return codeTemplate + " " + result;
}
function createNumber(parsedArray, currentValue, state) {
    var croppedResult = currentValue;
    var croppedMaskTemplated = state.myTemplate.map(function (item) { return item; });
    var result = [];
    for (var index = 0; index < parsedArray.length; index++) {
        var item = parsedArray[index];
        if (croppedResult.length !== 0) {
            if (item === "" || item === " ") {
                result.push(item.replace(/\[|\]/, ""));
            }
            else if (!isNaN(Number(item))) {
                var resultNumber = croppedResult.slice(0, item.length);
                var shiftedRegExpConfig = croppedMaskTemplated.shift();
                var re_1 = new RegExp(shiftedRegExpConfig.regExp, "gi");
                var isValid = resultNumber.match(re_1);
                croppedResult = croppedResult.slice(item.length);
                if (isValid === null) {
                    result.push(resultNumber.slice(0, resultNumber.length - 1));
                }
                else {
                    result.push(resultNumber);
                }
            }
            else {
                result.push(item.replace(/\[|\]/, ""));
            }
        }
    }
    return result.join("");
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
function searchRegExpInMask(mask) {
    var result = [];
    var regex = /\[\d+\]|\d+/gm;
    var m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        var find = m[0];
        var regExpSquareBrackets = find.match(/\[\d+\]/gm);
        if (regExpSquareBrackets !== null) {
            result.push(getNumbersInSquareBrackets(regExpSquareBrackets));
        }
        else {
            var singleNumbersArray = find.split("");
            singleNumbersArray.forEach(function (number) {
                var numberRegExp = Number(number) === 9 ? "(\\d)" : "[" + number + "]";
                result.push({
                    length: 1,
                    regExp: numberRegExp,
                });
            });
        }
    }
    function getNumbersInSquareBrackets(regExpSquareBrackets) {
        var a = regExpSquareBrackets[0];
        var numberInsideBrackets = a.match(/\d+/gm)[0];
        var length = numberInsideBrackets.length;
        var regExpConfig = {
            length: length,
            regExp: "",
        };
        if (length >= 2) {
            var re_2 = /(.)(?=.*\1)/gm;
            var resultWithoutDuplicates = numberInsideBrackets.replace(re_2, "");
            regExpConfig.regExp = "[" + resultWithoutDuplicates + "]+(?![0-9])";
        }
        else {
            regExpConfig.regExp = "[" + numberInsideBrackets + "]";
        }
        return regExpConfig;
    }
    return result;
}
//# sourceMappingURL=index.js.map