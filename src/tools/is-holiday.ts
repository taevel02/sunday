type DateString = `${number}-${number}-${number}`
type Year = Map<DateString, string>

const y2024 = new Map([
  ['2024-01-01', '신정'],
  ['2024-02-09', '설날'],
  ['2024-02-12', '설날(대체휴일)'],
  ['2024-03-01', '삼일절'],
  ['2024-04-10', '제22대국회의원선거'],
  ['2024-05-01', '근로자의날'],
  ['2024-05-06', '어린이날(대체휴일)'],
  ['2024-05-15', '석가탄실일'],
  ['2024-06-06', '현충일'],
  ['2024-08-15', '광복절'],
  ['2024-09-16', '추석'],
  ['2024-09-17', '추석'],
  ['2024-09-18', '추석'],
  ['2024-10-03', '개천절'],
  ['2024-10-09', '한글날'],
  ['2024-12-25', '기독탄신일'],
  ['2024-12-31', '연말 휴장일']
]) satisfies Year

export const isHoliday = (date: Date): boolean | null | TypeError => {
  if (!(date instanceof Date)) return new TypeError('Invalid Date')

  const dateString = date
    .toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    .replace(/\. /g, '-')
    .replace(/.$/, '') as DateString

  const key = `y${dateString.substring(0, 4)}`
  const present = eval(key) as Year

  return present.has(dateString) ? true : false
}
