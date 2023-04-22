import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const date = new Date();
  const [cal, setCal] = useState([] as number[][]);

  const [year, setYear] = useState(date.getFullYear());
  const { data: months, isLoading: monthsLoading } =
    api.calendar.getMonths.useQuery();
  const { data: events, isLoading: eventsLoading } =
    api.calendar.getMonthlyEvents.useQuery(
      {
        month: 4,
        year,
      },
      {
        enabled: !!months,
      }
    );

  useEffect(() => {
    if (!events) {
      return;
    }
    const weeks: number[][] = [];
    let week: number[] = [];
    let counter = 1;
    for (let i = 1; i < events.monthLength + events.startWeekDay; i++) {
      if (i < events.startWeekDay) {
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
    console.log(weeks);
    setCal(weeks);
  }, [events]);

  return (
    <>
      <Head>
        <title>Takvim</title>
        <meta name="description" content="Seval Torun Takvim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#15162c]">
        <div className="flex flex-col items-start justify-center">
          {!!months && (
            <>
              <h3 className="text-2xl font-bold text-white">
                {months.previousName} {year}
              </h3>
              <h3 className="text-2xl font-bold text-white">
                {months.currentName} {year}
              </h3>
              {!!events && (
                <div className="flex max-w-xl flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                  {cal.map((week, index) => {
                    return <WeekRow key={index} week={week} />;
                  })}
                </div>
              )}
              <h3 className="text-2xl font-bold text-white">
                {months.nextName} {year}
              </h3>
            </>
          )}
        </div>
      </main>
    </>
  );
};

function WeekRow(props: { week: number[] }) {
  return (
    <div className="flex ">
      {props.week.map((day, index) => (
        <WeekCell key={index} day={day} desc="sfd" />
      ))}
    </div>
  );
}
function WeekCell(props: { day: number; desc: string }) {
  return (
    <div className="flex h-16 w-16 flex-col items-center justify-center text-2xl">
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

export default Home;
