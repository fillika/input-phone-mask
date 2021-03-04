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
  mask: "(999) 999-99-99",
  placeholder: true,
};

// ! GLOBAL
const re = new RegExp(`\\+${config.countryCode}`, "gi");
const codeTemplate = `+${config.countryCode}`;

inputs.forEach((input) => Init(input, config));

function Init(input: HTMLInputElement, config: Tconfig) {
  const state = {
    value: "", // ! тут хранится наше value
  };

  if (typeof config.placeholder === 'boolean' && config.placeholder) {
    input.placeholder = '+' + config.countryCode.toString();
  } else if (typeof config.placeholder === 'string') {
    input.placeholder = config.placeholder;
  }

  // * note управляем кареткой
  // https://learn.javascript.ru/selection-range
  input.addEventListener("focus", () => {
    const value = input.value;

    if (value.length === 0) {
      input.value = codeTemplate;
      // todo разобраться с задержкой
      // нулевая задержка setTimeout нужна, чтобы это сработало после получения фокуса элементом формы
      const timeoutID = setTimeout(() => {
        input.selectionStart = input.selectionEnd = value.length; // Устанавливаем каретку на начало
        clearTimeout(timeoutID);
      });
    }
  });

  input.addEventListener("input", (event: Event) => {
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
          input.value = state.value = result;
          input.selectionStart = input.selectionEnd = result.length; // Управляем кареткой

          break;
        case "deleteContentBackward":
          const diff = state.value.replace(value, ""); // Нахожу символ, который удален

          // note если удаляем 1 не более 1 символа
          if (diff.length === 1) {
            const isNan = isNaN(Number(diff)) || diff === " ";

            if (isNan) {
              input.value = removeChar(value);
            }
          }

          state.value = input.value; // обновляю state.value после каждого удаления

          break;
        case "insertFromPaste":
          /**
           * * при копировании пользователь может захватить кусок нашего шаблона (маски)
           * * чтобы это отсеять мы создаем регулярку, которая включает шаблон кода страны
           */
          const valueWithoutCodetemplate = value.replace(re, "");

          input.value = state.value = getPhoneWithTemplate(
            valueWithoutCodetemplate
          );

          break;
        default:
          break;
      }
    }
  });
}

/**
 * * парсинг входящего шаблона (маски)
 */
function parseTemplate(mask: string): string[] {
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

  console.log(result.filter(Boolean));
  

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
