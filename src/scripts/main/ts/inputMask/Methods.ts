import Root from './Root';
import { getPurePhoneNumber, getResultPhone, removeChar, createNumberAfterTyping } from './utils';

/** * Тут класс с основными методами  */
class Methods extends Root {
  constructor(input: HTMLInputElement, config?: Tconfig) {
    super(input, config);

    this.inputEventFocus = this.inputEventFocus.bind(this);
    this.inputEventInput = this.inputEventInput.bind(this);
  }

  protected init() {
    this.input.addEventListener('focus', this.inputEventFocus);
    this.input.addEventListener('input', this.inputEventInput);
    this.setPlaceholder();
  }

  protected inputEventFocus(this: Methods) {
    const value = this.input.value;

    if (value.length === 0) {
      this.input.value = this.state.prefix + this.state.countryCodeTemplate;
      // нулевая задержка setTimeout нужна, чтобы это сработало после получения фокуса элементом формы
      const timeoutID = setTimeout(() => {
        this.input.selectionStart = this.input.selectionEnd = this.input.value.length; // Устанавливаем каретку на начало
        clearTimeout(timeoutID);
      }, 10);
    }
  }

  protected inputEventInput(this: Methods, event: Event) {
    if (event.target !== undefined && event.target !== null) {
      const { value } = event.target as HTMLInputElement;
      const { inputType } = event as InputEvent;
      const purePhoneNumber = getPurePhoneNumber(value, this.state); // Очищенный номер телефона, только цифры

      /**
       * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
       * * insertText(буквы, цифры)
       * * deleteContentBackward(удаление контента)
       * * insertFromPaste(вставка)
       * */
      switch (inputType) {
        case 'insertText':
          const phoneNumberWithTeplate = createNumberAfterTyping(purePhoneNumber, this.state);
          const result = getResultPhone(phoneNumberWithTeplate, this.state);

          this.input.value = this.state.value = result;
          this.input.selectionStart = this.input.selectionEnd = result.length; // Управляем кареткой

          break;
        case 'deleteContentBackward':
          const diff = this.state.value.replace(value, ''); // Нахожу символ, который удален

          // note если удаляем 1 не более 1 символа
          if (diff.length === 1) {
            const isNan = isNaN(Number(diff)) || diff === ' ';

            if (isNan) {
              this.input.value = removeChar(value);
            }
          }

          this.state.value = this.input.value; // обновляю state.value после каждого удаления

          break;
        case 'insertFromPaste':
          /**
           * * при копировании пользователь может захватить кусок нашего шаблона (маски)
           * * чтобы это отсеять мы создаем регулярку, которая включает шаблон кода страны
           */
          const valueWithoutCodetemplate = value.replace(this.state.globalRegExp, '');

          // TODO Переписать функцию со своей логикой
          this.input.value = this.state.value = getPurePhoneNumber(valueWithoutCodetemplate, this.state);

          break;
        default:
          break;
      }
    }
  }

  protected setPlaceholder() {
    if (typeof this.config.placeholder === 'boolean' && this.config.placeholder) {
      this.input.placeholder = this.state.prefix + this.config.countryCode.toString();
    } else if (typeof this.config.placeholder === 'string') {
      this.input.placeholder = this.config.placeholder;
    }
  }
}

export default Methods;
