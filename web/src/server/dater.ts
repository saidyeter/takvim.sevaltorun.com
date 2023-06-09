const methods = {
    getMonthBoundaries,
    getMonths,
    getLocaleDate
}
export default methods

function getMonthBoundaries(year: number, month: number) {
    const date = new Date(year, month, 1)
    const weekDay = date.getDay()
    const startWeekDay = weekDay == 0 ? 7 : weekDay
    date.setMonth(date.getMonth() + 1)
    date.setDate(date.getDate() - 1)
    const monthLength = date.getDate()

    return {
        startWeekDay,
        monthLength
    }
}

function getMonths(year: number, monthIndex: number) {

    const date = new Date(year, monthIndex, 1)
    const selectedDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: monthNames[date.getMonth()] ?? ''
    }

    date.setMonth(date.getMonth() + 1)

    const nextDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: monthNames[date.getMonth()] ?? ''
    }

    date.setMonth(date.getMonth() - 2)
    const previousDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: monthNames[date.getMonth()] ?? ''
    }


    return {
        selectedDate,
        previousDate,
        nextDate
    }
}

const monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
]


function getLocaleDate(ms: Date) {
    return ms.toLocaleDateString("tr-TR", {
        // year: "numeric",
        month: "long",
        day: "numeric",
        // dateStyle:'long'
    });
}