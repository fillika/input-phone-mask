import { removeChar, parseTemplate, getPhoneWithTemplate } from './utils';
import Root from './Root';

// TODO Глобальные
// todo метод destroy
// todo метод reinit();
// todo валидацию
// todo NOTE - опционально - подсказку под цифры.

const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="tel"]');

const config: Tconfig = {
  prefix: '+',
  countryCode: '7 ',
  mask: '([9]99) [123]-99-91',
  placeholder: true,
};

class EasyPhoneMask extends Root {
  constructor(input: HTMLInputElement, config?: Tconfig) {
    super(input, config);
    this.init();
  }

  static toGlobalWindow() {
    (<any>window).EasyPhoneMask = EasyPhoneMask;
  }

  private init() {
    // * note вешаем слушателей
    this.input.addEventListener('focus', this.inputEventFocus.bind(this));
    this.input.addEventListener('input', this.inputEventInput.bind(this));
    this.setPlaceholder();
  }

  public reinit() {
    console.log('Reinit');
  }

  public destroy() {
    console.log('Destroy');
    this.input.removeEventListener('focus', this.inputEventFocus.bind(this));
    this.input.removeEventListener('input', this.inputEventInput.bind(this));
  }

  private setPlaceholder() {
    if (typeof this.state.config.placeholder === 'boolean' && this.state.config.placeholder) {
      this.input.placeholder = this.state.prefix + this.state.config.countryCode.toString();
    } else if (typeof this.state.config.placeholder === 'string') {
      this.input.placeholder = this.state.config.placeholder;
    }
  }

  private inputEventFocus(this: EasyPhoneMask) {
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

  private inputEventInput(this: EasyPhoneMask, event: Event) {
    if (event.target !== undefined && event.target !== null) {
      const { value } = event.target as HTMLInputElement;
      const { inputType } = event as InputEvent;
      const result = getPhoneWithTemplate(value, this.state); // Тут получаем результат, который нужно вводить в поле

      /**
       * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
       * * insertText(буквы, цифры)
       * * deleteContentBackward(удаление контента)
       * * insertFromPaste(вставка)
       * */
      switch (inputType) {
        case 'insertText':
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

          this.input.value = this.state.value = getPhoneWithTemplate(valueWithoutCodetemplate, this.state);

          break;
        default:
          break;
      }
    }
  }
}

EasyPhoneMask.toGlobalWindow();
inputs.forEach(input => new EasyPhoneMask(input, config));
