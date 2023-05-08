import { Link } from "expo-router";
import Calendar from "../components/calendar";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";
import { Label } from "../components/themed/label";

export default function IndexPage() {
  return (
    <>
      <StatusBar style="light" />
      <FlexView height="20%">
        <Label size="xs">Selam</Label>
        <Label size="s">Selam</Label>
        <Label size="m">Selam</Label>
        <Label size="l">Selam</Label>
        <Label size="xl">Selam</Label>
      </FlexView>
      <FlexView
        noFlex
        padding={0}
        height="60%"
      >
        <Calendar />
      </FlexView>
      <FlexView height="20%">
        <Link href={{ pathname: "new" }}>
          <Label size="l">new</Label>
          <Label size="xl">new</Label>
        </Link>
      </FlexView>
    </>
  );
}
