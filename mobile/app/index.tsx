import { Text } from "../components/Themed";
import { Link } from "expo-router";
import Calendar from "../components/calendar";
import { FlexView } from "../components/themed/flex-view";
import { StatusBar } from "expo-status-bar";

export default function IndexPage() {
  return (
    <>
      <StatusBar style="light" />
      <FlexView height="20%">
        <Text style={{ color: "white" }}>selam</Text>
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
          <Text style={{ color: "white" }}>new</Text>
        </Link>
      </FlexView>
    </>
  );
}
