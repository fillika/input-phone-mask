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

export function searchRegExpInMask(mask: string) {
  // Ищу все, что подходит под [9] или [999]
  // const maskRegExp = mask.replace(/\D/gmi, "");
  const result = [];
  const regex = /\[\d+\]|\d+/gm;
  let m;

  while ((m = regex.exec(mask)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const [find] = m;

    const regExpSquareBrackets = find.match(/\[\d+\]/gm);

    // * Сначала ищу и заменяю все цифры в квадратных скобках на регулярные выражения
    if (regExpSquareBrackets !== null) {
      result.push(getNumbersInSquareBrackets(regExpSquareBrackets));
    } else {
      // * Тут работаю со всеми остальными числами
      const singleNumbersArray = find.split('');

      singleNumbersArray.forEach(number => {
        // * проверка на 9. Если number === 9 то это любое число
        const numberRegExp = Number(number) === 9 ? `(\\d)` : `[${number}]`;

        result.push({
          length: 1,
          regExp: numberRegExp,
        });
      });
    }
  }

  /** Функция создания regExp для цифр в квадратных скобках */
  function getNumbersInSquareBrackets(regExpSquareBrackets: RegExpMatchArray) {
    let [a] = regExpSquareBrackets; // Квадратная скобка с числами [9] или [99]
    const numberInsideBrackets = a.match(/\d+/gm)![0];
    const length = numberInsideBrackets.length;

    /**
     * Это конфиг, по которому Я буду проверять каждый символ. Содержит regExp и длину проверки
     * По длине Я буду в приходящем значении брать кол-во символов
     */
    const regExpConfig = {
      length: length,
      regExp: ``,
    };

    // * проверка на количество символов внутри скобок
    if (length >= 2) {
      /**
       * https://learn.javascript.ru/regexp-lookahead-lookbehind
       * https://overcoder.net/q/617891/regex-%D1%83%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C-%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D1%8F%D1%8E%D1%89%D0%B8%D0%B5%D1%81%D1%8F-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE%D0%BB%D1%8B-%D0%B8%D0%B7-%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B8-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-javascript
       * * проверка на одинаковые числа
       */
      const re = /(.)(?=.*\1)/gm; // Поиск повторяющихся чисел
      const resultWithoutDuplicates = numberInsideBrackets.replace(re, '');

      /**
       * [9]+(?![0-9])
       * [123]+(?![0-9])
       */
      regExpConfig.regExp = `[${resultWithoutDuplicates}]+(?![0-9])`;
    } else {
      regExpConfig.regExp = `[${numberInsideBrackets}]`;
    }
    return regExpConfig;
  }

  return result;
}

/**
 * Получаю готовый номер с маской
 * value - чистое, не форматированное
 */
export function getPhoneWithTemplate(value: string, state: inputState): string {
  // * note Двойная регулярка. Сначала убираю шаблон с кодом. Потом убираю лишние символы (тире, скобки)
  const { globalRegExp, config, prefix, countryCodeTemplate } = state;
  const valueWithoutCodetemplate = value.replace(globalRegExp, '').replace(/\D/g, '');
  const parsedArray = parseTemplate(config.mask);
  const result = createNumber(parsedArray, valueWithoutCodetemplate, state);

  return `${prefix}${countryCodeTemplate === '' ? countryCodeTemplate : countryCodeTemplate + ' '}${result}`;
}

/**
 * * Создаем правильный номер с использованием шаблона
 * * Как работает шаблон - мы берем parsedArray (пример. [" (", "987", ") ", "654", "-", "32", "-", "10"])
 * * После этого мы проходим по его длине и формируем новый массив, такой же по длинне, заменяя числа
 * * своими числами. Потом мы соединим результат через join();
 */
export function createNumber(parsedArray: string[], currentValue: string, state: inputState): string {
  let croppedResult = currentValue;
  let croppedMaskTemplated = state.myTemplate.map(item => item); // Чтобы не было мутации

  const result: string[] = [];

  for (let index = 0; index < parsedArray.length; index++) {
    const item = parsedArray[index];

    if (croppedResult.length !== 0) {
      if (item === '' || item === ' ') {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      } else if (!isNaN(Number(item))) {
        const resultNumber = croppedResult.slice(0, item.length);
        const shiftedRegExpConfig = croppedMaskTemplated.shift(); //  regExpConfig for number group
        const re = new RegExp(shiftedRegExpConfig!.regExp, 'gi');
        const isValid = resultNumber.match(re);

        croppedResult = croppedResult.slice(item.length);

        if (isValid === null) {
          /**
           * Тут Я обрезаю последнее число, если оно не соответствует шаблону.
           * Если это одна цифра - то Я вставд. пустую строку
           */
          result.push(resultNumber.slice(0, resultNumber.length - 1));
        } else {
          result.push(resultNumber);
        }
      } else {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      }
    }
  }

  return result.join('');
}
