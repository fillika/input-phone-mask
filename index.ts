const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[type="tel"]'
);

type Tconfig = {
  countryCode: number | string;
  mask: string;
};

const config: Tconfig = {
  countryCode: 7,
  // code: '1-784', // todo - настроить прием вот таких кодов
  mask: "(999)999-99-99",
};

inputs.forEach((input) => init(input, config));

function init(input: HTMLInputElement, config: Tconfig) {
  const mask = config.mask; // todo распарсить маску
  const codeTemplate = `+${config.countryCode} (`;
  const regexObj = {
    onlyNumbers: /\d+/gm,
    notNumbers: /\D+/gm,
  };

  const state = {
    value: "", // ! тут хранится наше value
  };

  parseTemplate(mask);

  // * note управляем кареткой
  // https://learn.javascript.ru/selection-range
  input.addEventListener("focus", () => {
    const value = input.value;

    if (value.length === 0) {
      input.value = codeTemplate;

      // нулевая задержка setTimeout нужна, чтобы это сработало после получения фокуса элементом формы
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = value.length; // Устанавливаем каретку на начало
      });
    }
  });

  input.addEventListener("input", (event: Event) => {
    if (event.target !== undefined && event.target !== null) {
      const { value } = event.target as HTMLInputElement;
      const { inputType } = event as InputEvent;
      const result = getPhoneWithTemplate(value); // Тут получаем результат, который нужно вводить в поле

      // console.log(value.slice(codeTemplate.length).replace(/\D/g, ""));

      console.log("value", value);

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

          break;
        case "insertFromPaste":
          /** NOTE:
           * * при копировании пользователь может захватить кусок нашего шаблона (маски)
           * * чтобы это отсеять мы создаем регулярку, которая включает шаблон кода страны
           */
          const re = new RegExp(`\\+${config.countryCode} \\(`, "gi");
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

function parseTemplate(mask: string): string[] {
  const regex = /(\d+)/gm;
  const result = [];
  let m;

  while ((m = regex.exec(mask)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    result.push(m[0]);
  }

  console.log(result);
  return result;
}

/** Получаю готовый номер с маской
 * value - чистое, не форматированное
 */
function getPhoneWithTemplate(value: string): string {
  const codeTemplate = `+${config.countryCode} (`;
  const valueOnlyNumbers = value.replace(/\D/g, ""); // Получаем числа
  const valueLength = valueOnlyNumbers.length;

  // * NOTE Тут через slice Я контролирую количество символов в строке
  const begin = valueOnlyNumbers.slice(0, 1);
  const firstThree = valueOnlyNumbers.slice(1, 4);
  const secondThree = valueOnlyNumbers.slice(4, 7);
  const firstTwo = valueOnlyNumbers.slice(7, 9);
  const secondTwo = valueOnlyNumbers.slice(9, 11);
  let result = ``;

  if (valueLength <= 1) {
    result = `${codeTemplate}${begin}`;
  } else if (valueLength >= 2 && valueLength <= 3) {
    result = `${codeTemplate}${firstThree}`;
  } else if (valueLength >= 4 && valueLength <= 7) {
    result = `${codeTemplate}${firstThree}) ${secondThree}`;
  } else if (valueLength >= 8 && valueLength <= 9) {
    result = `${codeTemplate}${firstThree}) ${secondThree}-${firstTwo}`;
  } else if (valueLength >= 10) {
    result = `${codeTemplate}${firstThree}) ${secondThree}-${firstTwo}-${secondTwo}`;
  }

  console.log("RESULT FROM getPhone", result);

  return result;
}
