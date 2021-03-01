"use strict";
const inputs = document.querySelectorAll('input[type="tel"]');
const config = {
    mask: "+7(999)999-99-99",
};
inputs.forEach((input) => init(input, config));
function init(input, config) {
    const mask = config.mask;
    const regexObj = {
        onlyNumbers: /\d+/gm,
        notNumbers: /\D+/gm,
    };
    let template = "+7 (___) ___-__-__";
    input.value = template;
    new Promise((resolve) => {
        const resultArr = parseTemplate(mask);
        console.log(resultArr);
        resolve(resultArr);
    }).then((result) => {
        result.forEach((element) => {
            if (element === "+") {
                return;
            }
            if (element !== "9" && element.length === 1) {
            }
        });
    });
    input.addEventListener("focus", () => {
        console.log("focus");
        setTimeout(() => {
            input.selectionStart = input.selectionEnd = 4;
        });
    });
    input.addEventListener("input", (event) => {
        if (event.target !== undefined && event.target !== null) {
            const { value } = event.target;
            const { inputType } = event;
            const valueWithOnlyNumbers = value.replace(/\D/g, "");
            console.log(value);
            const countryCode = 7;
            const firstThree = valueWithOnlyNumbers.slice(1, 4);
            const secondThree = valueWithOnlyNumbers.slice(4, 7);
            const firstTwo = valueWithOnlyNumbers.slice(7, 9);
            const secondTwo = valueWithOnlyNumbers.slice(9, 11);
            switch (inputType) {
                case "insertText":
                    break;
                case "deleteContentBackward":
                    break;
                case "insertFromPaste":
                    break;
                default:
                    break;
            }
            input.value = template;
        }
    });
}
function parseTemplate(mask) {
    const regex = /(\d+)|(\D)/gm;
    const result = [];
    let m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    return result;
}
//# sourceMappingURL=index.js.map