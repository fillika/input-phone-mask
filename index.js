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
    const codeTemplate = `+${config.code}`;
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
            let result = ``;
            const begin = valueOnlyNumbers.slice(0, 1);
            const firstThree = valueOnlyNumbers.slice(1, 4);
            const secondThree = valueOnlyNumbers.slice(4, 7);
            const firstTwo = valueOnlyNumbers.slice(7, 9);
            const secondTwo = valueOnlyNumbers.slice(9, 11);
            switch (inputType) {
                case "insertText":
                    const valueLength = valueOnlyNumbers.length;
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
                    input.value = state.value = result;
                    input.selectionStart = input.selectionEnd = result.length;
                    break;
                case "deleteContentBackward":
                    const diff = state.value.replace(input.value, "");
                    if (diff === " ") {
                        input.value = input.value.slice(0, input.value.length - 1);
                    }
                    if (diff === ")" || diff === "(" || diff === "-") {
                        input.value = input.value.slice(0, input.value.length - 1);
                    }
                    state.value = input.value;
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
//# sourceMappingURL=index.js.map