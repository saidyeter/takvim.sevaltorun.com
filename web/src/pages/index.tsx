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
  const { data: monthlyEvents, isLoading: eventsLoading } =
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
    console.log(weeks);
    setCal(weeks);
  }, [monthlyEvents]);

  return (
    <>
      <Head>
        <title>Takvim</title>
        <meta name="description" content="Seval Torun Takvim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#15162c]">
        <div className="flex w-full flex-col items-start justify-center p-4 md:w-[720px] md:p-0">
          {!!months && (
            <>
              <h3 className="p-4 text-2xl font-bold text-white">
                {months.previousName} {year}
              </h3>
              <h3 className="p-4 text-2xl font-bold text-white">
                {months.currentName} {year}
              </h3>
              {!!monthlyEvents && (
                <>
                  <div className="flex w-full flex-col gap-4 rounded-xl  bg-white/10 p-4 text-white">
                    {cal.map((week, index) => {
                      return <WeekRow key={index} week={week} />;
                    })}
                  </div>

                  <div className="flex w-full flex-col gap-4 rounded-xl  bg-white/10 p-4 text-white">
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
              <h3 className="p-4 text-2xl  font-bold text-white">
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

export default Home;
