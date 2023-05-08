import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { Link } from "expo-router";

export default function NewPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>new</Text>
      <Link href={{ pathname: "/" }}>home</Link>
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
