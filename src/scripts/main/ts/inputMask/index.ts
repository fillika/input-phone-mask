import Methods from './Methods';

// TODO Глобальные
// todo валидацию
// todo NOTE - опционально - подсказку под цифры.
class EasyPhoneMask extends Methods {
  constructor(input: HTMLInputElement, config?: Tconfig) {
    super(input, config);
    this.init();
  }

  static toGlobalWindow() {
    (<any>window).EasyPhoneMask = EasyPhoneMask;
  }

  public reinit(config?: Tconfig) {
    this.unmask();
    new EasyPhoneMask(this.input, config);
  }

  public unmask() {
    this.input.value = '';

    if (this.config.placeholder) {
      this.input.placeholder = '';
    }

    this.input.removeEventListener('focus', this.inputEventFocus, false);
    this.input.removeEventListener('input', this.inputEventInput, false);
  }

  public validation() {
    // todo написать метод валидации
  }
}

EasyPhoneMask.toGlobalWindow();

export default EasyPhoneMask;