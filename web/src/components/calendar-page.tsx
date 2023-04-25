import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const CalendarPage = (props: { year: number; monthIndex: number }) => {
  const [cal, setCal] = useState([] as number[][]);

  const { data: months } = api.calendar.getRelatedMonths.useQuery({
    year: props.year,
    monthIndex: props.monthIndex,
  });
  const { data: monthlyEvents } = api.calendar.getMonthlyEvents.useQuery(
    {
      ...props
    },
    {
      enabled: !!months,
    }
  );

  useEffect(() => {
    if (!monthlyEvents) {
      return;
    }
    const weeks: number[][] = [];
    let week: number[] = [];
    let counter = 1;
    for (
      let i = 1;
      i < monthlyEvents.monthLength + monthlyEvents.startWeekDay;
      i++
    ) {
      if (i < monthlyEvents.startWeekDay) {
        week.push(-1);
      } else {
        week.push(counter);
        counter++;
      }
      if (i > 0 && week.length % 7 == 0) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length % 7 != 0) {
        week.push(-1);
      }
      weeks.push(week);
    }
    // console.log(weeks);
    setCal(weeks);
  }, [monthlyEvents]);

  return (
    <>
      <Head>
        {!!months ? (
          <title>
            Takvim | {months.selectedDate.monthName} {months.selectedDate.year}
          </title>
        ) : (
          <title>Takvim</title>
        )}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex w-full flex-col items-start justify-center p-4 md:w-[720px] md:p-0">
          {!!months && (
            <>
              <div className="flex w-full justify-between">
                <Link
                  href={`${months.previousDate.year}-${months.previousDate.month}`}
                >
                  <h3 className="text-2xl font-bold text-white">
                    &lt; {months.previousDate.monthName}{" "}
                    {months.previousDate.year}
                  </h3>
                </Link>
                <h3 className="text-2xl font-bold text-white">
                  {months.selectedDate.monthName} {months.selectedDate.year}
                </h3>
                <Link href={`${months.nextDate.year}-${months.nextDate.month}`}>
                  <h3 className="text-2xl  font-bold text-white">
                    {months.nextDate.monthName} {months.nextDate.year} &gt;
                  </h3>
                </Link>
              </div>
              {!!monthlyEvents && (
                <>
                  <div className="mt-4 flex w-full flex-col gap-4 rounded-xl bg-white/10 p-4  text-white">
                    {cal.map((week, index) => {
                      return <WeekRow key={index} week={week} />;
                    })}
                  </div>

                  <div className="mt-4 flex w-full flex-col gap-4  rounded-xl bg-white/10 p-4  text-white">
                    {monthlyEvents.events.map((value, index) => {
                      return (
                        <div key={index}>
                          <p>{value.desc}</p>
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

function WeekRow(props: { week: number[] }) {
  return (
    <div className="flex w-full justify-around">
      {props.week.map((day, index) => (
        <WeekCell key={index} day={day} desc="sfd" />
      ))}
    </div>
  );
}
function WeekCell(props: { day: number; desc: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center text-2xl hover:bg-white/20">
      {props.day === -1 ? (
        <></>
      ) : (
        <>
          <span>{props.day}</span>
          <span title={props.desc} className="hover:cursor-pointer">
            {!!props.desc && "·"}
          </span>
        </>
      )}
    </div>
  );
}

export default CalendarPage;
