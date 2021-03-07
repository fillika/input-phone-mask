import { parseTemplate } from 'Scripts/main/ts/inputMask/utils';

describe('Test function parseTemplate', () => {
  test('Parse template from mask', () => {
    const result = parseTemplate('([9]99) [123]-99-91');
    expect(result).toEqual(['([', '9', ']', '9', '9', ') [', '123', ']-', '9', '9', '-', '9', '1']);
  });
});
