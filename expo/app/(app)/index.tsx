import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Calculator, BookOpen, Map, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";

type Section = {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  route: Href;
};

const SECTIONS: Section[] = [
  {
    title: "Calculators",
    description:
      "Interactive financial calculators for investments, taxes, home buying, and retirement planning.",
    icon: Calculator,
    route: "/go/calculators",
  },
  {
    title: "Education Centre",
    description:
      "Learn about investing, taxes, insurance, and financial planning through our comprehensive guides.",
    icon: BookOpen,
    route: "/go/education",
  },
  {
    title: "Interactive Asset Mapping",
    description:
      "Visualize and optimize your complete financial portfolio with our interactive asset mapping tool.",
    icon: Map,
    route: "/mapping",
  },
];

function SectionCard({
  section,
  index,
  onPress,
}: {
  section: Section;
  index: number;
  onPress: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay: 120 + index * 90,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: 120 + index * 90,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  const Icon = section.icon;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.sectionCard}
        accessibilityRole="button"
        accessibilityLabel={section.title}
      >
        <View style={styles.sectionIconContainer}>
          <Icon size={32} color={Colors.primary} />
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.chevronContainer}>
              <ChevronRight size={20} color={Colors.primary} />
            </View>
          </View>
          <Text style={styles.sectionDescription}>{section.description}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [isLogoLoading, setIsLogoLoading] = useState<boolean>(true);
  const [hasLogoError, setHasLogoError] = useState<boolean>(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslate, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslate]);

  const navigateToSection = (route: Href) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.accentLight, Colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.heroGradient}
        >
          <Animated.View
            style={[
              styles.heroInner,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslate }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              {isLogoLoading && !hasLogoError && (
                <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                  style={styles.loader}
                />
              )}

              <Image
                source={require("@/assets/images/logo.png")}
                style={[styles.logo, hasLogoError && styles.hidden]}
                resizeMode="contain"
                onLoadStart={() => setIsLogoLoading(true)}
                onLoadEnd={() => setIsLogoLoading(false)}
                onError={() => {
                  setHasLogoError(true);
                  setIsLogoLoading(false);
                }}
              />

              {hasLogoError && (
                <Text style={styles.fallbackText}>
                  McLaughlin Financial Group
                </Text>
              )}
            </View>

            <Text style={styles.title}>McLaughlin Financial Group</Text>
            <Text style={styles.subtitle}>
              Your comprehensive financial planning platform
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.sectionsContainer}>
          {SECTIONS.map((section, i) => (
            <SectionCard
              key={section.title}
              section={section}
              index={i}
              onPress={() => navigateToSection(section.route)}
            />
          ))}
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>McLaughlin Financial Group</Text>
          <Text style={styles.contactInfoText}>1 Elora Street North, Unit 1</Text>
          <Text style={styles.contactInfoText}>Harriston, Ontario</Text>
          <Text style={styles.contactInfoText}>Phone: 519-510-0411</Text>
          <Text style={styles.contactInfoText}>
            Email: info@mclaughlinfinancial.ca
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroGradient: {
    paddingBottom: 32,
    marginBottom: 16,
  },
  heroInner: {
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 20,
    height: 70,
    position: "relative",
  },
  loader: {
    position: "absolute",
    top: 25,
  },
  logo: {
    width: 260,
    height: 70,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 25,
    maxWidth: "92%",
    fontWeight: "400",
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 40,
  },
  sectionCard: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === "web" ? 0.06 : 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  sectionContent: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: Colors.primary,
    flex: 1,
    paddingRight: 12,
    letterSpacing: -0.3,
    lineHeight: 27,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
    fontWeight: "400",
  },
  contactContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: Colors.accentLight,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  contactInfoText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "400",
  },
});
