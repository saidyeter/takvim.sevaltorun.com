import { Link } from "expo-router";
import Calendar from "../components/calendar";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";
import { Label } from "../components/themed/label";

export default function IndexPage() {
  return (
    <>
      <StatusBar style="light" />
      <FlexView height="10%"/>
      <FlexView
        noFlex
        padding={0}
        height="80%"
      >
        <Calendar />
      </FlexView>
      <FlexView height="10%"/>
    </>
  );
}
