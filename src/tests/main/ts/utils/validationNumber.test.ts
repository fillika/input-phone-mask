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

    test('Value: 815', () => {
      const result = validationNumber('815', regExpArr);
      expect(result).toBe('');
    });

    test('Value: 999154', () => {
      const result = validationNumber('999154', regExpArr);
      expect(result).toBe('999');
    });

    test('Value: 987654321', () => {
      const result = validationNumber('987654321', regExpArr);
      expect(result).toBe('987');
    });
  });

  describe('Test mask (987) 654-99-91', () => {
    const config = {
      mask: '(987) 654-99-91',
      countryCode: 45454,
      prefix: '+',
      placeholder: false,
    };

    const regExpArr = searchRegExpInMask(config.mask);

    test('Value: 99', () => {
      const result = validationNumber('99', regExpArr);
      expect(result).toBe('9');
    });

    test('Value: 912', () => {
      const result = validationNumber('912', regExpArr);
      expect(result).toBe('9');
    });

    test('Value: 815', () => {
      const result = validationNumber('815', regExpArr);
      expect(result).toBe('8');
    });

    test('Value: 999154', () => {
      const result = validationNumber('999154', regExpArr);
      expect(result).toBe('9');
    });

    test('Value: 987654321', () => {
      const result = validationNumber('987654321', regExpArr);
      expect(result).toBe('987654321');
    });
  });

  describe('Test mask 999 8911616', () => {
    const config = {
      mask: '999 8911616',
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

    test('Value: 815', () => {
      const result = validationNumber('815', regExpArr);
      expect(result).toBe('815');
    });

    test('Value: 999154', () => {
      const result = validationNumber('999154', regExpArr);
      expect(result).toBe('999');
    });

    test('Value: 987654321', () => {
      const result = validationNumber('987654321', regExpArr);
      expect(result).toBe('987');
    });
  });
});
