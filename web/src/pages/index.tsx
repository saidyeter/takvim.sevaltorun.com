import { type NextPage } from "next";
import Head from "next/head";
import CalendarPage from "~/components/calendar-page";


const Home: NextPage = () => {
  const date = new Date();
  return (
    <>
      <Head>
        <title>Takvim</title>
      </Head>
     <CalendarPage year={date.getFullYear()} monthIndex={date.getMonth()}/>
    </>
  );
};
 export default Home;