import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";

export default function NotFoundScreen() {
  return (
    <View style={styles.container} testID="notFoundScreen">
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.subtitle}>The page you’re looking for doesn’t exist.</Text>
      <Link href="/" testID="goHomeLink"><Text style={styles.link}>Go to Home</Text></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.background,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  link: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
});