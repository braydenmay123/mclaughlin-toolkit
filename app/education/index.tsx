import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronRight, BookOpen, TrendingUp, Shield, Calculator, PiggyBank, Brain } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Chapter {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  chapters: Chapter[];
}

const educationSections: Section[] = [
  {
    id: 'foundations',
    title: 'Foundational Topics',
    icon: BookOpen,
    description: 'Essential concepts every investor should understand',
    chapters: [
      {
        id: 'investing-basics',
        title: 'Investing Basics',
        description: 'A gentle intro to risk, return, and diversification',
        slug: 'investing-basics',
        duration: '5 min read',
      },
      {
        id: 'compound-growth',
        title: 'Power of Compound Growth',
        description: 'See how starting early can dramatically impact your wealth',
        slug: 'compound-growth',
        duration: '4 min read',
      },
    ],
  },
  {
    id: 'accounts',
    title: 'Investment Accounts in Canada',
    icon: PiggyBank,
    description: 'Understanding your account options and their benefits',
    chapters: [
      {
        id: 'tfsa-basics',
        title: 'Understanding the TFSA',
        description: 'How it works, withdrawals, contribution room, and common mistakes',
        slug: 'tfsa-basics',
        duration: '6 min read',
      },
      {
        id: 'rrsp-basics',
        title: 'RRSP Basics',
        description: 'Tax-deferred growth, contribution room, and withdrawal strategies',
        slug: 'rrsp-basics',
        duration: '7 min read',
      },
      {
        id: 'fhsa-guide',
        title: 'FHSA — First Home Savings Account',
        description: 'How it works and how it ties in with the Home Buyers Plan',
        slug: 'fhsa-guide',
        duration: '5 min read',
      },
      {
        id: 'resp-guide',
        title: 'RESP — Saving for Education',
        description: 'Government grants, contribution strategies, and withdrawal rules',
        slug: 'resp-guide',
        duration: '6 min read',
      },
      {
        id: 'rdsp-guide',
        title: 'RDSP — Disability Savings',
        description: 'Who qualifies, government grants and bonds, and benefits',
        slug: 'rdsp-guide',
        duration: '5 min read',
      },
      {
        id: 'non-registered',
        title: 'Non-Registered Investment Accounts',
        description: 'When and why to use them after maximizing registered plans',
        slug: 'non-registered',
        duration: '4 min read',
      },
    ],
  },
  {
    id: 'investments',
    title: 'Types of Investments Explained',
    icon: TrendingUp,
    description: 'Understanding different investment vehicles and their characteristics',
    chapters: [
      {
        id: 'investment-types',
        title: 'Mutual Funds vs ETFs vs GICs vs Stocks vs Bonds',
        description: 'Simple pros and cons comparison of major investment types',
        slug: 'investment-types',
        duration: '8 min read',
      },
      {
        id: 'bonds-explained',
        title: 'How Bonds Work (Short & Sweet)',
        description: 'Understanding fixed income investments and their role in portfolios',
        slug: 'bonds-explained',
        duration: '5 min read',
      },
      {
        id: 'etf-basics',
        title: 'ETF Basics',
        description: 'Index investing, management expense ratios, and pros and cons',
        slug: 'etf-basics',
        duration: '6 min read',
      },
    ],
  },
  {
    id: 'planning',
    title: 'Financial Planning Basics',
    icon: Calculator,
    description: 'Building a solid financial foundation',
    chapters: [
      {
        id: 'emergency-funds',
        title: 'Emergency Funds — Why They Matter',
        description: 'How much you need and where to keep it',
        slug: 'emergency-funds',
        duration: '4 min read',
      },
      {
        id: 'budgeting',
        title: 'Budgeting & Cash Flow',
        description: 'Simple frameworks including the 50/30/20 rule',
        slug: 'budgeting',
        duration: '6 min read',
      },
      {
        id: 'financial-goals',
        title: 'Setting Financial Goals',
        description: 'Short, medium, and long-term goal setting strategies',
        slug: 'financial-goals',
        duration: '5 min read',
      },
      {
        id: 'debt-vs-investing',
        title: 'Debt vs. Investing',
        description: 'Rules of thumb and interest rate breakpoints for decision making',
        slug: 'debt-vs-investing',
        duration: '5 min read',
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance Fundamentals',
    icon: Shield,
    description: 'Protecting your financial future',
    chapters: [
      {
        id: 'life-insurance-types',
        title: 'Life Insurance Types — Term / Whole / Universal',
        description: 'Understanding the differences and when each makes sense',
        slug: 'life-insurance-types',
        duration: '7 min read',
      },
      {
        id: 'when-life-insurance',
        title: 'When & Why to Consider Life Insurance',
        description: 'Life situations that warrant life insurance coverage',
        slug: 'when-life-insurance',
        duration: '5 min read',
      },
      {
        id: 'disability-insurance',
        title: 'Critical Illness & Disability — What & Why',
        description: 'Protecting your income and covering major health expenses',
        slug: 'disability-insurance',
        duration: '6 min read',
      },
      {
        id: 'insurance-coverage',
        title: 'How Much Insurance Do You Need?',
        description: 'Simple frameworks for determining appropriate coverage levels',
        slug: 'insurance-coverage',
        duration: '5 min read',
      },
    ],
  },
  {
    id: 'mindset',
    title: 'Investor Mindset',
    icon: Brain,
    description: 'Developing the right psychological approach to investing',
    chapters: [
      {
        id: 'staying-invested',
        title: 'Staying Invested',
        description: 'The importance of discipline and long-term thinking',
        slug: 'staying-invested',
        duration: '4 min read',
      },
      {
        id: 'risk-vs-reward',
        title: 'Risk vs. Reward',
        description: 'Understanding the relationship and finding your comfort zone',
        slug: 'risk-vs-reward',
        duration: '5 min read',
      },
      {
        id: 'investing-mistakes',
        title: 'Common Investing Mistakes',
        description: 'Pitfalls to avoid and how to stay on track',
        slug: 'investing-mistakes',
        duration: '6 min read',
      },
    ],
  },
];

export default function EducationCentre() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['foundations']));
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [hasLogoError, setHasLogoError] = useState(false);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const navigateToChapter = (slug: string) => {
    router.push(`/education/${slug}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            Comprehensive financial education to help you make informed decisions
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          {educationSections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const IconComponent = section.icon;

            return (
              <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <View style={styles.sectionIconContainer}>
                      <IconComponent size={24} color={Colors.primary} />
                    </View>
                    <View style={styles.sectionHeaderText}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      <Text style={styles.sectionDescription}>{section.description}</Text>
                    </View>
                  </View>
                  <View style={styles.expandIcon}>
                    {isExpanded ? (
                      <ChevronDown size={20} color={Colors.textSecondary} />
                    ) : (
                      <ChevronRight size={20} color={Colors.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.chaptersContainer}>
                    {section.chapters.map((chapter) => (
                      <TouchableOpacity
                        key={chapter.id}
                        style={styles.chapterCard}
                        onPress={() => navigateToChapter(chapter.slug)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.chapterContent}>
                          <Text style={styles.chapterTitle}>{chapter.title}</Text>
                          <Text style={styles.chapterDescription}>{chapter.description}</Text>
                          <Text style={styles.chapterDuration}>{chapter.duration}</Text>
                        </View>
                        <View style={styles.chapterArrow}>
                          <ChevronRight size={16} color={Colors.primary} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Have questions about any of these topics? Our advisors are here to help.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/modal' as any)}
          >
            <Text style={styles.contactButtonText}>Contact an Advisor</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    position: 'relative',
    height: 70,
  },
  loader: {
    position: 'absolute',
    top: 25,
  },
  logo: {
    width: 260,
    height: 70,
  },
  hidden: {
    display: 'none',
  },
  fallbackText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: '90%',
    fontWeight: '400',
  },
  sectionsContainer: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  expandIcon: {
    marginLeft: 12,
  },
  chaptersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chapterContent: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  chapterDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  chapterDuration: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  chapterArrow: {
    marginLeft: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
    letterSpacing: -0.1,
  },
});