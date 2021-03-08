import {
  parseTemplate,
  searchRegExpInMask,
  getPurePhoneNumber,
  createNumberAfterTyping,
} from 'Scripts/main/ts/inputMask/utils';

describe('Test function parseTemplate', () => {
  test('Test mask ([9]99) [123]-99-91', () => {
    const result = parseTemplate('([9]99) [123]-99-91');
    expect(result).toEqual(['([', '9', ']', '9', '9', ') [', '123', ']-', '9', '9', '-', '9', '1']);
  });

  test('Test mask (999) 999-99-99', () => {
    const result = parseTemplate('(999) 999-99-99');
    expect(result).toEqual(['(', '9', '9', '9', ') ', '9', '9', '9', '-', '9', '9', '-', '9', '9']);
  });

  test('Test mask (999)9999999', () => {
    const result = parseTemplate('(999)9999999');
    expect(result).toEqual(['(', '9', '9', '9', ')', '9', '9', '9', '9', '9', '9', '9']);
  });

  test('Test mask 9999992145', () => {
    const result = parseTemplate('9999992145');
    expect(result).toEqual(['9', '9', '9', '9', '9', '9', '2', '1', '4', '5']);
  });
});

describe('Test func searchRegExpInMask', () => {
  test('Test mask ([9]99) [123]-99-91', () => {
    const result = searchRegExpInMask('([9]99) [123]-99-91');
    expect(result).toEqual([
      { length: 1, regExp: '[9]' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 3, regExp: '^[123]+$' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '[1]' },
    ]);
  });

  test('Test mask (999) [111]-99-91', () => {
    const result = searchRegExpInMask('(999) [111]-99-91');
    expect(result).toEqual([
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 3, regExp: '^[1]+$' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '[1]' },
    ]);
  });

  test('Test mask 999111-99-91', () => {
    const result = searchRegExpInMask('999111-99-91');
    expect(result).toEqual([
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '[1]' },
      { length: 1, regExp: '[1]' },
      { length: 1, regExp: '[1]' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '[1]' },
    ]);
  });

  test('Test mask 999[12]88', () => {
    const result = searchRegExpInMask('999[12]88');

    expect(result).toEqual([
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 1, regExp: '(\\d)' },
      { length: 2, regExp: '^[12]+$' },
      { length: 1, regExp: '[8]' },
      { length: 1, regExp: '[8]' },
    ]);
  });
});

describe('Test func getPurePhoneNumber', () => {
  const config = {
    prefix: '+',
    countryCode: '7',
    mask: '([9]99) [123]-99-99',
    placeholder: false,
  };

  const state: inputState = {
    value: '',
    config: config,
    myTemplate: searchRegExpInMask(config.mask),
    prefix: config.prefix || '',
    globalRegExp: new RegExp(`${config.countryCode}`, 'gi'),
    countryCodeTemplate: `${config.countryCode}`,
    parsedMask: [''],
  };

  test('Test value (910) 1', () => {
    const value = '(910) 1';
    const result = getPurePhoneNumber(value, state);

    expect(result).toBe('9101');
  });

  test('Test value (910) 6', () => {
    const value = '(910) 6';
    const result = getPurePhoneNumber(value, state);

    expect(result).toBe('9106');
  });

  test('Test value +7 (815', () => {
    const value = '+7 (815';
    const result = getPurePhoneNumber(value, state);

    expect(result).toBe('815');
    expect(result).not.toBe('+7 (15');
  });

  test('Test value 99142', () => {
    const value = '99142';
    const result = getPurePhoneNumber(value, state);

    expect(result).toBe('99142');
  });
});

describe('Test func createNumberAfterTyping', () => {
  const config = {
    prefix: '+',
    countryCode: '7',
    mask: '([9]99) [123]-99-99',
    placeholder: false,
  };

  const state: inputState = {
    value: '',
    config: config,
    myTemplate: searchRegExpInMask(config.mask),
    prefix: config.prefix || '',
    globalRegExp: new RegExp(`${config.countryCode}`, 'gi'),
    countryCodeTemplate: `${config.countryCode}`,
    parsedMask: ['([', '9', ']', '9', '9', ') [', '123', ']-', '9', '9', '-', '9', '9'],
  };

  test('Test value 9108', () => {
    const value = '9108';
    const result = createNumberAfterTyping(value, state);

    expect(result).toBe('(910) ');
  });

  test('Test value 9107', () => {
    const value = '9107';
    const result = createNumberAfterTyping(value, state);

    expect(result).toBe('(910) ');
  });

  test('Test value 8', () => {
    const value = '8';
    const result = createNumberAfterTyping(value, state);

    expect(result).toBe('(');
  });

  test('Test value ret', () => {
    const value = 'ret';
    const result = createNumberAfterTyping(value, state);

    expect(result).toBe('');
  });
});
