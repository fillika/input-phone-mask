import { parseTemplate } from 'Scripts/main/ts/inputMask/utils';

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
