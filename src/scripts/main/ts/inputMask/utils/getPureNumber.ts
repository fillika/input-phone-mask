/**
 * * Принимаю грязный value. Фильтрую, возвращаю чистое
 * @param { string } Грязное value
 * @returns { string } Чистый номер
 */
export default function getPureNumber(value: string, obj: IRoot): string {
  return value.replace(obj.state.globalRegExp, '').replace(/\D/g, '');
}
