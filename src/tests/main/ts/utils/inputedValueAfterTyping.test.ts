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
