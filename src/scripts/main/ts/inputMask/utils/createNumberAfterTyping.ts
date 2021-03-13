/**
 * * Создаем правильный номер с использованием шаблона
 * * Как работает шаблон - мы берем parsedArray (пример. [" (", "987", ") ", "654", "-", "32", "-", "10"])
 * * После этого мы проходим по его длине и формируем новый массив, такой же по длинне, заменяя числа по одному
 * * своими числами. Потом мы соединим результат через join();
 */
export default function createNumberAfterTyping(purePhoneNumber: string, state: inputState): string {
  const result: string[] = [];

  // Если на раннем этапе телефона нет и тут вводится ересь (буквы или еще что), то сразу return
  if (purePhoneNumber.length === 0) {
    return result.join('');
  }

  let croppedMaskTemplated = state.myTemplate.map(item => item); // Чтобы не было мутации

  for (let index = 0; index < state.parsedMask.length; index++) {
    const item = state.parsedMask[index];

    if (purePhoneNumber.length !== 0) {
      if (item === '' || item === ' ') {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      } else if (!isNaN(Number(item))) {
        const resultNumber = purePhoneNumber.slice(0, item.length);
        const shiftedRegExpConfig = croppedMaskTemplated.shift(); //  regExpConfig for number group
        const re = new RegExp(shiftedRegExpConfig!.regExp, 'gi');
        const isValid = resultNumber.match(re);

        purePhoneNumber = purePhoneNumber.slice(item.length);

        if (isValid === null) {
          result.push(resultNumber.slice(0, resultNumber.length - 1));
        } else {
          result.push(resultNumber);
        }
      } else {
        result.push(item.replace(/\[|\]/, '')); // Убираю квадратные скобки
      }
    }
  }

  return result.join('');
}
