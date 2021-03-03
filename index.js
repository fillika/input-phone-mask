"use strict";
const inputs = document.querySelectorAll('input[type="tel"]');
const config = {
    code: 7,
    mask: "(999)999-99-99",
};
inputs.forEach((input) => init(input, config));
function init(input, config) {
    const mask = config.mask;
    const regexObj = {
        onlyNumbers: /\d+/gm,
        notNumbers: /\D+/gm,
    };
    const state = {
        value: "",
    };
    parseTemplate(mask);
    input.addEventListener("focus", () => {
        const value = input.value;
        if (value.length === 0) {
            input.value = `+${config.code} (`;
        }
        setTimeout(() => {
        });
    });
    input.addEventListener("input", (event) => {
        if (event.target !== undefined && event.target !== null) {
            const { value } = event.target;
            const { inputType } = event;
            const valueOnlyNumbers = value.replace(/\D/g, "");
            switch (inputType) {
                case "insertText":
                    input.value = state.value = getPhoneWithTemplate(valueOnlyNumbers);
                    input.selectionStart = input.selectionEnd = getPhoneWithTemplate(valueOnlyNumbers).length;
                    break;
                case "deleteContentBackward":
                    const diff = state.value.replace(input.value, "");
                    if (diff.length === 1) {
                        const isNan = isNaN(Number(diff)) || diff === " ";
                        if (isNan) {
                            input.value = removeChar(input.value);
                        }
                    }
                    state.value = input.value;
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
                    break;
                case "insertFromPaste":
                    break;
                default:
                    break;
            }
        }
    });
}
function parseTemplate(mask) {
    const regex = /(\d+)/gm;
    const result = [];
    let m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    console.log(result);
    return result;
}
function getPhoneWithTemplate(value) {
    const codeTemplate = `+${config.code}`;
    const valueLength = value.length;
    const begin = value.slice(0, 1);
    const firstThree = value.slice(1, 4);
    const secondThree = value.slice(4, 7);
    const firstTwo = value.slice(7, 9);
    const secondTwo = value.slice(9, 11);
    let result = ``;
    if (valueLength <= 1) {
        result = `${codeTemplate} (${begin}`;
    }
    else if (valueLength >= 2 && valueLength <= 3) {
        result = `${codeTemplate} (${firstThree}`;
    }
    else if (valueLength >= 4 && valueLength <= 7) {
        result = `${codeTemplate} (${firstThree}) ${secondThree}`;
    }
    else if (valueLength >= 8 && valueLength <= 9) {
        result = `${codeTemplate} (${firstThree}) ${secondThree}-${firstTwo}`;
    }
    else if (valueLength >= 10) {
        result = `${codeTemplate} (${firstThree}) ${secondThree}-${firstTwo}-${secondTwo}`;
    }
    return result;
}
//# sourceMappingURL=index.js.map