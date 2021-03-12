/**
 * Цель функции - получить чистый номер, провести валидацию и
 * вернуть все, что прошло валидацию
 */
export default function validationNumber(number: string, regExpArray: regExpConfig[]): string {
  /**
   * У меня есть чистый номер, который мне нужно проверить в шаблоне
   * Шаблон - это массив их объектов, у которых есть поле length и regExp
   * lengt - показывает кол-во цифр для будущего regexp
   * С помощью length Я "режу" число на группы и проверяю его в регулярке
   * Если у нас 4 группы с length 1 1 2 3, значит будущее число (пример 912 918 7) Я порежу на
   * 9 1 29 187
   */

  let copyNumber: string = JSON.parse(JSON.stringify(number));
  // let copyNumber: string = JSON.parse(JSON.stringify('9121'));
  let result = '';

  mainLoop: for (let index = 0; index < regExpArray.length; index++) {
    const element = regExpArray[index];
    const resultNumber = copyNumber.slice(0, element.length);
    let isValid;

    if (resultNumber) {
      if (resultNumber.length > 1) {
        secondLoop: for (let j = 0; j < resultNumber.length; j++) {
          isValid = resultNumber[j].match(element.regExp);

          if (isValid !== null) {
            result += resultNumber[j];
          } else {
            break mainLoop;
          }
        }

        copyNumber = copyNumber.slice(element.length);
      } else {
        isValid = resultNumber.match(element.regExp);
        copyNumber = copyNumber.slice(element.length);

        if (isValid !== null) {
          result += resultNumber;
        } else {
          break;
        }
      }
    } else {
      break;
    }
  }
  console.log(result);

  return result;
}
