import { Pressable } from "react-native";
import { FlexView } from "./themed/flex-view";
import { Label } from "./themed/label";

function Header(props: {
  setSelectedDate: React.Dispatch<
    React.SetStateAction<{
      year: number;
      monthIndex: number;
    }>
  >;
  months: {
    selectedDate: {
      year: number;
      month: number;
      monthName: string;
    };
    previousDate: {
      year: number;
      month: number;
      monthName: string;
    };
    nextDate: {
      year: number;
      month: number;
      monthName: string;
    };
  };
}) {
  const { setSelectedDate, months } = props;
  return (
    <FlexView
      flexDirection="row"
      alignItems="flex-end"
      height={75}
      flex={0}
    >
      <FlexView flexDirection="column">
        <Pressable
          onPress={() => {
            setSelectedDate((p) => {
              const d = new Date(p.year, p.monthIndex, 1);
              d.setMonth(d.getMonth() - 1);
              return {
                year: d.getFullYear(),
                monthIndex: d.getMonth(),
              };
            });
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
        <Label size="l">{months.selectedDate.monthName}</Label>
        <Label size="l">{months.selectedDate.year}</Label>
      </FlexView>
      <FlexView flexDirection="column">
        <Pressable
          onPress={() => {
            setSelectedDate((p) => {
              const d = new Date(p.year, p.monthIndex, 1);
              d.setMonth(d.getMonth() + 1);
              return {
                year: d.getFullYear(),
                monthIndex: d.getMonth(),
              };
            });
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
  );
}

export default Header;
