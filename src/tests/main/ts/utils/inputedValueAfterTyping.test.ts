import inputedValueAfterTyping from '../../../../scripts/main/ts/inputMask/utils/inputedValue';

describe('inputedValueAfterTyping func with countryCode 45454', () => {
  const countryCode = 45454;
  const prefix = '+';
  const re = new RegExp(`${countryCode}`);
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
  });

  test('Value: "+454549"', () => {
    input.value = '+454549';
    input.selectionStart = input.selectionEnd = 7;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9');
  });

  test('Value: "+454154 (91"', () => {
    input.value = '+454154 (91';
    input.selectionStart = input.selectionEnd = 5;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('191');
  });


  test('Value: "+945454 (91"', () => {
    input.value = '+945454 (91';
    input.selectionStart = input.selectionEnd = 2;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('991');
  });

  test('Value: "+945454 (112"', () => {
    input.value = '+945454 (112';
    input.selectionStart = input.selectionEnd = 2;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });


  test('Value: "+45454 9(112"', () => {
    input.value = '+45454 9(112';
    input.selectionStart = input.selectionEnd = 9;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });

  test('Value: "+454549 (112"', () => {
    input.value = '+454549 (112';
    input.selectionStart = input.selectionEnd = 8;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });
});

describe('inputedValueAfterTyping func with countryCode +7', () => {
  const countryCode = 7;
  const prefix = '+';
  const re = new RegExp(`${countryCode}`);
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
  });

  test('Value: "+79"', () => {
    input.value = '+79';
    input.selectionStart = input.selectionEnd = 3;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9');
  });

  test('Value: "+73 (91"', () => {
    input.value = '+73 (91';
    input.selectionStart = input.selectionEnd = 3;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('391');
  });


  test('Value: "+97 (91"', () => {
    input.value = '+97 (91';
    input.selectionStart = input.selectionEnd = 2;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('991');
  });

  test('Value: "+97 (112"', () => {
    input.value = '+97 (112';
    input.selectionStart = input.selectionEnd = 2;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });


  test('Value: "+7 9(112"', () => {
    input.value = '+7 9(112';
    input.selectionStart = input.selectionEnd = 4;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });

  test('Value: "+79 (112"', () => {
    input.value = '+79 (112';
    input.selectionStart = input.selectionEnd = 3;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });
});

describe('inputedValueAfterTyping func with countryCode +1-312', () => {
  const countryCode = '1-312';
  const prefix = '+';
  const re = new RegExp(`${countryCode}`);
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
  });

  test('Value: "+1-312 9"', () => {
    input.value = '+1-312 9';
    input.selectionStart = input.selectionEnd = 8;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9');
  });

  test('Value: "+1-3123 (91"', () => {
    input.value = '+1-3123 (91';
    input.selectionStart = input.selectionEnd = 7;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('391');
  });


  test('Value: "+91-312 (91"', () => {
    input.value = '+91-312 (91';
    input.selectionStart = input.selectionEnd = 2;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('991');
  });

  test('Value: "+91-312 (112"', () => {
    input.value = '+91-312 (112';
    input.selectionStart = input.selectionEnd = 2;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });


  test('Value: "+1-312 9(112"', () => {
    input.value = '+1-312 9(112';
    input.selectionStart = input.selectionEnd = 8;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });

  test('Value: "+1-3129 (112"', () => {
    input.value = '+1-3129 (112';
    input.selectionStart = input.selectionEnd = 7;

    const result = inputedValueAfterTyping(input, countryCode, prefix, re);
    expect(result).toBe('9112');
  });
});
