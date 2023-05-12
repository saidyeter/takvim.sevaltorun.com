import { ColorValue, Pressable, ViewStyle } from "react-native";
import { Label } from "./label";
type Size = "xs" | "s" | "m" | "l" | "xl";
export interface TextboxProps extends ViewStyle {
  children: string | number;
  onPress?: (event: any) => void;
  size?: Size;
}

export function Touchable(props: TextboxProps) {
  const defaultStyle: { [key: string]: number | string | ColorValue } = {
    textAlign: "center",
    padding: 2,
    color: "white",
    width: "60%",
    borderRadius:5,
    fontSize: getFontSize(props.size),
    borderWidth: 2,
    borderColor: "white",
  };

  Object.entries(props).forEach((p) => {
    if (
      p[1] &&
      (typeof p[1] === "number" || typeof p[1] === "string") &&
      p[0] !== "children" &&
      p[0] !== "size" &&
      p[0] !== "onChangeText"
    ) {
      defaultStyle[p[0]] = p[1];
    }
  });
  //   console.log("defaultStyle", defaultStyle);

  return (
    <Pressable
      style={defaultStyle}
      onPress={props.onPress}
    >
      {({ pressed }) => (
        <Label size={pressed ? getSmallerSize(props.size) : props.size}>
          {props.children}
        </Label>
      )}
    </Pressable>
  );
}

function getSmallerSize(size?: Size) {
  switch (size) {
    case "xs":
    case "s":
      return "xs";
    case "m":
      return "s";
    case "l":
      return "m";
    case "xl":
      return "l";
    default:
      return "s";
  }
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
