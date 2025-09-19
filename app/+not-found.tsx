import { Stack, Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <Text style={styles.title}>Oops — that page doesn’t exist.</Text>
      <Text style={styles.subtitle}>
        The link may be broken or the page may have moved.
      </Text>
      <Link href="/" asChild>
        <Pressable style={styles.button} testID="go-home-button">
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    maxWidth: 420,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
  },
});
