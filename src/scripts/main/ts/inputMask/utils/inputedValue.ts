/**
 * * Получаю введенное значение. Это может быть 1 или несколько чисел (например при копировании)
 */
export default function inputedValueAfterTyping(obj: IRoot): string {
  const position = obj.input.selectionEnd;
  const value = obj.input.value;

  if (position) {
    return value.slice(position - 1, position);
  } else {
    return 'Position NULL';
  }
}
