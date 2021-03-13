import Methods from './Methods';
/**
 * * Парсинг входящего шаблона (маски)
 * * Тут Я получаю массив элементов из маски
 * ["([", "9", "]", "9", "9", ") [", "123", "]-", "9", "9", "-", "9", "2"]
 */
export function parseTemplate(mask: string): string[] {
  const regex = /(\D+)|(\s+)|(\d+(?=\]))|(\d)/gim;
  const result = [];
  let m;

  while ((m = regex.exec(mask)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    result.push(m[0]);
  }

  return result.filter(Boolean);
}

export function removeChar(value: string): string {
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

/**
 * Получаю готовый номер с маской
 * value - чистое, не форматированное
 */
export function getPurePhoneNumber(value: string, obj: Methods): string {
  // TODO - Проверка на положение каретки.
  if (obj.input.selectionStart! <= (obj.state.countryCodeTemplate + obj.state.prefix).length) {
    // Если картека внутри кода
    return obj.state.value.replace(obj.state.globalRegExp, '').replace(/\D/g, '');
  } else {
    // * note Двойная регулярка. Сначала убираю шаблон с кодом. Потом убираю лишние символы (тире, скобки)
    return value.replace(obj.state.globalRegExp, '').replace(/\D/g, '');
  }
}

export function createNumberAfterCopy(purePhoneNumber: string, state: inputState): string {
  let croppedMaskTemplated = state.myTemplate.map(item => item); // Чтобы не было мутации
  const result: string[] = [];

  loop1: for (let index = 0; index < state.parsedMask.length; index++) {
    const item = state.parsedMask[index];

    if (purePhoneNumber.length !== 0) {
      if (item === '' || item === ' ') {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      } else if (!isNaN(Number(item))) {
        const resultNumber = purePhoneNumber.slice(0, item.length);
        const shiftedRegExpConfig = croppedMaskTemplated.shift(); //  regExpConfig for number group
        const re = new RegExp(shiftedRegExpConfig!.regExp, 'gi');
        const isValid = resultNumber.match(re);

        purePhoneNumber = purePhoneNumber.slice(item.length);

        /**
         * Если группа чисел, то Я проверяю каждое число и пушу их по очереди.
         * Если встречаю число, которое не подходит - прерываю общий цикл
         */
        loop2: for (let j = 0; j < resultNumber.length; j++) {
          const number = resultNumber[j];

          if (number.match(re) !== null) {
            result.push(number); // Убираю квадратные скобки
          } else {
            break loop1;
          }
        }
      } else {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      }
    }
  }

  return result.join('');
}

export function getResultPhone(phoneNumberWithTeplate: string, state: inputState): string {
  const { prefix, countryCodeTemplate } = state;
  return `${prefix}${
    countryCodeTemplate === '' ? countryCodeTemplate : countryCodeTemplate + ' '
  }${phoneNumberWithTeplate}`;
}
