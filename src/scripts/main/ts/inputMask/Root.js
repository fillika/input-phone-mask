import { searchRegExpInMask, parseTemplate } from './utils.js';
export default class Root {
    constructor(input, config) {
        this.defaultConfig = {
            prefix: '',
            countryCode: '',
            mask: '(999) 999-99-99',
            placeholder: false,
        };
        this.config = {
            mask: (config === null || config === void 0 ? void 0 : config.mask) || this.defaultConfig.mask,
            countryCode: (config === null || config === void 0 ? void 0 : config.countryCode) || this.defaultConfig.countryCode,
            placeholder: (config === null || config === void 0 ? void 0 : config.placeholder) || this.defaultConfig.placeholder,
            prefix: (config === null || config === void 0 ? void 0 : config.prefix) || this.defaultConfig.prefix,
        };
        this.state = {
            value: '',
            config: this.config,
            myTemplate: searchRegExpInMask(this.config.mask),
            prefix: this.config.prefix || '',
            globalRegExp: new RegExp(`${this.config.countryCode}`),
            countryCodeTemplate: `${this.config.countryCode}`,
            parsedMask: parseTemplate(this.config.mask),
        };
        this.input = input;
    }
}
