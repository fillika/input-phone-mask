/**
 * Принимаем чистый номер в виде строки, только то, что ввел пользователь.
 * возвращаем номер, обернутый в template
 */
function getResultTemplate(number: string): string {
  return `(${number})`;
}
