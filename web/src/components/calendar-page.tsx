import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import type { Event } from "@prisma/client";
import { pickColor } from "~/server/color";
import dater from "~/server/dater";

type CellProps = {
  //old
  dayNumber: number;
  color?: string;

  //new
  dayColor?: string;
  day?: Date;
  info?: string[];
};

const CalendarPage = (props: { year: number; monthIndex: number }) => {
  const [cal, setCal] = useState([] as CellProps[][]);
  const [events, setevents] = useState([] as Event[]);

  const { data: months } = api.calendar.getRelatedMonths.useQuery({
    year: props.year,
    monthIndex: props.monthIndex,
  });
  api.calendar.tmpgetMonthlyEvents.useQuery(
    {
      ...props,
    },
    {
      enabled: !!months,
      onSuccess: (data) => {
        setCal(data.weeks);
        setevents(data.events);
      },
    }
  );

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
              {!!cal && (
                <>
                  <div className="mt-4 flex w-full flex-col rounded-xl bg-white/10 p-4  text-white">
                    {cal.map((week, index) => {
                      return <WeekRow key={index} week={week} />;
                    })}
                  </div>

                  <div className="mt-2 flex w-full flex-col gap-1">
                    {events.map((value, index) => {
                      return (
                        <div
                          key={index}
                          className={`flex w-full flex-col gap-1 border-l-8 bg-white/10 p-2 pl-4 text-white`}
                          style={{ borderColor: pickColor(value.id) }}
                        >
                          <p className="font-light text-slate-300">
                            {getEventDates(value.starts, value.ends)}
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
        <WeekCell
          key={index}
          {...day}
          //day={day.dayNumber} color={day.color}
        />
      ))}
    </div>
  );
}

function WeekCell(props: CellProps) {
  return (
    <>
      <div className="flex h-16 w-full flex-col items-center justify-center rounded-md  hover:bg-white/10">
        <div className="flex h-12 w-full flex-col items-center justify-center text-2xl">
          <span style={{ color: props.dayColor }}>{props.day?.getDate()}</span>
        </div>
        <div className="flex h-4 w-full flex-row items-center justify-evenly">
          {props.info?.map((e, i) => {
            return (
              <div
                key={i}
                style={{ backgroundColor: e }}
                className="h-2 w-2 rounded-full"
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CalendarPage;

function getEventDates(starts: Date, ends: Date) {
  starts.setHours(0, 0, 0, 0);
  ends.setHours(0, 0, 0, 0);
  if (starts.getTime() === ends.getTime()) {
    return dater.getLocaleDate(starts);
  }
  return dater.getLocaleDate(starts) + "-" + dater.getLocaleDate(ends);
}
