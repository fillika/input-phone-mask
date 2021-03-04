// TODO Глобальные
// todo метод destroy
// todo метод reinit();

const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[type="tel"]'
);

type Tconfig = {
  countryCode: number | string;
  mask: string;
  placeholder?: boolean | string;
};

const config: Tconfig = {
  // countryCode: 7,
  countryCode: "1-784",
  mask: "([9]99) 4 44 44",
  placeholder: true,
};

// ! GLOBAL
const re = new RegExp(`\\+${config.countryCode}`, "gi");
const codeTemplate = `+${config.countryCode}`;

// todo Мб переписать под класс?
inputs.forEach((input) => InitEasyMask(input, config));

function InitEasyMask(input: HTMLInputElement, config: Tconfig) {
  const state = {
    value: "", // ! тут хранится наше value
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
      const result = getPhoneWithTemplate(value); // Тут получаем результат, который нужно вводить в поле

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
            valueWithoutCodetemplate
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
  // todo понять, прислали регулярку или нет

  const regExpNumbersGroup = /(\[\d+\]\+)|(\[\d+\])/gm; // Целое число, например [999]+ или [99]
  /**
   * * Тут Я могу 9 принять как ЛЮБОЕ число.
   * todo Можно заменять 9 на \d. Например [789]+ ==> [78\d]+. Из этого мне надо формировать регулярку, по которой проверять результат
   */

  const regex = /(\d+)|(\D+)|(\s+)/gim;
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
function getPhoneWithTemplate(value: string): string {
  // * note Двойная регулярка. Сначала убираю шаблон с кодом. Потом убираю лишние символы (тире, скобки)
  const valueWithoutCodetemplate = value.replace(re, "").replace(/\D/g, "");
  const parsedArray = parseTemplate(config.mask);

  const result = createNumber(parsedArray, valueWithoutCodetemplate);
  return `${codeTemplate} ${result}`;
}

/**
 * * Создаем правильный номер с использованием шаблона
 * * Как работает шаблон - мы берем parsedArray (пример. [" (", "987", ") ", "654", "-", "32", "-", "10"])
 * * После этого мы проходим по его длине и формируем новый массив, такой же по длинне, заменяя числа
 * * своими числами. Потом мы соединим результат через join();
 */
function createNumber(parsedArray: string[], currentValue: string): string {
  let croppedResult = currentValue;

  return parsedArray
    .map((item) => {
      // Проверка на длину. Если длина 0 - то мы не печатаем следующие символы
      // Например не появятся лишние тире, скобки или еще что-то
      if (croppedResult.length !== 0) {
        if (item === "" || item === " ") {
          return item;
        } else if (!isNaN(Number(item))) {
          const result = croppedResult.slice(0, item.length);
          croppedResult = croppedResult.slice(item.length);
          return result;
        } else {
          return item;
        }
      }
    })
    .join("");
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

// todo функции поиска регулярки
function searchRegExpInMask() {
  // Ищу все, что подходит под [9] или [999]
  const mask = "([9]99) [999]-99-99";
  const maskRegExp = mask.replace(/\D/gmi, "");

  console.log(maskRegExp);
}

searchRegExpInMask();