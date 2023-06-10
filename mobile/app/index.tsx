import CalendarWrapper from "../components/calendar-wrapper";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";

export default function IndexPage() {
  return (
    <>
      <StatusBar style="light" />
      <FlexView height="5%"/>
      <FlexView
        noFlex
        padding={0}
        height="90%"
      >
        <CalendarWrapper />
      </FlexView>
      <FlexView height="5%"/>
    </>
  );
}
