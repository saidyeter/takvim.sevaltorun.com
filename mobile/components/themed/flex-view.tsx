import { FlexStyle, View } from "react-native";

export interface ViewProps extends FlexStyle {
  children?: React.ReactNode;
  noFlex?: boolean;
  bg?: string;
  borderRadius?:number
  borderColor?:string
}

export function FlexView(props: ViewProps) {
  const defaultStyle: { [key: string]: number | string } = {
    backgroundColor: props.bg ?? "black",//15162c
    padding: 2,
    width: "100%",
  };
  if (!props.noFlex) {
    defaultStyle.flex = props.flex ?? 1;
    defaultStyle.justifyContent = props.justifyContent ?? "center";
    defaultStyle.alignItems = props.alignItems ?? "center";
  }
  Object.entries(props).forEach((p) => {
    if (p[1] && (typeof p[1] === "number" || typeof p[1] === "string")) {
      defaultStyle[p[0]] = p[1];
    }
  });
  // console.log("defaultStyle", defaultStyle);

  return <View style={defaultStyle}>{props.children}</View>;
}
