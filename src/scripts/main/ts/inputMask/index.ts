import { removeChar, parseTemplate, searchRegExpInMask } from './utils';

// TODO Глобальные
// todo метод destroy
// todo метод reinit();
// todo валидацию
// todo NOTE - опционально - подсказку под цифры.

const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="tel"]');

const config: Tconfig = {
  countryCode: 7,
  // countryCode: "1-784",
  mask: '([9]99) [123]-99-92',
  placeholder: true,
};

// ! GLOBAL
const re = new RegExp(`\\+${config.countryCode}`, 'gi');
const codeTemplate = `+${config.countryCode}`;

// todo Мб переписать под класс?
inputs.forEach(input => InitEasyMask(input, config));

function InitEasyMask(input: HTMLInputElement, config: Tconfig) {
  const state: inputState = {
    value: '', // ! тут хранится наше value
    myTemplate: searchRegExpInMask(config.mask),
  };

  if (typeof config.placeholder === 'boolean' && config.placeholder) {
    input.placeholder = '+' + config.countryCode.toString();
  } else if (typeof config.placeholder === 'string') {
    input.placeholder = config.placeholder;
  }
  // * note вешаем слушателей
  input.addEventListener('focus', inputEventFocus.bind(input));
  input.addEventListener('input', inputEventInput.bind(input));

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
        case 'insertText':
          this.value = state.value = result;
          this.selectionStart = this.selectionEnd = result.length; // Управляем кареткой

          break;
        case 'deleteContentBackward':
          const diff = state.value.replace(value, ''); // Нахожу символ, который удален

          // note если удаляем 1 не более 1 символа
          if (diff.length === 1) {
            const isNan = isNaN(Number(diff)) || diff === ' ';

            if (isNan) {
              this.value = removeChar(value);
            }
          }

          state.value = this.value; // обновляю state.value после каждого удаления

          break;
        case 'insertFromPaste':
          /**
           * * при копировании пользователь может захватить кусок нашего шаблона (маски)
           * * чтобы это отсеять мы создаем регулярку, которая включает шаблон кода страны
           */
          const valueWithoutCodetemplate = value.replace(re, '');

          this.value = state.value = getPhoneWithTemplate(valueWithoutCodetemplate, state);

          break;
        default:
          break;
      }
    }
  }
}


/**
 * Получаю готовый номер с маской
 * value - чистое, не форматированное
 */
function getPhoneWithTemplate(value: string, state: inputState): string {
  // * note Двойная регулярка. Сначала убираю шаблон с кодом. Потом убираю лишние символы (тире, скобки)
  const valueWithoutCodetemplate = value.replace(re, '').replace(/\D/g, '');
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
function createNumber(parsedArray: string[], currentValue: string, state: inputState): string {
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

