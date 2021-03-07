import { searchRegExpInMask } from './utils';

export default class Root {
  state: inputState;
  input: HTMLInputElement;
  defaultConfig: Tconfig;

  constructor(input: HTMLInputElement, config?: Tconfig) {
    this.defaultConfig = {
      prefix: '',
      countryCode: '',
      mask: '(999) 999-99-99', // todo Проверки на ошибки в неправильной маске (текст, undefined и так далее)
      placeholder: false,
    };

    if (!config) {
      config = this.defaultConfig;
    }

    this.state = {
      value: '',
      config: config,
      myTemplate: searchRegExpInMask(config.mask),
      prefix: config.prefix || '',
      globalRegExp: new RegExp(`${config.countryCode}`, 'gi'),
      countryCodeTemplate: `${config.countryCode}`,
    };

    this.input = input;
  }
}
