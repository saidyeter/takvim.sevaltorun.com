import { ColorValue, Text, TextInput, TextStyle } from "react-native";
type Size = "xs" | "s" | "m" | "l" | "xl";
export interface TextboxProps extends TextStyle {
  children: string | number;
  onChangeText?: (text: string) => void;
  size?: Size;
}

export function TextBox(props: TextboxProps) {
  const defaultStyle: { [key: string]: number | string | ColorValue } = {
    textAlign: "center",
    padding: 2,
    color: "white",
    width: "100%",
    fontSize: getFontSize(props.size),
    borderWidth:2,
    borderColor:'white',
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
    <TextInput 
      style={defaultStyle}
      value={props.children?.toString()}
      onChangeText={props.onChangeText}
    />
  );
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
