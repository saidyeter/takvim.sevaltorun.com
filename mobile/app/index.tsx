import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { Link, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

export default function IndexPage() {
  const { data: months } = useQuery({
    queryKey: ["months"],
    queryFn: () =>
      api.getRelatedMonths({
        year: 2023,
        monthIndex: 5,
      }),
  });
  const { data: monthlyEvents } = useQuery(["events"], {
    enabled: !!months,
    queryFn: () =>
      api.getMonthlyEvents({
        year: months?.selectedDate.year ?? 0,
        monthIndex: months?.selectedDate.month ?? 0,
      }),
  });
  if (months) {
    console.log(months);
  }
  if (monthlyEvents) {
    console.log(monthlyEvents);
  }
  // // const { data: months } = api.calendar.getRelatedMonths.useQuery({
  // //   year: props.year,
  // //   monthIndex: props.monthIndex,
  // // });
  // // const { data: monthlyEvents } = api.calendar.getMonthlyEvents.useQuery(
  // //   {
  // //     ...props,
  // //   },
  // //   {
  // //     enabled: !!months,
  // //   }
  // // );

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["calendarData"],
  //   queryFn: () =>
  //     api.getMonthlyEvents({
  //       year: 2023,
  //       monthIndex: 5,
  //     }),
  // });

  // if (isLoading) {
  //   console.log("loading");
  // }
  // if (error) {
  //   console.log("error", error);
  // } else {
  //   if (data) {
  //     console.log(data);
  //   } else {
  //     console.log("nodata");
  //   }
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Link href={{ pathname: "new" }}>new</Link>
      <Link href={{ pathname: "edit" }}>edit</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
