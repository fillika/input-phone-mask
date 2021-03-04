"use strict";
const inputs = document.querySelectorAll('input[type="tel"]');
const config = {
    countryCode: "1-784",
    mask: "(999) 999-99-99",
    placeholder: true,
};
const re = new RegExp(`\\+${config.countryCode}`, "gi");
const codeTemplate = `+${config.countryCode}`;
inputs.forEach((input) => Init(input, config));
function Init(input, config) {
    const state = {
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
        const value = this.value;
        if (value.length === 0) {
            this.value = codeTemplate;
            const timeoutID = setTimeout(() => {
                this.selectionStart = this.selectionEnd = this.value.length;
                clearTimeout(timeoutID);
            }, 10);
        }
    }
    function inputEventInput(event) {
        if (event.target !== undefined && event.target !== null) {
            const { value } = event.target;
            const { inputType } = event;
            const result = getPhoneWithTemplate(value);
            switch (inputType) {
                case "insertText":
                    this.value = state.value = result;
                    this.selectionStart = this.selectionEnd = result.length;
                    break;
                case "deleteContentBackward":
                    const diff = state.value.replace(value, "");
                    if (diff.length === 1) {
                        const isNan = isNaN(Number(diff)) || diff === " ";
                        if (isNan) {
                            this.value = removeChar(value);
                        }
                    }
                    state.value = this.value;
                    break;
                case "insertFromPaste":
                    const valueWithoutCodetemplate = value.replace(re, "");
                    this.value = state.value = getPhoneWithTemplate(valueWithoutCodetemplate);
                    break;
                default:
                    break;
            }
        }
    }
}
function parseTemplate(mask) {
    const regex = /(\d+)|(\D+)|(\s+)/gim;
    const result = [];
    let m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    console.log(result.filter(Boolean));
    return result.filter(Boolean);
}
function getPhoneWithTemplate(value) {
    const valueWithoutCodetemplate = value.replace(re, "").replace(/\D/g, "");
    const parsedArray = parseTemplate(config.mask);
    const result = createNumber(parsedArray, valueWithoutCodetemplate);
    return `${codeTemplate} ${result}`;
}
function createNumber(parsedArray, currentValue) {
    let croppedResult = currentValue;
    return parsedArray
        .map((item) => {
        if (croppedResult.length !== 0) {
            if (item === "" || item === " ") {
                return item;
            }
            else if (!isNaN(Number(item))) {
                const result = croppedResult.slice(0, item.length);
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
    const newValue = value.slice(0, value.length - 1);
    const diff = value.replace(newValue, "");
    const isNan = isNaN(Number(diff)) || diff === " ";
    switch (isNan) {
        case true:
            return removeChar(newValue);
        default:
            return newValue;
    }
}
//# sourceMappingURL=index.js.map