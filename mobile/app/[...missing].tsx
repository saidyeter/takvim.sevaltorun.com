import { Link, Stack } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { FlexView } from "../components/themed/flex-view";
import { Label } from "../components/themed/label";

export default function NotFoundScreen() {
  const route = useRoute();
  console.log(route);

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <FlexView>
        <Label>This screen doesn't exist.</Label>

        <Link href="/">
          <Label>Go to home screen!</Label>
        </Link>
      </FlexView>
    </>
  );
}
