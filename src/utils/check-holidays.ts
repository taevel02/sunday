import dayjs from 'dayjs'

// 국내 증시 휴장일 2023 (주말 제외)
export const holidays2023 = [
  '2023-01-23',
  '2023-01-24',
  '2023-03-01',
  '2023-05-01',
  '2023-05-05',
  '2023-05-29',
  '2023-06-06',
  '2023-08-15',
  '2023-09-28',
  '2023-09-29',
  '2023-10-03',
  '2023-10-09',
  '2023-12-25',
  '2023-12-29'
]

const checkHolidays = (date: dayjs.ConfigType): Boolean => {
  if (holidays2023.includes(dayjs(date).format('YYYY-MM-DD'))) {
    return true
  }
  return false
}

export default checkHolidays
