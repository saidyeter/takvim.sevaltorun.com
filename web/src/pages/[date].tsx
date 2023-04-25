import type { GetServerSideProps } from "next";
import Head from "next/head";
import { z } from "zod";
import CalendarPage from "~/components/calendar-page";

const DatePage = (props: { date: { year: number; monthIndex: number } }) => {

  return (
    <>
      <CalendarPage {...props.date} />
    </>
  );
};

export default DatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let date = new Date();
  const { date: dateFromQuery } = context.query;
  const querySchema = z.string().regex(/^(202\d)-([1-9]|(0[1-9])|(1[0-2]))$/);
  const parseResult = querySchema.safeParse(dateFromQuery);
  if (parseResult.success) {
    const year = parseInt(parseResult.data.split("-")[0]!);
    const month = parseInt(parseResult.data.split("-")[1]!);
    const monthIndex = month - 1;

    date = new Date(year, monthIndex);
  }

  return {
    props: {
      date: {
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      },
    },
  };
};
