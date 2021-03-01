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
    let template = '';
    new Promise((resolve) => {
        const resultArr = parseTemplate(mask);
        console.log(resultArr);
        resolve(resultArr);
    }).then((result) => {
        result.forEach((element) => {
            if (element === '+') {
                return;
            }
            if (element !== '9' && element.length === 1) {
            }
            console.log(element.length);
        });
    });
    input.addEventListener("input", (event) => {
        if (event.target !== undefined && event.target !== null) {
            const value = event.target.value;
            const isNumber = Number(value);
            if (isNaN(isNumber)) {
                const valueWithOnlyNumbers = value.replace(/\D/g, "");
                input.value = valueWithOnlyNumbers;
                console.log(parseTemplate(valueWithOnlyNumbers));
            }
            else {
                console.log(parseTemplate(value));
            }
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