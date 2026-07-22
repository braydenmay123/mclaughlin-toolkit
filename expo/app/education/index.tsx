import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  ChevronRight,
  TrendingUp,
  PiggyBank,
  Shield,
  Calculator,
  DollarSign,
  Search,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import {
  getCompletedChapters,
  clearEducationProgress,
} from "@/utils/educationProgress";

type IconType = React.ComponentType<{ size?: number; color?: string }>;

interface ChapterMeta {
  id: string;
  title: string;
  description: string;
  readTime: string;
}

interface EducationSection {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  accent: string;
  chapters: ChapterMeta[];
}

const SECTIONS: EducationSection[] = [
  {
    id: "foundational",
    title: "Foundational Topics",
    description: "Essential investing basics everyone should know",
    icon: BookOpen,
    accent: "#2563eb",
    chapters: [
      {
        id: "investing-basics",
        title: "Investing Basics",
        description: "Risk, return, and the fundamentals of building wealth",
        readTime: "5 min",
      },
      {
        id: "compound-growth",
        title: "Power of Compound Growth",
        description: "How time and compounding dramatically grow your wealth",
        readTime: "4 min",
      },
      {
        id: "risk-vs-reward",
        title: "Risk vs Reward",
        description: "Balancing potential returns with acceptable risk",
        readTime: "6 min",
      },
      {
        id: "staying-invested",
        title: "Staying Invested",
        description: "Managing emotions through market volatility",
        readTime: "5 min",
      },
      {
        id: "investing-mistakes",
        title: "Common Investing Mistakes",
        description: "Pitfalls that can derail your financial plan",
        readTime: "7 min",
      },
    ],
  },
  {
    id: "accounts",
    title: "Investment Accounts in Canada",
    description: "Registered and non-registered account types",
    icon: PiggyBank,
    accent: "#0d9488",
    chapters: [
      {
        id: "tfsa-basics",
        title: "Tax-Free Savings Account (TFSA)",
        description: "Contribution limits, withdrawals, and strategies",
        readTime: "6 min",
      },
      {
        id: "rrsp-basics",
        title: "Registered Retirement Savings Plan (RRSP)",
        description: "Tax deductions, limits, and retirement planning",
        readTime: "7 min",
      },
      {
        id: "fhsa-guide",
        title: "First Home Savings Account (FHSA)",
        description: "Canada's newest account for first-time home buyers",
        readTime: "5 min",
      },
      {
        id: "resp-guide",
        title: "Registered Education Savings Plan (RESP)",
        description: "Saving for children's education with government grants",
        readTime: "6 min",
      },
      {
        id: "rdsp-guide",
        title: "Registered Disability Savings Plan (RDSP)",
        description: "Long-term savings for people with disabilities",
        readTime: "5 min",
      },
      {
        id: "non-registered",
        title: "Non-Registered Accounts",
        description: "Taxable investment accounts and when to use them",
        readTime: "4 min",
      },
    ],
  },
  {
    id: "investments",
    title: "Types of Investments",
    description: "Different investment vehicles and their characteristics",
    icon: TrendingUp,
    accent: "#7c3aed",
    chapters: [
      {
        id: "mutual-funds",
        title: "Mutual Funds",
        description: "Professional management, diversification, and fees",
        readTime: "6 min",
      },
      {
        id: "etf-basics",
        title: "Exchange-Traded Funds (ETFs)",
        description: "Low-cost, diversified investing with flexibility",
        readTime: "5 min",
      },
      {
        id: "gic-basics",
        title: "Guaranteed Investment Certificates (GICs)",
        description: "Safe, guaranteed returns for conservative investors",
        readTime: "4 min",
      },
      {
        id: "stocks-basics",
        title: "Stocks",
        description: "Direct ownership in companies and future profits",
        readTime: "7 min",
      },
      {
        id: "bonds-explained",
        title: "Bonds",
        description: "Loans to governments and companies that pay interest",
        readTime: "6 min",
      },
    ],
  },
  {
    id: "planning",
    title: "Financial Planning Basics",
    description: "Building a solid foundation for your financial future",
    icon: Calculator,
    accent: "#ea580c",
    chapters: [
      {
        id: "emergency-funds",
        title: "Emergency Funds",
        description: "How much to save and where to keep it",
        readTime: "4 min",
      },
      {
        id: "budgeting",
        title: "Budgeting and Cash Flow",
        description: "Managing money effectively and finding room to invest",
        readTime: "6 min",
      },
      {
        id: "financial-goals",
        title: "Setting Financial Goals",
        description: "SMART goals and a roadmap to financial success",
        readTime: "5 min",
      },
      {
        id: "debt-vs-investing",
        title: "Debt vs Investing",
        description: "When to pay down debt vs when to invest",
        readTime: "6 min",
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance Fundamentals",
    description: "Protecting your financial plan with appropriate coverage",
    icon: Shield,
    accent: "#dc2626",
    chapters: [
      {
        id: "why-insurance",
        title: "Why Insurance Matters",
        description: "Protecting income, debts, and family goals",
        readTime: "5 min",
      },
      {
        id: "life-insurance-types",
        title: "Life Insurance Types",
        description: "Term, whole life, and universal life compared",
        readTime: "7 min",
      },
      {
        id: "ci-di",
        title: "Critical Illness & Disability",
        description: "Protecting income and covering major health events",
        readTime: "6 min",
      },
      {
        id: "insurance-coverage",
        title: "How Much Insurance Do You Need?",
        description: "Frameworks for right-sizing your coverage",
        readTime: "5 min",
      },
    ],
  },
  {
    id: "taxes-retirement",
    title: "Taxes & Retirement",
    description: "Tax implications and retirement income strategies",
    icon: DollarSign,
    accent: "#0891b2",
    chapters: [
      {
        id: "investment-taxation",
        title: "Investment Taxation",
        description: "Capital gains, dividends, and interest income",
        readTime: "6 min",
      },
      {
        id: "retirement-basics",
        title: "Retirement Basics",
        description: "How much you need and withdrawal order",
        readTime: "5 min",
      },
      {
        id: "cpp-oas",
        title: "CPP and OAS Benefits",
        description: "Government retirement benefits and optimization",
        readTime: "7 min",
      },
    ],
  },
];

const ALL_CHAPTERS: ChapterMeta[] = SECTIONS.flatMap((s) => s.chapters);

interface SectionState {
  expanded: boolean;
  anim: Animated.Value;
}

export default function EducationHomeScreen() {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogoLoading, setIsLogoLoading] = useState<boolean>(true);
  const [hasLogoError, setHasLogoError] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [sectionStates, setSectionStates] = useState<Record<string, SectionState>>(
    () =>
      Object.fromEntries(
        SECTIONS.map((s) => [s.id, { expanded: s.id === "foundational", anim: new Animated.Value(s.id === "foundational" ? 1 : 0) }])
      )
  );

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(-16)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;

  const loadProgress = useCallback(async () => {
    const ids = await getCompletedChapters();
    setCompleted(ids);
    setIsLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.spring(heroTranslate, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(statsOpacity, {
      toValue: 1,
      duration: 600,
      delay: 220,
      useNativeDriver: true,
    }).start();
  }, [heroOpacity, heroTranslate, statsOpacity]);

  const toggleSection = (id: string) => {
    setSectionStates((prev) => {
      const next = { ...prev };
      const isOpen = prev[id].expanded;
      next[id] = { ...prev[id], expanded: !isOpen };
      Animated.timing(prev[id].anim, {
        toValue: isOpen ? 0 : 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
      return next;
    });
  };

  const openChapter = (chapterId: string) => {
    router.push(`/education/${chapterId}` as Href);
  };

  const handleReset = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const ok = window.confirm(
        "Reset all education progress? This cannot be undone."
      );
      if (!ok) return;
      clearEducationProgress().then(loadProgress);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProgress();
  };

  const totalChapters = ALL_CHAPTERS.length;
  const completedCount = completed.length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  const filteredSections = React.useMemo<EducationSection[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.map((section) => ({
      ...section,
      chapters: section.chapters.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ),
    })).filter((s) => s.chapters.length > 0);
  }, [query]);

  const hasResults = filteredSections.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Animated.View
            style={[
              styles.heroInner,
              { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] },
            ]}
          >
            <View style={styles.logoContainer}>
              {isLogoLoading && !hasLogoError && (
                <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
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
                <Text style={styles.fallbackText}>McLaughlin Financial</Text>
              )}
            </View>

            <View style={styles.heroBadge}>
              <Sparkles size={14} color="#ffffff" />
              <Text style={styles.heroBadgeText}>Education Centre</Text>
            </View>

            <Text style={styles.heroTitle}>Master your finances</Text>
            <Text style={styles.heroSubtitle}>
              Clear, practical guides on investing, taxes, insurance, and
              retirement — built for Canadians.
            </Text>
          </Animated.View>
        </LinearGradient>

        <Animated.View
          style={[styles.statsCard, { opacity: statsOpacity }]}
        >
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Your progress</Text>
            <Text style={styles.statsCount}>
              {completedCount} / {totalChapters}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
              accessibilityRole="progressbar"
              accessibilityValue={{ now: progressPercent, min: 0, max: 100 }}
            />
          </View>
          <View style={styles.statsFooter}>
            <Text style={styles.statsPercent}>{progressPercent}% complete</Text>
            {completedCount > 0 && (
              <TouchableOpacity onPress={handleReset} activeOpacity={0.6}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrap}>
            <Search size={18} color={Colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search topics..."
              placeholderTextColor={Colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Search education topics"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={8}
              >
                <X size={18} color={Colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          {hasResults ? (
            filteredSections.map((section, sectionIndex) => {
              const Icon = section.icon;
              const state = sectionStates[section.id];
              const sectionCompleted = section.chapters.filter((c) =>
                completed.includes(c.id)
              ).length;
              const isExpanded = state.expanded;
              const rotation = state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "90deg"],
              });

              return (
                <View key={section.id} style={styles.sectionContainer}>
                  <Pressable
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.id)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isExpanded }}
                    accessibilityLabel={`${section.title} section, ${sectionCompleted} of ${section.chapters.length} completed`}
                  >
                    <View
                      style={[
                        styles.sectionIconContainer,
                        { backgroundColor: `${section.accent}14`, borderColor: `${section.accent}33` },
                      ]}
                    >
                      <Icon size={22} color={section.accent} />
                    </View>
                    <View style={styles.sectionHeaderText}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      <Text style={styles.sectionMeta}>
                        {sectionCompleted}/{section.chapters.length} completed ·{" "}
                        {section.chapters.reduce(
                          (sum, c) => sum + parseInt(c.readTime, 10),
                          0
                        )}{" "}
                        min
                      </Text>
                    </View>
                    <Animated.View
                      style={{ transform: [{ rotate: rotation }] }}
                    >
                      <ChevronRight size={20} color={Colors.textLight} />
                    </Animated.View>
                  </Pressable>

                  {isExpanded && (
                    <View style={styles.chaptersList}>
                      {section.chapters.map((chapter, chapterIndex) => {
                        const isCompleted = completed.includes(chapter.id);
                        return (
                          <ChapterCard
                            key={chapter.id}
                            chapter={chapter}
                            accent={section.accent}
                            isCompleted={isCompleted}
                            index={chapterIndex}
                            onPress={() => openChapter(chapter.id)}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Search size={40} color={Colors.textMuted} />
              <Text style={styles.emptyStateTitle}>No topics found</Text>
              <Text style={styles.emptyStateText}>
                Try a different search term.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Need personal guidance?</Text>
          <Text style={styles.ctaText}>
            Connect with Joe McLaughlin for personalized advice on your
            financial journey.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/(app)/(tabs)/advisor" as Href)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Talk with Joe"
          >
            <Text style={styles.ctaButtonText}>Talk with Joe</Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ChapterCardProps {
  chapter: ChapterMeta;
  accent: string;
  isCompleted: boolean;
  index: number;
  onPress: () => void;
}

const ChapterCard = React.memo(function ChapterCard({
  chapter,
  accent,
  isCompleted,
  index,
  onPress,
}: ChapterCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 340,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 60,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
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
    <Animated.View
      style={{ opacity, transform: [{ translateY }, { scale }] }}
    >
      <Pressable
        style={styles.chapterCard}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`${chapter.title}, ${chapter.readTime} read${isCompleted ? ", completed" : ""}`}
      >
        <View
          style={[
            styles.chapterCheckCircle,
            isCompleted
              ? { backgroundColor: accent, borderColor: accent }
              : { backgroundColor: "transparent", borderColor: Colors.border },
          ]}
        >
          {isCompleted && <CheckCircle2 size={16} color="#ffffff" />}
        </View>
        <View style={styles.chapterContent}>
          <Text style={styles.chapterTitle} numberOfLines={2}>
            {chapter.title}
          </Text>
          <Text style={styles.chapterDescription} numberOfLines={2}>
            {chapter.description}
          </Text>
          <View style={styles.chapterMetaRow}>
            <Clock size={12} color={Colors.textLight} />
            <Text style={styles.chapterMetaText}>{chapter.readTime} read</Text>
          </View>
        </View>
        <ChevronRight size={18} color={Colors.textLight} />
      </Pressable>
    </Animated.View>
  );
});

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
    paddingTop: 24,
    paddingBottom: 56,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: -24,
  },
  heroInner: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    height: 48,
    position: "relative",
  },
  loader: {
    position: "absolute",
    top: 14,
  },
  logo: {
    width: 180,
    height: 48,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.4,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: "88%",
    fontWeight: "400",
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    padding: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  statsCount: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  statsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statsPercent: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "500",
  },
  resetText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionContainer: {
    marginBottom: 14,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  sectionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  sectionMeta: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "500",
  },
  chaptersList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chapterCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chapterContent: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  chapterDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  chapterMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chapterMetaText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 14,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ctaContainer: {
    marginTop: 32,
    marginHorizontal: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 18,
    maxWidth: "92%",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
});
