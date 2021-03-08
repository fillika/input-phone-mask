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
      // regExpConfig.regExp = `[${resultWithoutDuplicates}]+(?![0-9])`;
      regExpConfig.regExp = `^[${resultWithoutDuplicates}]+$`;
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
export function getPurePhoneNumber(value: string, state: inputState): string {
  // * note Двойная регулярка. Сначала убираю шаблон с кодом. Потом убираю лишние символы (тире, скобки)
  return value.replace(state.globalRegExp, '').replace(/\D/g, '');
}

/**
 * * Создаем правильный номер с использованием шаблона
 * * Как работает шаблон - мы берем parsedArray (пример. [" (", "987", ") ", "654", "-", "32", "-", "10"])
 * * После этого мы проходим по его длине и формируем новый массив, такой же по длинне, заменяя числа по одному
 * * своими числами. Потом мы соединим результат через join();
 */
export function createNumberAfterTyping(purePhoneNumber: string, state: inputState): string {
  const result: string[] = [];
  let croppedMaskTemplated = state.myTemplate.map(item => item); // Чтобы не было мутации

  for (let index = 0; index < state.parsedMask.length; index++) {
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

        if (isValid === null) {
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

export function getResultPhone(phoneNumberWithTeplate: string, state: inputState): string {
  const { prefix, countryCodeTemplate } = state;
  return `${prefix}${
    countryCodeTemplate === '' ? countryCodeTemplate : countryCodeTemplate + ' '
  }${phoneNumberWithTeplate}`;
}

// Копия функции, которую буду переделывать под функцию копирования
export function createNumberAfterCopy(parsedArray: string[], currentValue: string, state: inputState): string {
  let croppedResult = currentValue; // Строка из цифр
  let croppedMaskTemplated = state.myTemplate.map(item => item); // Чтобы не было мутации
  const result: string[] = [];

  for (let index = 0; index < parsedArray.length; index++) {
    const item = parsedArray[index];

    if (croppedResult.length !== 0) {
      if (item === '' || item === ' ') {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      } else if (!isNaN(Number(item))) {
        /**
         * todo FIX bug
         * Если у нас есть номер +7 (912) 1 и шаблон, по которому мы должны написать группу из 3 чисел (999) [123]-99-99
         * когда после 1 мы вставляем 3 числа, то (croppedResult) у нас равен 1856 (потому что все 9 по одной ушли, осталась 1 и 856 из буфера)
         * Далее наш resultNumber становится 185, потому что мы берем группу ([123]) и согласно её длине, вырезаем первые 3 числа.
         * Таким образом, шестерка пройдет дальше, хотя после единицы код не должен работать
         * * Делать отдельную функцию для вставки из буфера или делать проверку на число до "обрезания"??
         */
        const resultNumber = croppedResult.slice(0, item.length);
        const shiftedRegExpConfig = croppedMaskTemplated.shift(); //  regExpConfig for number group
        const re = new RegExp(shiftedRegExpConfig!.regExp, 'gi');
        const isValid = resultNumber.match(re);

        croppedResult = croppedResult.slice(item.length);

        if (isValid === null) {
          /**
           * Тут может прийти либо одно число, либо группа чисел при копировании
           * Если число одно и оно неверное, тогда Я просто обрезаю его
           * Если цифр несколько (например 910 825) и после 910 8 не должно быть, то Я прерываю
           * цикл через break
           */
          if (resultNumber.length > 1) {
            /**
             * Если у нас группа чисел (например 3 числа в диапазоне от 1-3), то мы должны в этой группе
             * понять, на каком месте стоит неверное число, чтобы пропустить цифры ДО него и не пропустить ПОСЛЕ
             * Каждое число мы сравниваем по регулярному выражению и когда совпадения нет - мы заканчиваем цикл
             */

            for (let j = 0; j < resultNumber.length; j++) {
              const number = resultNumber[j];
              const isValidNumberInGroup = number.match(re);

              if (isValidNumberInGroup !== null) {
                result.push(number);
              } else {
                break;
              }
            }
          } else {
            result.push(resultNumber.slice(0, resultNumber.length - 1));
          }
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
