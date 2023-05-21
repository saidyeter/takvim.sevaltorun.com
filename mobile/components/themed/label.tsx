import { ColorValue, Text, TextStyle } from "react-native";
type Size = "xs" | "s" | "m" | "l" | "xl";
export interface LabelProps extends TextStyle {
  children: string | number | string[];
  size?: Size;
}

export function Label(props: LabelProps) {
  const defaultStyle: { [key: string]: number | string | ColorValue } = {
    textAlign: "center",
    padding: 2,
    color: "white",
    width: "100%",
    fontSize: getFontSize(props.size),
  };

  Object.entries(props).forEach((p) => {
    if (
      p[1] &&
      (typeof p[1] === "number" || typeof p[1] === "string") &&
      p[0] !== "children" &&
      p[0] !== "size"
    ) {
      defaultStyle[p[0]] = p[1];
    }
  });
  //   console.log("defaultStyle", defaultStyle);

  return <Text style={defaultStyle}>{props.children}</Text>;
}

function getFontSize(size?: Size) {
  const base = 12;
  switch (size) {
    case "xs":
      return base;
    case "s":
      return base + 4;
    case "m":
      return base + 8;
    case "l":
      return base + 12;
    case "xl":
      return base + 16;
    default:
      return base + 8;
  }
}
