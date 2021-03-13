import validationNumber from '../../../../scripts/main/ts/inputMask/utils/validationNumber';
import searchRegExpInMask from './../../../../scripts/main/ts/inputMask/utils/searchRegExpInMask';

describe('Test func validationNumber', () => {
  describe('Test mask ([9]99) [999]-99-99', () => {
    const config = {
      mask: '([9]99) [999]-99-99',
      countryCode: 45454,
      prefix: '+',
      placeholder: false,
    };

    const regExpArr = searchRegExpInMask(config.mask);

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
