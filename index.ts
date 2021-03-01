const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
  'input[type="tel"]'
);

type Tconfig = {
  mask: string;
};

const config: Tconfig = {
  mask: "+7(999)999-99-99",
};

inputs.forEach((input) => init(input, config));

function init(input: HTMLInputElement, config: Tconfig) {
  const mask = config.mask;
  const regexObj = {
    onlyNumbers: /\d+/gm,
    notNumbers: /\D+/gm,
  };

  let template = "";

  new Promise((resolve) => {
    const resultArr = parseTemplate(mask);
    console.log(resultArr);

    resolve(resultArr);
  }).then((result) => {
    result.forEach((element) => {
      if (element === "+") {
        return;
      }

      if (element !== "9" && element.length === 1) {
        // Первый символ
      }
    });
  });

  input.addEventListener("input", (event: Event) => {
    if (event.target !== undefined && event.target !== null) {
      const value = (event.target as HTMLInputElement).value;
      const { inputType } = event as InputEvent;
      const valueWithOnlyNumbers = value.replace(/\D/g, "");

      /**
       * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
       * todo Отслеживать событие. Например
       * * insertText(буквы, цифры)
       * * deleteContentBackward(удаление контента)
       * * insertFromPaste(вставка)
       * */

      // * NOTE Тут через slice Я контролирую количество символов в строке
      const countryCode = valueWithOnlyNumbers.slice(0, 1);
      const firstThree = valueWithOnlyNumbers.slice(1, 4);
      const secondThree = valueWithOnlyNumbers.slice(4, 7);
      const firstTwo = valueWithOnlyNumbers.slice(7, 9);
      const secondTwo = valueWithOnlyNumbers.slice(9, 11);
      let template = "";

      switch (inputType) {
        case "insertText":
          // Печатаем
          break;
        case "deleteContentBackward":
          // Удаляем
          break;
        case "insertFromPaste":
          // вставляем копированное
          break;
        default:
          break;
      }


      if (valueWithOnlyNumbers.length <= 1) {
        template += "+7 (";
      } else if (
        valueWithOnlyNumbers.length >= 2 &&
        valueWithOnlyNumbers.length <= 4
      ) {
        template = `+${countryCode} (${firstThree}`;
      }

      input.value = template;
    }
  });
}

function parseTemplate(mask: string): string[] {
  const regex = /(\d+)|(\D)/gm;
  const result = [];
  let m;

  while ((m = regex.exec(mask)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    result.push(m[0]);
  }

  return result;
}