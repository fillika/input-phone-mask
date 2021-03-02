const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[type="tel"]'
);

type Tconfig = {
  code: 7;
  mask: string;
};

const config: Tconfig = {
  code: 7,
  mask: "(999)999-99-99",
};

inputs.forEach((input) => init(input, config));

function init(input: HTMLInputElement, config: Tconfig) {
  const mask = config.mask; // todo распарсить маску
  const regexObj = {
    onlyNumbers: /\d+/gm,
    notNumbers: /\D+/gm,
  };
  const codeTemplate = `+${config.code}`;

  const state = {
    value: "", // ! тут хранится наше value
  };

  parseTemplate(mask);

  // * note управляем кареткой
  // https://learn.javascript.ru/selection-range
  input.addEventListener("focus", () => {
    const value = input.value;

    if (value.length === 0) {
      input.value = `+${config.code} (`;
    }
    // нулевая задержка setTimeout нужна, чтобы это сработало после получения фокуса элементом формы
    setTimeout(() => {
      // если начало и конец совпадают, курсор устанавливается на этом месте
      // input.selectionStart = input.selectionEnd = 4;
    });
  });

  input.addEventListener("input", (event: Event) => {
    if (event.target !== undefined && event.target !== null) {
      const { value } = event.target as HTMLInputElement;
      const { inputType } = event as InputEvent;
      const valueOnlyNumbers = value.replace(/\D/g, "");
      let result = ``;

      /**
       * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
       * todo Отслеживать событие. Например
       * * insertText(буквы, цифры)
       * * deleteContentBackward(удаление контента)
       * * insertFromPaste(вставка)
       * */

      // * NOTE Тут через slice Я контролирую количество символов в строке
      const begin = valueOnlyNumbers.slice(0, 1);
      const firstThree = valueOnlyNumbers.slice(1, 4);
      const secondThree = valueOnlyNumbers.slice(4, 7);
      const firstTwo = valueOnlyNumbers.slice(7, 9);
      const secondTwo = valueOnlyNumbers.slice(9, 11);

      switch (inputType) {
        case "insertText":
          // Печатаем
          const valueLength = valueOnlyNumbers.length;

          // todo вынести в отдельную функцию
          if (valueLength <= 1) {
            result = `${codeTemplate} (${begin}`;
          } else if (valueLength >= 2 && valueLength <= 3) {
            result = `${codeTemplate} (${firstThree}`;
          } else if (valueLength >= 4 && valueLength <= 7) {
            result = `${codeTemplate} (${firstThree}) ${secondThree}`;
          } else if (valueLength >= 8 && valueLength <= 9) {
            result = `${codeTemplate} (${firstThree}) ${secondThree}-${firstTwo}`;
          } else if (valueLength >= 10) {
            result = `${codeTemplate} (${firstThree}) ${secondThree}-${firstTwo}-${secondTwo}`;
          }

          input.value = state.value = result;
          input.selectionStart = input.selectionEnd = result.length; // Управляем кареткой
          break;
        case "deleteContentBackward":
          // Удаляем
          const diff = state.value.replace(input.value, ""); // Нахожу символ, который удален


          // todo ОБЩУЮ сделать проверку на число
          if (diff === " ") {
            // Удалили пробел
            input.value = input.value.slice(0, input.value.length - 1);
          }

          // todo ОБЩУЮ сделать проверку на число
          if (diff === ")" || diff === "(" || diff === "-") {
            // Удалил символ
            input.value = input.value.slice(0, input.value.length - 1);
          }

          state.value = input.value; // обновляю state.value после каждого удаления
          break;
        case "insertFromPaste":
          // вставляем копированное
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
