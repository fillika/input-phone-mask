import { searchRegExpInMask } from './utils';

export default class Root {
  state: inputState;
  input: HTMLInputElement;
  defaultConfig: Tconfig;
  config: Tconfig;

  constructor(input: HTMLInputElement, config?: Tconfig) {
    this.defaultConfig = {
      prefix: '',
      countryCode: '',
      mask: '(999) 999-99-99', // todo Проверки на ошибки в неправильной маске (текст, undefined и так далее)
      placeholder: false,
    };

    this.config = {
      mask: config?.mask || this.defaultConfig.mask,
      countryCode: config?.countryCode || this.defaultConfig.countryCode,
      placeholder: config?.placeholder || this.defaultConfig.placeholder,
      prefix: config?.prefix || this.defaultConfig.prefix,
    }

    this.state = {
      value: '',
      config: this.config,
      myTemplate: searchRegExpInMask(this.config.mask),
      prefix: this.config.prefix || '',
      globalRegExp: new RegExp(`${this.config.countryCode}`, 'gi'),
      countryCodeTemplate: `${this.config.countryCode}`,
    };

    this.input = input;
  }
}
