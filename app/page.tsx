import Link from "next/link"
import { dayInfo, getEvents } from "@/lib/source-api"

export default async function IndexPage() {
  const d = await getEvents(2023, 2)
  if (!d) {
    return <>loading...</>
  }
//   console.log("data", d)

  return (
    <section className="md:container p-2 flex flex-col justify-center items-center gap-6 pb-8 pt-6 md:py-10 py-4">
      <div className="flex w-full items-end justify-between">
        <Link
          href={`${d.months.previousDate.year}-${d.months.previousDate.month}`}
        >
          <div className="flex flex-col items-center justify-center text-xl text-muted-foreground hover:text-primary">
            <span>{d.months.previousDate.name}</span>
            <span>{d.months.previousDate.year}</span>
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center text-2xl font-bold ">
          <span>{d.months.selectedDate.name}</span>
          <span>{d.months.selectedDate.year}</span>
        </div>
        <Link href={`${d.months.nextDate.year}-${d.months.nextDate.month}`}>
          <div className="flex flex-col items-center justify-center text-xl text-muted-foreground hover:text-primary">
            <span>{d.months.nextDate.name}</span>
            <span>{d.months.nextDate.year}</span>
          </div>
        </Link>
      </div>

      <div className="mt-4 flex w-full flex-col rounded-xl bg-white/10 md:p-4 p-1">
        <div className="flex w-full space-x-1">
          {["Pts", "Sal", "Crs", "Prs", "Cum", "Cts", "Pzr"].map((v, i) => (
            <HeaderCell txt={v} key={i} />
          ))}
        </div>
        {d.weeks.map((week, index) => {
          return <WeekRow key={index} week={week} />
        })}
      </div>

      <div className="mt-2 flex w-full flex-col gap-1">
        {d.events.map((value, index) => {
          return (
            <div
              key={index}
              className={`flex w-full flex-col gap-1 border-l-8 bg-white/10 p-2 pl-4 text-white`}
              style={{ borderColor: value.dayColor }}
            >
              <p className="font-light text-slate-300">
                {getEventDates(new Date(value.starts), new Date(value.ends))}
              </p>
              <p className="font-semibold">{value.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function getEventDates(starts: Date, ends: Date) {
  try {
    starts.setHours(0, 0, 0, 0)
    ends.setHours(0, 0, 0, 0)
    if (starts.getTime() === ends.getTime()) {
      return getLocaleDate(starts)
    }
    return getLocaleDate(starts) + "-" + getLocaleDate(ends)
  } catch (error) {
    console.log("error on getEventDates", error, starts, ends)
  }
}

// '2 Aralık'
function getLocaleDate(ms: Date) {
  return ms.toLocaleDateString("tr-TR", {
    // year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  })
}

function WeekRow(props: { week: dayInfo[] }) {
  return (
    <div className="flex w-full justify-around">
      {props.week.map((day, index) => (
        <WeekCell
          key={index}
          {...day}
          //day={day.dayNumber} color={day.color}
        />
      ))}
    </div>
  )
}

function WeekCell(props: dayInfo) {
  return (
    <div className="flex md:h-16 h-10 w-full flex-col rounded-md">
      <div className="flex md:h-12 h-8 w-full flex-col items-center justify-center md:text-2xl text-md ">
        <span style={{ color: props.dayColor }}>
          {new Date(props.day ?? "")?.getDate()}
        </span>
      </div>
      <div className="flex md:h-4 h-2 w-full flex-row items-center justify-evenly">
        {props.info?.map((e, i) => {
          return (
            <div
              key={i}
              style={{ backgroundColor: e }}
              className="md:h-2 md:w-2 w-1 h-1 rounded-full"
            />
          )
        })}
      </div>
    </div>
  )
}

function HeaderCell(props: { txt: string }) {
  return (
    <div className="flex bg-muted rounded-lg md:h-12 h-8 w-full flex-col items-center justify-center md:text-2xl text-muted-foreground font-bold ">
      {props.txt}
    </div>
  )
}
