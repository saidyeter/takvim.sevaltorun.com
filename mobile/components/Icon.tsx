import FontAwesome from "@expo/vector-icons/FontAwesome";

export function Icon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color?: string;
  iconsize?:"xs" | "s" | "m" | "l" | "xl";
}) {
  if (!props.color) {
    props.color = "white"
  }

  let calculated_size = 20;
  switch (props.iconsize) {
    case "xs":
      calculated_size = 12;
      break;
    case "s":
      calculated_size = 16;
      break;
    case "l":
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
