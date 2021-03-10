import Root from './Root.js';
import { getPurePhoneNumber, getResultPhone, removeChar, createNumberAfterTyping, createNumberAfterCopy, } from './utils.js';
class Methods extends Root {
    constructor(input, config) {
        super(input, config);
        this.inputEventFocus = this.inputEventFocus.bind(this);
        this.inputEventInput = this.inputEventInput.bind(this);
    }
    init() {
        this.input.addEventListener('focus', this.inputEventFocus);
        this.input.addEventListener('input', this.inputEventInput);
        this.setPlaceholder();
    }
    inputEventFocus() {
        const value = this.input.value;
        if (value.length === 0) {
            this.input.value = this.state.prefix + this.state.countryCodeTemplate;
            const timeoutID = setTimeout(() => {
                this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
                clearTimeout(timeoutID);
            }, 10);
        }
    }
    inputEventInput(event) {
        if (event.target !== undefined && event.target !== null) {
            const { value } = event.target;
            const { inputType } = event;
            const purePhoneNumber = getPurePhoneNumber(value, this.state);
            switch (inputType) {
                case 'insertText':
                    const phoneNumberWithTeplate = createNumberAfterTyping(purePhoneNumber, this.state);
                    this.input.value = this.state.value = getResultPhone(phoneNumberWithTeplate, this.state);
                    this.input.selectionStart = this.input.selectionEnd = getResultPhone(phoneNumberWithTeplate, this.state).length;
                    break;
                case 'deleteContentBackward':
                    const diff = this.state.value.replace(value, '');
                    if (diff.length === 1) {
                        const isNan = isNaN(Number(diff)) || diff === ' ';
                        if (isNan) {
                            this.input.value = removeChar(value);
                        }
                    }
                    this.state.value = this.input.value;
                    break;
                case 'insertFromPaste':
                    this.input.value = this.state.value = getResultPhone(createNumberAfterCopy(purePhoneNumber, this.state), this.state);
                    break;
                default:
                    break;
            }
        }
    }
    setPlaceholder() {
        if (typeof this.config.placeholder === 'boolean' && this.config.placeholder) {
            this.input.placeholder = this.state.prefix + this.config.countryCode.toString();
        }
        else if (typeof this.config.placeholder === 'string') {
            this.input.placeholder = this.config.placeholder;
        }
    }
}
export default Methods;
