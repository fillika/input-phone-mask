export function parseTemplate(mask) {
    const regex = /(\D+)|(\s+)|(\d+(?=\]))|(\d)/gim;
    const result = [];
    let m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    return result.filter(Boolean);
}
export function removeChar(value) {
    const newValue = value.slice(0, value.length - 1);
    const diff = value.replace(newValue, '');
    const isNan = isNaN(Number(diff)) || diff === ' ';
    switch (isNan) {
        case true:
            return removeChar(newValue);
        default:
            return newValue;
    }
}
export function searchRegExpInMask(mask) {
    const result = [];
    const regex = /\[\d+\]|\d+/gm;
    let m;
    while ((m = regex.exec(mask)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        const [find] = m;
        const regExpSquareBrackets = find.match(/\[\d+\]/gm);
        if (regExpSquareBrackets !== null) {
            result.push(getNumbersInSquareBrackets(regExpSquareBrackets));
        }
        else {
            const singleNumbersArray = find.split('');
            singleNumbersArray.forEach(number => {
                const numberRegExp = Number(number) === 9 ? `(\\d)` : `[${number}]`;
                result.push({
                    length: 1,
                    regExp: numberRegExp,
                });
            });
        }
    }
    function getNumbersInSquareBrackets(regExpSquareBrackets) {
        let [a] = regExpSquareBrackets;
        const numberInsideBrackets = a.match(/\d+/gm)[0];
        const length = numberInsideBrackets.length;
        const regExpConfig = {
            length: length,
            regExp: ``,
        };
        if (length >= 2) {
            const re = /(.)(?=.*\1)/gm;
            const resultWithoutDuplicates = numberInsideBrackets.replace(re, '');
            regExpConfig.regExp = `^[${resultWithoutDuplicates}]+$`;
        }
        else {
            regExpConfig.regExp = `[${numberInsideBrackets}]`;
        }
        return regExpConfig;
    }
    return result;
}
export function getPurePhoneNumber(value, state) {
    return value.replace(state.globalRegExp, '').replace(/\D/g, '');
}
export function createNumberAfterTyping(purePhoneNumber, state) {
    const result = [];
    if (purePhoneNumber.length === 0) {
        return result.join('');
    }
    let croppedMaskTemplated = state.myTemplate.map(item => item);
    for (let index = 0; index < state.parsedMask.length; index++) {
        const item = state.parsedMask[index];
        if (purePhoneNumber.length !== 0) {
            if (item === '' || item === ' ') {
                result.push(item.replace(/\[|\]/, ''));
            }
            else if (!isNaN(Number(item))) {
                const resultNumber = purePhoneNumber.slice(0, item.length);
                const shiftedRegExpConfig = croppedMaskTemplated.shift();
                const re = new RegExp(shiftedRegExpConfig.regExp, 'gi');
                const isValid = resultNumber.match(re);
                purePhoneNumber = purePhoneNumber.slice(item.length);
                if (isValid === null) {
                    result.push(resultNumber.slice(0, resultNumber.length - 1));
                }
                else {
                    result.push(resultNumber);
                }
            }
            else {
                result.push(item.replace(/\[|\]/, ''));
            }
        }
    }
    return result.join('');
}
export function createNumberAfterCopy(purePhoneNumber, state) {
    let croppedMaskTemplated = state.myTemplate.map(item => item);
    const result = [];
    loop1: for (let index = 0; index < state.parsedMask.length; index++) {
        const item = state.parsedMask[index];
        if (purePhoneNumber.length !== 0) {
            if (item === '' || item === ' ') {
                result.push(item.replace(/\[|\]/, ''));
            }
            else if (!isNaN(Number(item))) {
                const resultNumber = purePhoneNumber.slice(0, item.length);
                const shiftedRegExpConfig = croppedMaskTemplated.shift();
                const re = new RegExp(shiftedRegExpConfig.regExp, 'gi');
                const isValid = resultNumber.match(re);
                purePhoneNumber = purePhoneNumber.slice(item.length);
                loop2: for (let j = 0; j < resultNumber.length; j++) {
                    const number = resultNumber[j];
                    if (number.match(re) !== null) {
                        result.push(number);
                    }
                    else {
                        break loop1;
                    }
                }
            }
            else {
                result.push(item.replace(/\[|\]/, ''));
            }
        }
    }
    return result.join('');
}
export function getResultPhone(phoneNumberWithTeplate, state) {
    const { prefix, countryCodeTemplate } = state;
    return `${prefix}${countryCodeTemplate === '' ? countryCodeTemplate : countryCodeTemplate + ' '}${phoneNumberWithTeplate}`;
}
