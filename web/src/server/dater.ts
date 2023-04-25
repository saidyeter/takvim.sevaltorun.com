export default {
    getMonthBoundaries,
    getMonths
}

//new Date(2023, 1, 1)
//new Date(2023, 12, 1)

function getMonthBoundaries(year: number, month: number) {
    const date = new Date(year, month - 1, 1)
    const startWeekDay = date.getDay()
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
        monthName: monthNames[date.getMonth()]
    }

    date.setMonth(date.getMonth() + 1)

    const nextDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: monthNames[date.getMonth()]
    }

    date.setMonth(date.getMonth() - 2)
    const previousDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        monthName: monthNames[date.getMonth()]
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