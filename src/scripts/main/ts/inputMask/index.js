import Methods from './Methods';
class EasyPhoneMask extends Methods {
    constructor(input, config) {
        super(input, config);
        this.init();
    }
    static toGlobalWindow() {
        window.EasyPhoneMask = EasyPhoneMask;
    }
    reinit(config) {
        this.unmask();
        new EasyPhoneMask(this.input, config);
    }
    unmask() {
        this.input.value = '';
        if (this.state.config.placeholder) {
            this.input.placeholder = '';
        }
        this.input.removeEventListener('focus', this.inputEventFocus, false);
        this.input.removeEventListener('input', this.inputEventInput, false);
    }
    validation() {
    }
}
EasyPhoneMask.toGlobalWindow();
export default EasyPhoneMask;
