import { StyleSheet } from "react-native";

import { View, Text } from "../components/Themed";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import Calendar from "../components/calendar";

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
  return (
    <>
      <View
        style={{
          width: "100%",
          height: "20%",
        }}
      />
      <View
        style={{
          width: "100%",
          height: "60%",
          backgroundColor: "green",
        }}
      >
        <Calendar />
      </View>
      <View
        style={{
          width: "100%",
          height: "20%",
          flex:1,
          justifyContent:'center',
        alignItems:'center'
        }}
      >
        <Link href={{ pathname: "new" }}>new</Link>
      </View>
      {/* <View style={styles.container}>

      <Link href={{ pathname: "edit" }}>edit</Link>
   

    </View> */}
    </>
  );
}
