import { useEffect, useState } from "react";
import { Text, View } from "./Themed";
import api from "../api/client";
import { useQuery } from "@tanstack/react-query";
import { Pressable } from "react-native";
import { FlexView } from "./themed/flex-view";
import { Label } from "./themed/label";

type CellProps = {
  dayNumber: number;
  color?: string;
};
export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cal, setCal] = useState([] as CellProps[][]);

  const { data: months } = useQuery({
    queryKey: ["months"],
    queryFn: () =>
      api.getRelatedMonths({
        year: selectedDate.getFullYear(),
        monthIndex: selectedDate.getMonth(),
      }),
  });
  const { data: monthlyEvents } = useQuery(["events"], {
    enabled: !!months,
    queryFn: () =>
      api.getMonthlyEvents({
        year: months?.selectedDate.year ?? 0,
        monthIndex: months?.selectedDate.month ?? 0,
      }),
  });

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
    <FlexView
      noFlex
      height="100%"
    >
      {!!months && (
        <>
          <FlexView flexDirection="row">
            <FlexView flexDirection="column">
              <Pressable
                onPress={() => {
                  console.log("pressed 1");
                }}
              >
                {({ pressed }) => (
                  <>
                    <Label color={pressed ? "white" : "grey"}>
                      {months.previousDate.monthName}
                    </Label>
                    <Label color={pressed ? "white" : "grey"}>
                      {months.previousDate.year}
                    </Label>
                  </>
                )}
              </Pressable>
            </FlexView>
            <FlexView flexDirection="column">
              <Label>{months.selectedDate.monthName}</Label>
              <Label>{months.selectedDate.year}</Label>
            </FlexView>
            <FlexView flexDirection="column">
              <Pressable
                onPress={() => {
                  console.log("pressed 2");
                }}
              >
                {({ pressed }) => (
                  <>
                    <Label color={pressed ? "white" : "grey"}>
                      {months.nextDate.monthName}
                    </Label>
                    <Label color={pressed ? "white" : "grey"}>
                      {months.nextDate.year}
                    </Label>
                  </>
                )}
              </Pressable>
            </FlexView>
          </FlexView>
          {!!monthlyEvents && (
            <>
              <FlexView
                flex={2}
                flexDirection="column"
                marginTop={4}
              >
                {cal.map((week, index) => {
                  return (
                    <WeekRow
                      key={index}
                      week={week}
                    />
                  );
                })}
              </FlexView>
              <FlexView
                flexDirection="column"
                marginTop={2}
                gap={1}
              >
                {monthlyEvents.events.map((value, index) => {
                  return (
                    <FlexView
                      key={index}
                      flexDirection="column"
                      marginTop={2}
                      gap={1}
                      paddingLeft={4}
                      borderColor={pickColor(value.id)}
                      borderLeftWidth={6}
                    >
                      <Label
                        fontWeight="200"
                        textAlign="left"
                      >
                        {getLocaleDate(value.starts)}-
                        {getLocaleDate(value.ends)}
                      </Label>
                      <Label
                        fontWeight="600"
                        textAlign="left"
                      >
                        {value.desc}
                      </Label>
                    </FlexView>
                  );
                })}
              </FlexView>
            </>
          )}
        </>
      )}
    </FlexView>
  );
}

function WeekRow(props: { week: CellProps[] }) {
  return (
    <FlexView
      flexDirection="row"
      justifyContent="space-around"
    >
      {props.week.map((day, index) => (
        <WeekCell
          key={index}
          day={day.dayNumber}
          color={day.color}
        />
      ))}
    </FlexView>
  );
}
function WeekCell(props: { day: number; color?: string }) {
  // console.log(props.color);

  return (
    <FlexView flexDirection="column">
      {props.day === -1 ? (
        <></>
      ) : (
        <>
          <Label>{props.day}</Label>
          {props.color && (
            <FlexView
              bg="red"
              borderRadius={15}
              width={4}
              height={4}
            />
          )}
        </>
      )}
    </FlexView>
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

function pickColor(id: string) {
  const hash = Math.abs(hashCode(id));
  const colorIndex = hash % colors.length;
  // console.log(id, hash, colorIndex, colors[colorIndex]);

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
