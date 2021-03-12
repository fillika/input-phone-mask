import inputedValueAfterTyping from './inputedValue';
import validationNumber from './validationNumber';

/**
 * Получаем номер от клиента
 * Принимаем inout value - грязное
 * Задача - вернуть чистый номер
 */
export default function getNumber(obj: IRoot): string {
  /**
   * * Тут Я могу получить номер либо с префиксом, либо без, могу получить номер со скобкой или без
   * * цифра, которую ввел пользователь может быть внутри кода или снаружи
   * * ниже примеры для шаблона +45454 ([9]99) [999]
   * +454594, +45454 (915, +45454 (1991), +145454 (99)
   */
  const {
    input,
    config: { countryCode, prefix },
    state: { globalRegExp },
  } = obj;
  const inputedValue = inputedValueAfterTyping(input, countryCode, prefix, globalRegExp);
  const validatedNumber = validationNumber(inputedValue);

  return '';
}

function clearConsole() {
  console.clear();
}
