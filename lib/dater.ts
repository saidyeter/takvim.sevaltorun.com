
/**
 * 
 * @param year year
 * @param month first month is 1 last is 12
 * @returns start week day and month length
 */
function getMonthLengthAndStartWeekDay(year: number, month: number) {
  let date = new Date(year, month - 1, 1, 0, 0, 0)
  // date.setDate(date.getDate() + 1)

  let startWeekDay = date.getDay()
  // console.log('getMonthLengthAndStartWeekDay', date.toLocaleString(), startWeekDay);
  if (startWeekDay == 0) {
    startWeekDay = 7
  }

  date.setMonth(month)
  date.setDate(0)
  const monthLength = date.getDate()
  // console.log('getMonthLengthAndStartWeekDay', date.toLocaleString(), startWeekDay, monthLength);


  return {
    startWeekDay,
    monthLength
  }
}
const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
function getMonth(month: number) {
  if (month > months.length || month < 1) {
    return ''
  }
  return months[month - 1]
}

function createMonthInfo(year: number, month: number) {
  return {
    month: month,
    year: year,
    name: getMonth(month)
  }
}

function getMonths(year: number, month: number) {
  const selectedDate = createMonthInfo(year, month)

  let nmMonth = month + 1
  let nmYear = year
  if (nmMonth > 12) {
    nmMonth = 1
    nmYear = nmYear + 1
  }

  const nextDate = createMonthInfo(nmYear, nmMonth)

  let pmMonth = month - 1
  let pmYear = year
  if (pmMonth < 1) {
    pmMonth = 12
    pmYear = pmYear - 1
  }
  const previousDate = createMonthInfo(pmYear, pmMonth)

  return { selectedDate, previousDate, nextDate }
}

function getStartDayAndEndDayForMonth(year: number, month: number) {
  const { startWeekDay, monthLength } = getMonthLengthAndStartWeekDay(year, month)
  // console.log('getStartDayAndEndDayForMonth', year, month, startWeekDay, monthLength);

  const oneWeek = 7
  const sixWeeks = 6 * oneWeek
  const daysForOhterMonths = sixWeeks - monthLength
  // console.log('daysForOhterMonths', daysForOhterMonths);

  const daysForPrevMonth = startWeekDay - 1
  // console.log('daysForPrevMonth', daysForPrevMonth);
  const daysForNextMonth = daysForOhterMonths - daysForPrevMonth
  // console.log('daysForNextMonth', daysForNextMonth);


  const startDay = new Date(year, month - 1, 1)
  const endDay = new Date(year, month - 1, monthLength)


  if (startWeekDay == 1 && monthLength == 28) {
    startDay.setDate(startDay.getDate() - oneWeek)
    endDay.setDate(endDay.getDate() + oneWeek)
  }
  else {
    startDay.setDate(startDay.getDate() - daysForPrevMonth)
    endDay.setDate(endDay.getDate() + daysForNextMonth)
  }

  return {
    startDay,
    endDay
  }
}

export {
  getMonths, getStartDayAndEndDayForMonth
}

