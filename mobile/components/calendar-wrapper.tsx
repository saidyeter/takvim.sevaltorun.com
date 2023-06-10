import { useEffect, useState } from "react";
import api from "../api/client";
import { useQuery } from "@tanstack/react-query";
import { FlexView } from "./themed/flex-view";
import { Link } from "expo-router";
import { Icon } from "./Icon";
import { z } from "zod";
import { getMonthlyEventsResultSchema2 } from "../api/client";
import Header from "./header";
import Calendar from "./calendar";
import EventList from "./event-list";

export default function CalendarWrapper() {
  const [month, setMonth] = useState(
    {} as z.infer<typeof getMonthlyEventsResultSchema2> | undefined
  );

  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
  });

  const { data: months, refetch: refetchMonths } = useQuery({
    queryKey: ["months"],
    queryFn: () =>
      api.getRelatedMonths({
        year: selectedDate.year,
        monthIndex: selectedDate.monthIndex,
      }),
    onError: (err: any) => {
      console.log("err", err);
    },
  });
  const { refetch: refetchEvents } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      api.getMonthlyEvents2({
        year: selectedDate.year,
        monthIndex: selectedDate.monthIndex,
      }),
    onSuccess: (data) => {
      if (data) {
        setMonth(data);
      } 
    },
  });

  useEffect(() => {
    refetchEvents();
    refetchMonths();
  }, [selectedDate]);

  return (
    <FlexView
      noFlex
      height="100%"
    >
      {!!months && (
        <>
          <Header
            setSelectedDate={setSelectedDate}
            months={months}
          />

          {!!month && (
            <>
              <Calendar weeks={month.weeks} />
              <Link
                href={{ pathname: "new" }}
                style={{
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "#15162c",
                  padding: 5,
                }}
              >
                <Icon
                  name="plus-square-o"
                  color="white"
                  iconsize="xl"
                />
              </Link>
              <FlexView flex={1}>
                <EventList events={month.events} />
              </FlexView>
            </>
          )}
        </>
      )}
    </FlexView>
  );
}
