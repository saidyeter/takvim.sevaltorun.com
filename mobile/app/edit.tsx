import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { Link } from "expo-router";

export default function EditPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>edit</Text>
      <Link href={{ pathname: "new" }}>new</Link>
      <Link href={{ pathname: "/" }}>home</Link>
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
