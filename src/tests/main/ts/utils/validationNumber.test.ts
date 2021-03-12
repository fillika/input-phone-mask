import validationNumber from '../../../../scripts/main/ts/inputMask/utils/validationNumber';
// import EasyPhoneMask from './../../../../scripts/main/ts/inputMask/index';

describe('Test func validationNumber', () => {
  describe('Test mask ([9]99) [999]-99-99', () => {
    const config = {
      mask: '([9]99) [999]-99-99',
      countryCode: 45454,
      prefix: '+',
      placeholder: false,
    };

    beforeEach(() => {
      const input = document.createElement('input');
      // const iMask = new EasyPhoneMask(input, config);
    });

    const regExpArr = [
      { length: 1, regExp: '[9]' },
      { length: 1, regExp: '(d)' },
      { length: 1, regExp: '(d)' },
      { length: 3, regExp: '^[9]+$' },
      { length: 1, regExp: '(d)' },
      { length: 1, regExp: '(d)' },
      { length: 1, regExp: '(d)' },
      { length: 1, regExp: '(d)' },
    ];

    // TODO тесты работают некорректно
    test('Value: 99', () => {
      const result = validationNumber('99', regExpArr);
      expect(result).toBe('99');
    });

    test('Value: 912', () => {
      const result = validationNumber('912', regExpArr);
      expect(result).toBe('912');
    });
  });
});
