import { z } from "zod";
import { dayResultSchema, weekResultSchema } from "../api/client";
import { FlexView } from "./themed/flex-view";
import { Label } from "./themed/label";
import { Text } from "react-native";

function Calendar(props: { weeks: z.infer<typeof weekResultSchema>[] }) {
  const { weeks } = props;
  return (
    <FlexView
      height={64 * 6}
      flex={0}
      flexDirection="column"
      marginTop={4}
    >
      {weeks?.map((week, index) => {
        return (
          <WeekRow
            key={index}
            week={week}
          />
        );
      })}
    </FlexView>
  );
}

export default Calendar;

function WeekRow(props: { week: z.infer<typeof weekResultSchema> }) {
  return (
    <FlexView
      flexDirection="row"
      justifyContent="space-around"
      height={64}
      width="100%"
      flex={0}
      padding={0}
      margin={0}
    >
      {props.week.map((day, index) => (
        <WeekCell
          key={index}
          {...day}
        />
      ))}
    </FlexView>
  );
}
function WeekCell(props: z.infer<typeof dayResultSchema>) {
  // console.log(props.color);

  return (
    <FlexView
      flexDirection="column"
      // bg="red"
      width={64}
      height={64}
      padding={0}
      flex={0}
      margin={0}
    >
      <FlexView
        width={64}
        height={48}
        flex={0}
        padding={0}
        margin={0}
      >
        <Label size="l" color={props.dayColor}>{props.day.getDate()}</Label>
      </FlexView>
      <FlexView
        width={64}
        height={16}
        flex={0}
        padding={0}
        margin={0}
        flexDirection="row"
        alignItems="flex-start"
      >
        {props.info?.map((e, i) => {
          return (
            <Text
              key={i}
              style={{ color: e, fontWeight:'bold',fontSize:32, lineHeight:22 }}
            >{`·`}</Text>
          );
        })}
      </FlexView>
    </FlexView>
  );
}
