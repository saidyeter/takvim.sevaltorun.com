import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { Icon } from "./Icon";
import { FlexView } from "./themed/flex-view";
import { Label } from "./themed/label";
import { z } from "zod";
import { eventSchema } from "../api/client";

function EventList(props: { events: z.infer<typeof eventSchema>[] }) {
  const { events } = props;
  return (
    <ScrollView style={{ width: "100%", height: "100%" }}>
      {events?.map((value, index) => {
        return (
          <FlexView
            key={index}
            flexDirection="row"
            marginTop={12}
            gap={1}
            paddingLeft={4}
            borderColor={pickColor(value.id)}
            borderLeftWidth={6}
            borderBottomWidth={1}
          >
            <FlexView
              flexDirection="column"
              width="60%"
            >
              <Label
                fontWeight="600"
                textAlign="left"
              >
                {value.desc}
              </Label>
              <Label
                fontWeight="200"
                size="xs"
                textAlign="left"
              >
                {getLocaleDate(value.starts)}-{getLocaleDate(value.ends)}
              </Label>
            </FlexView>
            <Link
              href={{
                pathname: "/edit",
                params: { id: value.id },
              }}
            >
              <Icon
                name="pencil"
                color="white"
              />
            </Link>
          </FlexView>
        );
      })}
    </ScrollView>
  );
}

export default EventList;

function getLocaleDate(ms: Date) {
  return ms.toLocaleDateString("tr-TR", {
    // year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}

function pickColor(id: string) {
  const hash = Math.abs(hashCode(id));
  const colorIndex = hash % colors.length;
  // console.log(id, hash, colorIndex, colors[colorIndex]);

  return colors[colorIndex];
}

function hashCode(value: string) {
  let hash = 0,
    i,
    chr;
  if (value.length === 0) return hash;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const colors = [
  "#A6D0DD",
  "#FF6969",
  "#FFD3B0",
  "#E8A0BF",
  "#BA90C6",
  "#C7E9B0",
  "#CCD5AE",
  "#FFB4B4",
  "#FFACAC",
  "#FFAACF",
  "#FFCEFE",
  "#F8CBA6",
  "#CDE990",
  "#8DCBE6",
  "#FD8A8A",
  "#BCEAD5",
  "#9ED5C5",
  "#BCCEF8",
  "#ABD9FF",
  "#FFABE1",
  "#B1D7B4",
  "#F7ECDE",
  "#B2C8DF",
  "#C4D7E0",
  "#C7D36F",
  "#E0DECA",
  "#CDC2AE",
  "#92B4EC",
];
