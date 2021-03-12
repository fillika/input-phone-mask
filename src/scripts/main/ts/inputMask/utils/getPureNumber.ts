/**
 * * Принимаю грязный value. Фильтрую, возвращаю чистое
 * @param { string } Грязное value
 * @returns { string } Чистый номер
 */
export default function getPureNumber(value: string, re: RegExp): string {
  return value.replace(re, '').replace(/\D/g, '');
}
