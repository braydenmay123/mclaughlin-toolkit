import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { BookOpen, ChevronRight, TrendingUp, PiggyBank, Shield, Calculator, DollarSign, Brain } from "lucide-react-native";
import Colors from "@/constants/colors";
import UserInfoModal from "@/components/UserInfoModal";

interface EducationSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  chapters: EducationChapter[];
}

interface EducationChapter {
  id: string;
  title: string;
  description: string;
  estimatedReadTime: string;
}

const educationSections: EducationSection[] = [
  {
    id: "foundational",
    title: "Foundational Topics",
    description: "Essential investing basics everyone should know",
    icon: BookOpen,
    chapters: [
      {
        id: "investing-basics",
        title: "Investing Basics",
        description: "Understanding risk, return, and the fundamentals of building wealth",
        estimatedReadTime: "5 min"
      },
      {
        id: "compound-growth",
        title: "Power of Compound Growth",
        description: "How time and compounding can dramatically grow your wealth",
        estimatedReadTime: "4 min"
      }
    ]
  },
  {
    id: "accounts",
    title: "Investment Accounts in Canada",
    description: "Navigate the different types of registered and non-registered accounts",
    icon: PiggyBank,
    chapters: [
      {
        id: "tfsa-guide",
        title: "Tax-Free Savings Account (TFSA)",
        description: "Contribution limits, withdrawal rules, and optimal strategies",
        estimatedReadTime: "6 min"
      },
      {
        id: "rrsp-guide",
        title: "Registered Retirement Savings Plan (RRSP)",
        description: "Tax deductions, contribution limits, and retirement planning",
        estimatedReadTime: "7 min"
      },
      {
        id: "fhsa-guide",
        title: "First Home Savings Account (FHSA)",
        description: "Canada's newest account for first-time home buyers",
        estimatedReadTime: "5 min"
      },
      {
        id: "resp-guide",
        title: "Registered Education Savings Plan (RESP)",
        description: "Saving for your children's education with government grants",
        estimatedReadTime: "6 min"
      },
      {
        id: "rdsp-guide",
        title: "Registered Disability Savings Plan (RDSP)",
        description: "Long-term savings for people with disabilities",
        estimatedReadTime: "5 min"
      },
      {
        id: "non-registered",
        title: "Non-Registered Accounts",
        description: "Taxable investment accounts and when to use them",
        estimatedReadTime: "4 min"
      }
    ]
  },
  {
    id: "investments",
    title: "Types of Investments",
    description: "Understanding different investment vehicles and their characteristics",
    icon: TrendingUp,
    chapters: [
      {
        id: "mutual-funds",
        title: "Mutual Funds",
        description: "Professional management, diversification, and fee structures",
        estimatedReadTime: "6 min"
      },
      {
        id: "etfs",
        title: "Exchange-Traded Funds (ETFs)",
        description: "Low-cost, diversified investing with flexibility",
        estimatedReadTime: "5 min"
      },
      {
        id: "gics",
        title: "Guaranteed Investment Certificates (GICs)",
        description: "Safe, guaranteed returns for conservative investors",
        estimatedReadTime: "4 min"
      },
      {
        id: "stocks-bonds",
        title: "Stocks and Bonds",
        description: "Direct ownership in companies and government/corporate debt",
        estimatedReadTime: "7 min"
      }
    ]
  },
  {
    id: "planning",
    title: "Financial Planning Basics",
    description: "Building a solid foundation for your financial future",
    icon: Calculator,
    chapters: [
      {
        id: "emergency-fund",
        title: "Emergency Funds",
        description: "How much to save and where to keep your emergency money",
        estimatedReadTime: "4 min"
      },
      {
        id: "budgeting",
        title: "Budgeting and Cash Flow",
        description: "Managing your money effectively and finding room to invest",
        estimatedReadTime: "6 min"
      },
      {
        id: "goal-setting",
        title: "Setting Financial Goals",
        description: "SMART goals and creating a roadmap to financial success",
        estimatedReadTime: "5 min"
      },
      {
        id: "debt-vs-investing",
        title: "Debt vs Investing",
        description: "When to pay down debt vs when to invest",
        estimatedReadTime: "6 min"
      }
    ]
  },
  {
    id: "insurance",
    title: "Insurance Fundamentals",
    description: "Protecting your financial plan with appropriate insurance coverage",
    icon: Shield,
    chapters: [
      {
        id: "life-insurance",
        title: "Life Insurance Types",
        description: "Term vs permanent life insurance and coverage needs",
        estimatedReadTime: "7 min"
      },
      {
        id: "disability-insurance",
        title: "Critical Illness & Disability",
        description: "Protecting your income and covering major health events",
        estimatedReadTime: "6 min"
      },
      {
        id: "coverage-needs",
        title: "Determining Coverage Needs",
        description: "How much insurance do you actually need?",
        estimatedReadTime: "5 min"
      }
    ]
  },
  {
    id: "taxes-retirement",
    title: "Taxes & Retirement",
    description: "Understanding tax implications and retirement income strategies",
    icon: DollarSign,
    chapters: [
      {
        id: "investment-taxation",
        title: "Investment Taxation",
        description: "Capital gains, dividends, and interest income taxation",
        estimatedReadTime: "6 min"
      },
      {
        id: "rrsp-withdrawals",
        title: "RRSP Withdrawal Strategies",
        description: "Minimizing taxes when accessing your retirement savings",
        estimatedReadTime: "5 min"
      },
      {
        id: "cpp-oas",
        title: "CPP and OAS Benefits",
        description: "Government retirement benefits and optimization strategies",
        estimatedReadTime: "7 min"
      }
    ]
  },
  {
    id: "mindset",
    title: "Investor Mindset",
    description: "Developing the right psychological approach to investing",
    icon: Brain,
    chapters: [
      {
        id: "staying-invested",
        title: "Staying Invested Through Volatility",
        description: "Managing emotions and staying the course during market downturns",
        estimatedReadTime: "5 min"
      },
      {
        id: "risk-reward",
        title: "Understanding Risk vs Reward",
        description: "Balancing potential returns with acceptable risk levels",
        estimatedReadTime: "6 min"
      },
      {
        id: "common-mistakes",
        title: "Common Investment Mistakes",
        description: "Avoiding pitfalls that can derail your financial plan",
        estimatedReadTime: "7 min"
      }
    ]
  }
];

export default function EducationHome() {
  console.log('EducationHome rendering...');
  const router = useRouter();
  const [showUserInfoModal, setShowUserInfoModal] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);

  const handleUserInfoSubmit = () => {
    setShowUserInfoModal(false);
  };

  const navigateToChapter = (sectionId: string, chapterId: string) => {
    router.push(`/education/${sectionId}/${chapterId}` as any);
  };

  if (showUserInfoModal) {
    return (
      <UserInfoModal
        visible={showUserInfoModal}
        onSubmit={handleUserInfoSubmit}
        onClose={() => router.back()}
        title="Access Education Centre"
        subtitle="Please provide your contact information to access our comprehensive financial education resources."
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navigationContainer}>
          <Link href="/education" style={styles.navigationLink}>
            <Text style={styles.navigationText}>← Go to Education Index</Text>
          </Link>
        </View>

        <View style={styles.logoContainer}>
          {isLogoLoading && (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
          )}
          
          <Image
            source={{ 
              uri: "https://mclaughlinfinancial.ca/wp-content/uploads/2024/11/logo.png",
              cache: "force-cache" 
            }}
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
            <Text style={styles.fallbackText}>McLaughlin Financial Group</Text>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Education Centre</Text>
          <Text style={styles.subtitle}>
            Learn about investing, taxes, insurance, and financial planning through our comprehensive guides
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          {educationSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <View key={section.id} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <IconComponent size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.sectionHeaderContent}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionDescription}>{section.description}</Text>
                  </View>
                </View>

                <View style={styles.chaptersContainer}>
                  {section.chapters.map((chapter) => (
                    <TouchableOpacity
                      key={chapter.id}
                      style={styles.chapterCard}
                      onPress={() => navigateToChapter(section.id, chapter.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.chapterContent}>
                        <Text style={styles.chapterTitle}>{chapter.title}</Text>
                        <Text style={styles.chapterDescription}>{chapter.description}</Text>
                        <Text style={styles.readTime}>📖 {chapter.estimatedReadTime} read</Text>
                      </View>
                      <View style={styles.chapterChevron}>
                        <ChevronRight size={18} color={Colors.primary} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>Need Personal Guidance?</Text>
          <Text style={styles.footerText}>
            Our financial advisor is available for personalized consultations to help you apply these concepts to your specific situation.
          </Text>
          <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
            <Text style={styles.contactButtonText}>Schedule a Consultation</Text>
          </TouchableOpacity>
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
  navigationContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  navigationLink: {
    alignSelf: 'flex-start',
  },
  navigationText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
    position: "relative",
    height: 70,
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
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 36,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: "90%",
    fontWeight: "400",
  },
  sectionsContainer: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  sectionHeaderContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  chaptersContainer: {
    gap: 12,
  },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chapterContent: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  chapterDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  readTime: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "500",
  },
  chapterChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  footerContainer: {
    marginTop: 40,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: Colors.accentLight,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: "90%",
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  contactButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});