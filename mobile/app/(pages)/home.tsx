import { StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import { Link, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/client";

export default function HomePage() {

  const { isLoading, error, data } = useQuery({
    queryKey: ["calendarData"],
    queryFn: () => api.getMonthlyEvents({
      year:2023,
      monthIndex:5
    }),
  });

  if (isLoading) {
    console.log('loading');
  }
  if (error) {
    console.log('error',error);
  }
  else{
    if (data) {
      console.log(JSON.stringify(data));
        }
        else{
          console.log('nodata');
          
        }
    
  }

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
