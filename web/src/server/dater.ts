export default {
    getMonthBoundaries,
    getMonths
}

//new Date(2023, 1, 1)
//new Date(2023, 12, 1)

function getMonthBoundaries(year: number, month: number) {
    const date = new Date(year, month-1, 1)
    const startWeekDay = date.getDay()
    date.setMonth(date.getMonth() + 1)
    date.setDate(date.getDate() - 1)
    const monthLength = date.getDate()

    return {
        startWeekDay,
        monthLength
    }
}

function getMonths() {
    const date = new Date()
    const current = date.getMonth()+1
    const currentName= monthNames[current-1]

    date.setMonth(current)
    const next = date.getMonth()+1
    const nextName= monthNames[next-1]

    date.setMonth(current-2)
    const previous = date.getMonth()+1
    const previousName= monthNames[previous-1]

    return {
        current,
        currentName,
        previous,
        previousName,
        next,
        nextName
    }
}

const monthNames=[
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