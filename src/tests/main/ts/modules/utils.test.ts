import {
  parseTemplate,
  searchRegExpInMask,
  getPurePhoneNumber,
  createNumberAfterTyping,
  createNumberAfterCopy,
} from '../../../../scripts/main/ts/inputMask/utils';

type Tconfig = {
  mask: string;
  countryCode?: number | string;
  prefix?: string;
  placeholder?: boolean | string;
};

type inputState = {
  value: string;
  config: Tconfig;
  myTemplate: regExpConfig[];
  prefix: string;
  globalRegExp: RegExp;
  countryCodeTemplate: string;
  parsedMask: string[]
};

type regExpConfig = {
  length: number;
  regExp: string;
};

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
});

describe('Test func createNumberAfterCopy', () => {
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
    const result = createNumberAfterCopy(value, state);

    expect(result).toBe('(910) ');
  });

  test('Test value 999222', () => {
    const value = '999222';
    const result = createNumberAfterCopy(value, state);

    expect(result).toBe('(999) 222');
  });

  test('Test value 851', () => {
    const value = '851';
    const result = createNumberAfterCopy(value, state);

    expect(result).toBe('(');
  });

  test('Test value 991141', () => {
    const value = '991141';
    const result = createNumberAfterCopy(value, state);

    expect(result).toBe('(991) 1');
  });
});

describe('Test func removeChar', () => {
  test.todo('Function removeChar');
});
