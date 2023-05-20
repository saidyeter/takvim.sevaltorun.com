import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

export function Icon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color?: string;
  iconsize?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const colorScheme = useColorScheme();
  if (!props.color) {
    props.color = Colors[colorScheme ?? "light"].text;
  }

  let calculated_size = 20;
  switch (props.iconsize) {
    case "xs":
      calculated_size = 12;
      break;
    case "sm":
      calculated_size = 16;
      break;
    case "lg":
      calculated_size = 24;
      break;

    case "xl":
      calculated_size = 28;
      break;

    default:
      break;
  }
  return (
    <FontAwesome
      size={calculated_size}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}
