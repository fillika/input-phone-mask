import createNumberAfterTyping from './createNumberAfterTyping';

/**
 * Принимаем чистый номер в виде строки, только то, что ввел пользователь.
 * возвращаем номер, обернутый в template
 */
export default function getResultTemplate(number: string, state: inputState): string {
  const { countryCodeTemplate, prefix } = state;
  const result = `${prefix}${countryCodeTemplate} ${createNumberAfterTyping(number, state)}`;
  return result;
}
