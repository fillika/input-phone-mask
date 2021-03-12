import getPureNumber from './getPureNumber';

/**
 * * Получаю введенное значение. Это может быть 1 или несколько чисел (например при копировании)
 */

export default function inputedValueAfterTyping(obj: IRoot): string {
  const staticLength = (obj.config.countryCode! + obj.config.prefix!).length + 1; // +1 потому что позиция считается с нуля
  const position = obj.input.selectionEnd;
  const value = obj.input.value;
  const result = {
    inputedValue: '',
    restValue: '',
  };

  if (position) {
    result.inputedValue = value.slice(position - 1, position);
    result.restValue = value.slice(0, position - 1) + value.slice(position);

    // В зависимости от положения каретки резать и конкатенировать.
    switch (position < staticLength) {
      case true:
        return result.inputedValue + getPureNumber(result.restValue, obj);
      default:
        return getPureNumber(value, obj);
    }
  } else {
    return 'Position is NULL';
  }
}
