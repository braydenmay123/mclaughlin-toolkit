import React from "react";
import { View, StyleSheet, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Clock, BookOpen } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";

interface ChapterContent {
  title: string;
  estimatedReadTime: string;
  content: {
    type: 'text' | 'heading' | 'bullet' | 'chart';
    content: string;
  }[];
}

const chapterData: Record<string, ChapterContent> = {
  "investing-basics": {
    title: "Investing Basics",
    estimatedReadTime: "5 min",
    content: [
      { type: 'heading', content: 'What is Investing?' },
      { type: 'text', content: 'Investing is the act of putting your money to work with the goal of generating returns over time. Unlike saving, where your money sits in a bank account earning minimal interest, investing involves purchasing assets that have the potential to grow in value.' },
      
      { type: 'heading', content: 'Risk vs. Return' },
      { type: 'text', content: 'One of the fundamental principles of investing is the relationship between risk and return. Generally, investments with higher potential returns come with higher risk.' },
      { type: 'bullet', content: 'Low Risk: GICs, High-Interest Savings Accounts (1-3% annual return)' },
      { type: 'bullet', content: 'Medium Risk: Bonds, Balanced Mutual Funds (3-6% annual return)' },
      { type: 'bullet', content: 'High Risk: Individual Stocks, Growth Funds (6%+ potential annual return)' },
      
      { type: 'heading', content: 'Time Horizon Matters' },
      { type: 'text', content: 'Your investment time horizon - how long you plan to keep your money invested - is crucial in determining your investment strategy.' },
      { type: 'bullet', content: 'Short-term (1-3 years): Focus on capital preservation with GICs or high-interest savings' },
      { type: 'bullet', content: 'Medium-term (3-10 years): Balanced approach with bonds and conservative equity funds' },
      { type: 'bullet', content: 'Long-term (10+ years): Can take on more risk with growth-oriented investments' },
      
      { type: 'heading', content: 'Diversification' },
      { type: 'text', content: 'Don\'t put all your eggs in one basket. Diversification means spreading your investments across different asset classes, sectors, and geographic regions to reduce risk.' },
      
      { type: 'heading', content: 'Getting Started' },
      { type: 'text', content: 'Before you start investing, ensure you have:' },
      { type: 'bullet', content: 'An emergency fund (3-6 months of expenses)' },
      { type: 'bullet', content: 'High-interest debt paid off (credit cards, etc.)' },
      { type: 'bullet', content: 'Clear investment goals and timeline' },
      { type: 'bullet', content: 'Understanding of your risk tolerance' }
    ]
  },
  "compound-growth": {
    title: "Power of Compound Growth",
    estimatedReadTime: "4 min",
    content: [
      { type: 'heading', content: 'What is Compound Growth?' },
      { type: 'text', content: 'Compound growth occurs when your investment returns generate their own returns. It\'s earning money on your money, plus earning money on the money your money earned.' },
      
      { type: 'heading', content: 'The Magic of Time' },
      { type: 'text', content: 'The earlier you start investing, the more time compound growth has to work its magic. Consider these examples:' },
      { type: 'bullet', content: 'Sarah starts investing $200/month at age 25' },
      { type: 'bullet', content: 'Mike starts investing $400/month at age 35' },
      { type: 'bullet', content: 'Both earn 7% annual returns and retire at 65' },
      { type: 'text', content: 'Result: Sarah ends up with more money despite investing half as much per month, simply because she started 10 years earlier.' },
      
      { type: 'heading', content: 'The Rule of 72' },
      { type: 'text', content: 'A quick way to estimate how long it takes for your money to double: divide 72 by your expected annual return rate.' },
      { type: 'bullet', content: 'At 6% return: 72 ÷ 6 = 12 years to double' },
      { type: 'bullet', content: 'At 8% return: 72 ÷ 8 = 9 years to double' },
      { type: 'bullet', content: 'At 10% return: 72 ÷ 10 = 7.2 years to double' },
      
      { type: 'heading', content: 'Consistency is Key' },
      { type: 'text', content: 'Regular, consistent investing (dollar-cost averaging) helps smooth out market volatility and takes advantage of compound growth over time.' }
    ]
  }
};

export default function ChapterScreen() {
  const router = useRouter();
  const { section, chapter } = useLocalSearchParams();
  const [isLogoLoading, setIsLogoLoading] = React.useState(true);
  const [hasLogoError, setHasLogoError] = React.useState(false);

  const chapterContent = chapterData[chapter as string];

  if (!chapterContent) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Chapter not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderContent = (item: { type: string; content: string }, index: number) => {
    switch (item.type) {
      case 'heading':
        return (
          <Text key={index} style={styles.heading}>
            {item.content}
          </Text>
        );
      case 'text':
        return (
          <Text key={index} style={styles.bodyText}>
            {item.content}
          </Text>
        );
      case 'bullet':
        return (
          <View key={index} style={styles.bulletContainer}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item.content}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
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
          <Text style={styles.title}>{chapterContent.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{chapterContent.estimatedReadTime} read</Text>
            </View>
            <View style={styles.metaItem}>
              <BookOpen size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>Education Centre</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {chapterContent.content.map((item, index) => renderContent(item, index))}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>Need More Help?</Text>
          <Text style={styles.footerText}>
            Our financial advisor can help you apply these concepts to your specific situation.
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
    height: 50,
  },
  loader: {
    position: "absolute",
    top: 15,
  },
  logo: {
    width: 180,
    height: 50,
  },
  hidden: {
    display: "none",
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  metaContainer: {
    flexDirection: "row",
    gap: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary,
    marginTop: 32,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  bodyText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 20,
    fontWeight: "400",
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingLeft: 16,
  },
  bullet: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  footerContainer: {
    marginHorizontal: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  contactButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});