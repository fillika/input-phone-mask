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

  let template = '';

  new Promise((resolve) => {
    const resultArr = parseTemplate(mask);
    console.log(resultArr);

    resolve(resultArr);
  }).then((result) => {
    result.forEach((element) => {
      if (element === '+') {
        return;
      }

      if (element !== '9' && element.length === 1) {
        // Первый символ
      }

      console.log(element.length);
    });
  });

  input.addEventListener("input", (event: Event) => {
    if (event.target !== undefined && event.target !== null) {
      const value = (event.target as HTMLInputElement).value;

      // check only numbers
      const isNumber = Number(value);

      if (isNaN(isNumber)) {
        const valueWithOnlyNumbers = value.replace(/\D/g, "");
        input.value = valueWithOnlyNumbers;
        console.log(parseTemplate(valueWithOnlyNumbers));

        // input.value = `+7 ${valueWithPemplates}`;
      } else {
        console.log(parseTemplate(value));

        // input.value = `+7 ${value}`;
      }
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
