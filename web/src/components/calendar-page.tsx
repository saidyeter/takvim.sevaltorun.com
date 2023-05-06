import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

type CellProps = {
  dayNumber: number;
  color?: string;
};

const CalendarPage = (props: { year: number; monthIndex: number }) => {
  const [cal, setCal] = useState([] as CellProps[][]);

  const { data: months } = api.calendar.getRelatedMonths.useQuery({
    year: props.year,
    monthIndex: props.monthIndex,
  });
  const { data: monthlyEvents } = api.calendar.getMonthlyEvents.useQuery(
    {
      ...props,
    },
    {
      enabled: !!months,
    }
  );

  useEffect(() => {
    if (!monthlyEvents) {
      return;
    }
    const weeks: CellProps[][] = [];
    let week: CellProps[] = [];
    let dayNumber = 1;
    for (
      let i = 1;
      i < monthlyEvents.monthLength + monthlyEvents.startWeekDay;
      i++
    ) {
      if (i < monthlyEvents.startWeekDay) {
        week.push({
          dayNumber: -1,
        });
      } else {
        let color: string | undefined = undefined;
        const currentDayStarting = new Date(
          months?.selectedDate.year ?? 0,
          (months?.selectedDate.month ?? 0) - 1,
          dayNumber
        );
        const currentDayEnding = new Date(
          months?.selectedDate.year ?? 0,
          (months?.selectedDate.month ?? 0) - 1,
          dayNumber,
          23,
          59,
          59
        );
        // currentDay.setHours(10)
        const foundEvent = monthlyEvents.events.find(
          (e) => e.starts <= currentDayEnding && e.ends >= currentDayStarting
        );

        if (foundEvent) {
          color = pickColor(foundEvent.id);
        }
        week.push({
          dayNumber,
          color,
        });
        dayNumber++;
      }
      if (i > 0 && week.length % 7 == 0) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length % 7 != 0) {
        week.push({
          dayNumber: -1,
        });
      }
      weeks.push(week);
    }
    // console.log(weeks);
    setCal(weeks);
  }, [monthlyEvents, months]);

  return (
    <>
      <Head>
        {!!months ? (
          <>
            <title>
              Takvim | {months.selectedDate.monthName}{" "}
              {months.selectedDate.year}
            </title>
          </>
        ) : (
          <title>Takvim</title>
        )}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center p-4 md:w-[720px] md:p-0">
          {!!months && (
            <>
              <div className="flex w-full items-end justify-between">
                <Link
                  href={`${months.previousDate.year}-${months.previousDate.month}`}
                >
                  <div className="flex flex-col items-center justify-center text-xl text-slate-400 hover:text-slate-200">
                    <span>{months.previousDate.monthName}</span>
                    <span>{months.previousDate.year}</span>
                  </div>
                </Link>
                <div className="flex flex-col items-center justify-center text-2xl font-bold text-white">
                  <span>{months.selectedDate.monthName}</span>
                  <span>{months.selectedDate.year}</span>
                </div>
                <Link href={`${months.nextDate.year}-${months.nextDate.month}`}>
                  <div className="flex flex-col items-center justify-center text-xl text-slate-400 hover:text-slate-200">
                    <span>{months.nextDate.monthName}</span>
                    <span>{months.nextDate.year}</span>
                  </div>
                </Link>
              </div>
              {!!monthlyEvents && (
                <>
                  <div className="mt-4 flex w-full flex-col rounded-xl bg-white/10 p-4  text-white">
                    {cal.map((week, index) => {
                      return <WeekRow key={index} week={week} />;
                    })}
                  </div>

                  <div className="mt-2 flex w-full flex-col gap-1">
                    {monthlyEvents.events.map((value, index) => {
                      return (
                        <div
                          key={index}
                          className={`flex w-full flex-col gap-1 border-l-8 bg-white/10 p-2 pl-4 text-white`}
                          style={{ borderColor: pickColor(value.id) }}
                        >
                          <p className="font-light text-slate-300">
                            {getLocaleDate(value.starts)}-
                            {getLocaleDate(value.ends)}
                          </p>
                          <p className="font-semibold">{value.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

function WeekRow(props: { week: CellProps[] }) {
  return (
    <div className="flex w-full justify-around">
      {props.week.map((day, index) => (
        <WeekCell key={index} day={day.dayNumber} color={day.color} />
      ))}
    </div>
  );
}
function WeekCell(props: { day: number; color?: string }) {
  return (
    <>
      <div className="relative flex h-16 w-full flex-col items-center justify-center rounded-md  text-2xl hover:bg-white/10">
        {props.day === -1 ? (
          <></>
        ) : (
          <>
            <span>{props.day}</span>
            {props.color && (
              <>
                <div
                  style={{ backgroundColor: props.color }}
                  className="absolute bottom-1 left-auto right-auto h-2 w-2 rounded-full"
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

function getLocaleDate(ms: Date) {
  return ms.toLocaleDateString("tr-TR", {
    // year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}

// function isColor(strColor: string) {
//   const s = new Option().style;
//   s.color = strColor;
//   return s.color !== "";
// }

export default CalendarPage;

function pickColor(id: string) {
  const hash = Math.abs(hashCode(id));
  const colorIndex = hash % colors.length;
  //console.log(id, hash, colorIndex, colors[colorIndex]);

  return colors[colorIndex];
}

function hashCode(value: string) {
  let hash = 0,
    i,
    chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const colors = [
  "#A6D0DD",
  "#FF6969",
  "#FFD3B0",
  "#E8A0BF",
  "#BA90C6",
  "#C7E9B0",
  "#CCD5AE",
  "#FFB4B4",
  "#FFACAC",
  "#FFAACF",
  "#FFCEFE",
  "#F8CBA6",
  "#CDE990",
  "#8DCBE6",
  "#FD8A8A",
  "#BCEAD5",
  "#9ED5C5",
  "#BCCEF8",
  "#ABD9FF",
  "#FFABE1",
  "#B1D7B4",
  "#F7ECDE",
  "#B2C8DF",
  "#C4D7E0",
  "#C7D36F",
  "#E0DECA",
  "#CDC2AE",
  "#92B4EC",
];
