import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import SimpleLineChart from '@/components/charts/SimpleLineChart';

interface ChapterContent {
  title: string;
  slides: Slide[];
}

interface Slide {
  title: string;
  content: string[];
  chart?: {
    type: 'line';
    data: number[];
    labels?: string[];
    title?: string;
  };
}

const chapterData: Record<string, ChapterContent> = {
  'investing-basics': {
    title: 'Investing Basics',
    slides: [
      {
        title: 'What is Investing?',
        content: [
          'Investing is putting your money to work to generate returns over time.',
          'Unlike saving, investing involves some level of risk in exchange for the potential of higher returns.',
          'The goal is to grow your wealth faster than inflation erodes its purchasing power.',
        ],
      },
      {
        title: 'Risk vs. Return',
        content: [
          'Higher potential returns typically come with higher risk.',
          'Lower risk investments (like GICs) offer more predictable but lower returns.',
          'Higher risk investments (like stocks) can offer greater returns but with more volatility.',
          'The key is finding the right balance for your situation and timeline.',
        ],
      },
      {
        title: 'The Power of Diversification',
        content: [
          "Don't put all your eggs in one basket.",
          'Diversification means spreading your investments across different:',
          '• Asset classes (stocks, bonds, real estate)',
          '• Geographic regions (Canada, US, International)',
          '• Industries and company sizes',
          'This helps reduce overall portfolio risk.',
        ],
      },
      {
        title: 'Time is Your Friend',
        content: [
          'The longer your investment timeline, the more risk you can typically take.',
          'Short-term market volatility becomes less important over longer periods.',
          'Starting early gives compound growth more time to work its magic.',
          'Even small amounts invested regularly can grow significantly over time.',
        ],
      },
    ],
  },
  'compound-growth': {
    title: 'Power of Compound Growth',
    slides: [
      {
        title: 'What is Compound Growth?',
        content: [
          'Compound growth is earning returns on your returns.',
          'Your initial investment grows, and then you earn returns on that larger amount.',
          'Over time, this creates exponential rather than linear growth.',
          'Albert Einstein allegedly called it "the eighth wonder of the world."',
        ],
      },
      {
        title: 'Starting Early Makes a Huge Difference',
        content: [
          'The chart below shows two investors:',
          '• Sarah starts investing $200/month at age 25',
          '• Mike starts investing $200/month at age 35',
          'Both earn 7% annual returns and retire at 65.',
          'The 10-year head start makes an enormous difference!',
        ],
        chart: {
          type: 'line',
          data: [0, 50000, 120000, 210000, 320000, 450000, 600000, 780000, 980000],
          labels: ['25', '30', '35', '40', '45', '50', '55', '60', '65'],
          title: 'Sarah vs Mike: The Power of Starting Early',
        },
      },
      {
        title: "The Numbers Don't Lie",
        content: [
          'Sarah (started at 25):',
          '• Total contributions: $96,000 (40 years × $200 × 12)',
          '• Final value: ~$980,000',
          '',
          'Mike (started at 35):',
          '• Total contributions: $72,000 (30 years × $200 × 12)',
          '• Final value: ~$600,000',
          '',
          'Sarah contributed only $24,000 more but ended up with $380,000 more!',
        ],
      },
      {
        title: 'Key Takeaways',
        content: [
          'Time is more powerful than the amount you invest.',
          'Starting early, even with small amounts, beats starting late with larger amounts.',
          'Consistency matters - regular contributions help smooth out market volatility.',
          'The best time to start investing was yesterday. The second best time is today.',
        ],
      },
    ],
  },
};

export default function EducationChapter() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const chapter = slug ? chapterData[slug] : null;

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Chapter Not Found</Text>
          <Text style={styles.errorText}>
            The requested chapter could not be found.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentSlideData = chapter.slides[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === chapter.slides.length - 1;

  const goToNextSlide = () => {
    if (!isLastSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (!isFirstSlide) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{chapter.title}</Text>
          <Text style={styles.headerSubtitle}>
            {currentSlide + 1} of {chapter.slides.length}
          </Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentSlide + 1) / chapter.slides.length) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.progressDots}>
          {chapter.slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentSlide && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.slideTitle}>{currentSlideData.title}</Text>

        {currentSlideData.chart && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {currentSlideData.chart.title || 'Chart'}
            </Text>
            <SimpleLineChart
              data={currentSlideData.chart.data}
              labels={currentSlideData.chart.labels}
            />
          </View>
        )}

        <View style={styles.slideContent}>
          {currentSlideData.content.map((paragraph, index) => (
            <Text key={index} style={styles.slideText}>
              {paragraph}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, isFirstSlide && styles.navButtonDisabled]}
          onPress={goToPreviousSlide}
          disabled={isFirstSlide}
        >
          <ArrowLeft
            size={20}
            color={isFirstSlide ? Colors.textMuted : Colors.primary}
          />
          <Text
            style={[
              styles.navButtonText,
              isFirstSlide && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, isLastSlide && styles.navButtonDisabled]}
          onPress={isLastSlide ? () => router.back() : goToNextSlide}
        >
          <Text
            style={[
              styles.navButtonText,
              isLastSlide && styles.navButtonTextDisabled,
            ]}
          >
            {isLastSlide ? 'Complete' : 'Next'}
          </Text>
          <ArrowRight
            size={20}
            color={isLastSlide ? Colors.textMuted : Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.backgroundGray,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  chartContainer: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  slideContent: {
    gap: 16,
  },
  slideText: {
    fontSize: 17,
    lineHeight: 26,
    color: Colors.text,
    fontWeight: '400',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  navButtonTextDisabled: {
    color: Colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});