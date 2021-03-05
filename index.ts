// TODO Глобальные
// todo метод destroy
// todo метод reinit();

const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[type="tel"]'
);

const config: Tconfig = {
  countryCode: 7,
  // countryCode: "1-784",
  mask: "([9]99) [999]-99-94",
  placeholder: true,
};

// ! GLOBAL
const re = new RegExp(`\\+${config.countryCode}`, "gi");
const codeTemplate = `+${config.countryCode}`;

// todo Мб переписать под класс?
inputs.forEach((input) => InitEasyMask(input, config));

function InitEasyMask(input: HTMLInputElement, config: Tconfig) {
  const state: inputState = {
    value: "", // ! тут хранится наше value
    myTemplate: searchRegExpInMask(config.mask),
  };

  if (typeof config.placeholder === "boolean" && config.placeholder) {
    input.placeholder = "+" + config.countryCode.toString();
  } else if (typeof config.placeholder === "string") {
    input.placeholder = config.placeholder;
  }
  // * note вешаем слушателей
  input.addEventListener("focus", inputEventFocus.bind(input));
  input.addEventListener("input", inputEventInput.bind(input));

  // * note управляем кареткой
  // https://learn.javascript.ru/selection-range
  function inputEventFocus(this: HTMLInputElement) {
    const value = this.value;

    if (value.length === 0) {
      this.value = codeTemplate;
      // нулевая задержка setTimeout нужна, чтобы это сработало после получения фокуса элементом формы
      const timeoutID = setTimeout(() => {
        this.selectionStart = this.selectionEnd = this.value.length; // Устанавливаем каретку на начало
        clearTimeout(timeoutID);
      }, 10);
    }
  }

  function inputEventInput(this: HTMLInputElement, event: Event) {
    if (event.target !== undefined && event.target !== null) {
      const { value } = event.target as HTMLInputElement;
      const { inputType } = event as InputEvent;
      const result = getPhoneWithTemplate(value, state); // Тут получаем результат, который нужно вводить в поле

      /**
       * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
       * * insertText(буквы, цифры)
       * * deleteContentBackward(удаление контента)
       * * insertFromPaste(вставка)
       * */
      switch (inputType) {
        case "insertText":
          this.value = state.value = result;
          this.selectionStart = this.selectionEnd = result.length; // Управляем кареткой

          break;
        case "deleteContentBackward":
          const diff = state.value.replace(value, ""); // Нахожу символ, который удален

          // note если удаляем 1 не более 1 символа
          if (diff.length === 1) {
            const isNan = isNaN(Number(diff)) || diff === " ";

            if (isNan) {
              this.value = removeChar(value);
            }
          }

          state.value = this.value; // обновляю state.value после каждого удаления

          break;
        case "insertFromPaste":
          /**
           * * при копировании пользователь может захватить кусок нашего шаблона (маски)
           * * чтобы это отсеять мы создаем регулярку, которая включает шаблон кода страны
           */
          const valueWithoutCodetemplate = value.replace(re, "");

          this.value = state.value = getPhoneWithTemplate(
            valueWithoutCodetemplate,
            state
          );

          break;
        default:
          break;
      }
    }
  }
}

/**
 * * парсинг входящего шаблона (маски)
 */
function parseTemplate(mask: string): string[] {
  // const regex = /(\d)|(\D+)|(\s+)/gim;
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

/**
 * Получаю готовый номер с маской
 * value - чистое, не форматированное
 */
function getPhoneWithTemplate(value: string, state: inputState): string {
  // * note Двойная регулярка. Сначала убираю шаблон с кодом. Потом убираю лишние символы (тире, скобки)
  const valueWithoutCodetemplate = value.replace(re, "").replace(/\D/g, "");
  const parsedArray = parseTemplate(config.mask);

  const result = createNumber(parsedArray, valueWithoutCodetemplate, state);
  return `${codeTemplate} ${result}`;
}

/**
 * * Создаем правильный номер с использованием шаблона
 * * Как работает шаблон - мы берем parsedArray (пример. [" (", "987", ") ", "654", "-", "32", "-", "10"])
 * * После этого мы проходим по его длине и формируем новый массив, такой же по длинне, заменяя числа
 * * своими числами. Потом мы соединим результат через join();
 */
function createNumber(
  parsedArray: string[],
  currentValue: string,
  state: inputState
): string {
  let croppedResult = currentValue;
  let croppedMaskTemplated = state.myTemplate.map((item) => item); // Чтобы не было мутации

  const result: string[] = [];

  for (let index = 0; index < parsedArray.length; index++) {
    const item = parsedArray[index];

    if (croppedResult.length !== 0) {
      if (item === "" || item === " ") {
        result.push(item.replace(/\[|\]/, "")); // Убираю квадратные скобки
      } else if (!isNaN(Number(item))) {
        const resultNumber = croppedResult.slice(0, item.length);
        const shiftedEl = croppedMaskTemplated.shift();
        const re = new RegExp(shiftedEl?.regExp, "gi");
        const isValid = resultNumber.match(re);

        console.log("re", re);
        console.log("resultNumber (то, что надо проверять)", resultNumber);
        console.log("isValid", isValid);

        if (isValid === null) {
          console.log("Это НУЛ");
          break;
        }

        croppedResult = croppedResult.slice(item.length);
        result.push(resultNumber);
      } else {
        result.push(item.replace(/\[|\]/, "")); // Убираю квадратные скобки
      }
    }
  }

  return result.join("");
}

// todo вынести функцию в utils
function removeChar(value: string): string {
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

function searchRegExpInMask(mask: string) {
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
      const singleNumbersArray = find.split("");

      singleNumbersArray.forEach((number) => {
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
      const resultWithoutDuplicates = numberInsideBrackets.replace(re, "");

      regExpConfig.regExp = `[${resultWithoutDuplicates}]{1,${length}}`;
    } else {
      regExpConfig.regExp = `[${numberInsideBrackets}]`;
    }
    return regExpConfig;
  }

  return result;
}
