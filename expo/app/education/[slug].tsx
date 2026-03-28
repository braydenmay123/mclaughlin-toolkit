import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, ChevronLeft, Printer } from 'lucide-react-native';
import Colors from '@/constants/colors';
import EducationSlide, { EducationSlideData } from '@/components/EducationSlide';

interface ChapterContent {
  title: string;
  slides: EducationSlideData[];
}

const chapterData: Record<string, ChapterContent> = {
  'investing-basics': {
    title: 'Investing Basics',
    slides: [
      {
        title: 'Saving vs. Investing',
        content: [
          'Saving keeps money safe for short-term needs, usually in cash with low risk.',
          'Investing aims for higher long-term growth by accepting some risk and volatility.',
          'Use savings for emergencies and near-term goals; invest for goals 3–5+ years away.',
        ],
        placeholder: 'Graphic: Savings jar vs Investment tree',
      },
      {
        title: 'Risk and Return',
        content: [
          'Higher potential returns come with higher risk and bigger ups and downs.',
          'Match risk to your time horizon and comfort level to stay invested through cycles.',
          'Diversification reduces risk without giving up all the return potential.',
        ],
        placeholder: 'Graphic: Risk vs return ladder',
      },
      {
        title: 'Compounding Over Time',
        content: [
          'Reinvesting returns allows growth to build on itself year after year.',
          'Small, consistent contributions can snowball into large balances over decades.',
          'Time in the market usually beats trying to time the market.',
        ],
        placeholder: 'Graphic: Curved compounding line vs straight line',
      },
    ],
  },
  'compound-growth': {
    title: 'Power of Compound Growth',
    slides: [
      {
        title: 'What is Compound Growth?',
        content: [
          'Compound growth is earning returns on your returns, not just your original contribution.',
          'It turns steady saving into exponential growth over long periods.',
        ],
        placeholder: 'Graphic: Snowball rolling downhill',
      },
      {
        title: 'Starting Early Helps',
        content: [
          'Starting 10 years earlier can result in dramatically higher balances at retirement.',
          'Consistency matters more than finding the “perfect” time to invest.',
        ],
        chart: {
          type: 'line',
          data: [0, 50000, 120000, 210000, 320000, 450000, 600000, 780000, 980000],
          labels: ['25', '30', '35', '40', '45', '50', '55', '60', '65'],
          title: 'Starting Early vs Later',
        },
      },
      {
        title: 'Key Takeaways',
        content: [
          'Time and consistency are your superpowers.',
          'Automate contributions and stay invested through market cycles.',
        ],
      },
    ],
  },
  'tfsa-basics': {
    title: 'Understanding the TFSA',
    slides: [
      {
        title: 'TFSA Rules',
        content: [
          '18+ Canadians get yearly TFSA room; unused room carries forward.',
          'Growth and withdrawals are tax-free and do not count as income.',
          'Withdrawals add back to room the following calendar year.',
        ],
        placeholder: 'Graphic: TFSA calendar and arrows',
      },
      {
        title: 'What Can You Hold?',
        content: [
          'Eligible investments include ETFs, stocks, bonds, and GICs.',
          'Use TFSA for higher-growth assets if you can tolerate volatility.',
        ],
        placeholder: 'Icons: ETF, stock, bond, GIC',
      },
      {
        title: 'Tax-Free Withdrawals',
        content: [
          'Withdraw anytime without tax; ideal for medium-term goals and flexibility.',
          'Avoid over-contributing—excess amounts incur a monthly penalty.',
        ],
        placeholder: 'Graphic: Withdrawals added back next year',
      },
    ],
  },
  'rrsp-basics': {
    title: 'RRSP Basics',
    slides: [
      {
        title: 'Contributions',
        content: [
          'Room equals 18% of prior-year earned income up to a yearly limit.',
          'Contributions are tax-deductible and can reduce your tax bill.',
        ],
        placeholder: 'Graphic: RRSP tax receipt',
      },
      {
        title: 'Withdrawals',
        content: [
          'Withdrawals are taxable as income in the year you take them.',
          'At retirement, RRSP converts to RRIF; minimum withdrawals apply.',
        ],
        placeholder: 'Graphic: RRSP to RRIF timeline',
      },
      {
        title: 'Special Uses',
        content: [
          'Home Buyers’ Plan lets you withdraw for a first home and repay later.',
          'Lifelong Learning Plan supports education with repayment rules.',
        ],
        placeholder: 'Icons: House, Graduation cap',
      },
    ],
  },
  'fhsa-guide': {
    title: 'FHSA — First Home Savings Account',
    slides: [
      {
        title: 'Eligibility & Basics',
        content: [
          'For first-time homebuyers meeting residency rules.',
          'Contributions are tax-deductible; growth and qualifying withdrawals are tax-free.',
        ],
        placeholder: 'Graphic: FHSA badge',
      },
      {
        title: 'Pairing with RRSP HBP',
        content: [
          'You can combine FHSA withdrawals with RRSP Home Buyers’ Plan.',
          'This can significantly increase your down payment potential.',
        ],
        placeholder: 'Graphic: FHSA + RRSP HBP',
      },
    ],
  },
  'resp-guide': {
    title: 'RESP — Saving for Education',
    slides: [
      {
        title: 'Grants',
        content: [
          'CESG: 20% match on contributions up to yearly limits; lifetime grant caps apply.',
          'Additional provincial grants may be available depending on residence.',
        ],
        placeholder: 'Graphic: 20% match arrow',
      },
      {
        title: 'Rules & Contributions',
        content: [
          'RESPs can be open for many years; contributions are not tax-deductible.',
          'Investment growth is tax-deferred and taxed in the student’s hands at withdrawal.',
        ],
        placeholder: 'Graphic: RESP timeline',
      },
      {
        title: 'Withdrawals',
        content: [
          'Education Assistance Payments are taxable to the student, often at low rates.',
          'Plan for expected costs and coordinate with scholarships and loans.',
        ],
        placeholder: 'Icons: Books, tuition receipt',
      },
    ],
  },
  'rdsp-guide': {
    title: 'RDSP — Disability Savings',
    slides: [
      {
        title: 'Grants & Bonds',
        content: [
          'Government grants and bonds can significantly boost savings, subject to eligibility.',
          'Designed to support long-term financial security for persons with disabilities.',
        ],
        placeholder: 'Graphic: RDSP grant ladder',
      },
      {
        title: 'Withdrawals',
        content: [
          'Withdrawals have specific timing and repayment rules tied to government incentives.',
          'Plan contributions and withdrawals carefully to maximize benefits.',
        ],
        placeholder: 'Graphic: RDSP withdrawal rules',
      },
    ],
  },
  'non-registered': {
    title: 'Non-Registered Accounts',
    slides: [
      {
        title: 'When to Use',
        content: [
          'After maximizing TFSA and RRSP (and FHSA/RESP/RDSP as applicable).',
          'Useful for flexible investing without contribution limits.',
        ],
        placeholder: 'Graphic: Account stack order',
      },
      {
        title: 'Tax Treatment',
        content: [
          'You pay tax annually on interest, dividends, and realized capital gains.',
          'Keep good records for adjusted cost base and transactions.',
        ],
        placeholder: 'Icons: T-slips and calculator',
      },
    ],
  },
  'mutual-funds': {
    title: 'Mutual Funds',
    slides: [
      {
        title: 'What They Are',
        content: [
          'Professionally managed pools of investments you buy as units.',
          'Provide diversification and simplicity for many investors.',
        ],
        placeholder: 'Graphic: Pool of investors',
      },
      {
        title: 'Pros & Cons',
        content: [
          'Pros: Easy to buy, diversified, automatic rebalancing.',
          'Cons: MER fees can be higher; performance varies by manager.',
        ],
        placeholder: 'Graphic: Scale with pros and cons',
      },
    ],
  },
  'etf-basics': {
    title: 'ETFs',
    slides: [
      {
        title: 'What They Are',
        content: [
          'Exchange-traded funds typically track an index and trade like a stock.',
          'Often very low MERs with broad diversification.',
        ],
        placeholder: 'Graphic: Index puzzle pieces',
      },
      {
        title: 'Pros & Cons',
        content: [
          'Pros: Low cost, liquid, tax-efficient for many strategies.',
          'Cons: Bid/ask spreads; some complexity when building portfolios.',
        ],
        placeholder: 'Graphic: Pros/cons checklist',
      },
    ],
  },
  'gic-basics': {
    title: 'GICs',
    slides: [
      {
        title: 'How They Work',
        content: [
          'Guaranteed Investment Certificates pay a fixed rate for a set term.',
          'Principal is protected; ideal for short-term or safety-first goals.',
        ],
        placeholder: 'Graphic: Shield over cash',
      },
      {
        title: 'When They Fit',
        content: [
          'Use for emergency funds and near-term purchases where stability matters.',
          'Rates vary by term and issuer; consider CDIC coverage limits.',
        ],
        placeholder: 'Graphic: Calendar with maturity',
      },
    ],
  },
  'stocks-basics': {
    title: 'Stocks',
    slides: [
      {
        title: 'Ownership and Growth',
        content: [
          'Buying a stock means owning a piece of a company and its future profits.',
          'Historically offer higher long-term returns with higher volatility.',
        ],
        placeholder: 'Graphic: Stock certificate',
      },
      {
        title: 'Volatility & Diversification',
        content: [
          'Individual stocks can swing widely; diversify to reduce company-specific risk.',
          'Use ETFs or mutual funds to spread risk if stock picking isn’t your focus.',
        ],
        placeholder: 'Graphic: Diversified pie chart',
      },
      {
        title: 'Long-Term Mindset',
        content: [
          'Focus on decades, not days. Short-term drops are normal and expected.',
          'Align stock allocation with your time horizon and risk tolerance.',
        ],
        placeholder: 'Graphic: Mountain chart over decades',
      },
    ],
  },
  'bonds-explained': {
    title: 'Bonds',
    slides: [
      {
        title: 'What is a Bond?',
        content: [
          'A bond is a loan to a government or company that pays interest and returns principal at maturity.',
          'Bonds help stabilize portfolios and provide income.',
        ],
        placeholder: 'Graphic: Coupon payments',
      },
      {
        title: 'Interest Rates & Risk',
        content: [
          'When rates rise, existing bond prices often fall; duration measures sensitivity.',
          'Mix shorter and longer terms to balance risk and return.',
        ],
        placeholder: 'Graphic: See-saw of rates vs prices',
      },
    ],
  },
  'emergency-funds': {
    title: 'Emergency Funds',
    slides: [
      {
        title: 'How Much?',
        content: [
          'Target 3–6 months of essential expenses; more if income is variable.',
          'Start with a small target and build steadily.',
        ],
        placeholder: 'Graphic: 3–6 months gauge',
      },
      {
        title: 'Where to Keep It',
        content: [
          'Use a high-interest savings account or short-term GIC for safety and access.',
          'Keep it separate from daily spending to avoid temptation.',
        ],
        placeholder: 'Graphic: Savings bucket',
      },
    ],
  },
  budgeting: {
    title: 'Budgeting & Cash Flow',
    slides: [
      {
        title: 'Simple Frameworks',
        content: [
          '50/30/20 rule: 50% needs, 30% wants, 20% saving/debt repayment.',
          'Customize percentages to your situation; the point is clarity and consistency.',
        ],
        placeholder: 'Graphic: 50/30/20 pie',
      },
      {
        title: 'Track and Tweak',
        content: [
          'List income and expenses; look for quick wins you can automate.',
          'Review monthly and adjust to stay on course.',
        ],
        placeholder: 'Graphic: Monthly checklist',
      },
      {
        title: 'Build Buffers',
        content: [
          'Set aside sinking funds for irregular expenses like car repairs and gifts.',
          'This reduces reliance on credit cards and stress.',
        ],
        placeholder: 'Graphic: Sinking fund jars',
      },
    ],
  },
  'financial-goals': {
    title: 'Setting Financial Goals',
    slides: [
      {
        title: 'Define and Prioritize',
        content: [
          'Write down short-, medium-, and long-term goals with dollar amounts and dates.',
          'Prioritize by urgency and impact to focus your savings.',
        ],
        placeholder: 'Graphic: Goal ladder',
      },
      {
        title: 'Align Accounts & Investments',
        content: [
          'Match each goal to the right account (TFSA, RRSP, non-registered) and risk level.',
          'Automate transfers to make steady progress.',
        ],
        placeholder: 'Graphic: Goal-to-account map',
      },
    ],
  },
  'debt-vs-investing': {
    title: 'Debt vs. Investing',
    slides: [
      {
        title: 'Rules of Thumb',
        content: [
          'High-interest debt (e.g., credit cards) usually beats investment returns—pay it first.',
          'Consider splitting extra cash: some to debt, some to investing, to build momentum.',
        ],
        placeholder: 'Graphic: Debt payoff vs invest scale',
      },
      {
        title: 'Compare Rates and Risk',
        content: [
          'If your after-tax expected return is lower than your interest rate, prioritize debt.',
          'Emergency fund and employer matches can justify investing sooner.',
        ],
        placeholder: 'Graphic: Interest vs return chart',
      },
    ],
  },
  'life-insurance-types': {
    title: 'Life Insurance Types',
    slides: [
      {
        title: 'Term Insurance',
        content: [
          'Covers you for a set period (e.g., 10, 20, 30 years) with affordable premiums.',
          'Great for income replacement while raising a family or paying a mortgage.',
        ],
        placeholder: 'Graphic: Term timeline',
      },
      {
        title: 'Whole Life',
        content: [
          'Permanent coverage with a cash value component and level premiums.',
          'Useful for estate planning and lifelong needs; typically higher cost.',
        ],
        placeholder: 'Graphic: Shield + cash value',
      },
      {
        title: 'Universal Life',
        content: [
          'Flexible premiums and investment options inside the policy.',
          'Suited for advanced planning with advisor guidance.',
        ],
        placeholder: 'Graphic: Flexible sliders',
      },
    ],
  },
  'why-insurance': {
    title: 'Why Insurance',
    slides: [
      {
        title: 'Protect What Matters',
        content: [
          'Insurance replaces income, pays debts, and protects family goals if the unexpected happens.',
          'It turns big, unpredictable risks into manageable monthly costs.',
        ],
        placeholder: 'Graphic: Family umbrella',
      },
      {
        title: 'Timing',
        content: [
          'Get coverage when others rely on your income or you have significant debts.',
          'Coverage costs are generally lower when you are younger and healthier.',
        ],
        placeholder: 'Graphic: Life stages',
      },
    ],
  },
  'ci-di': {
    title: 'Critical Illness & Disability',
    slides: [
      {
        title: 'What They Cover',
        content: [
          'Critical Illness pays a lump sum after diagnosis of covered conditions.',
          'Disability Insurance replaces a portion of income if you cannot work.',
        ],
        placeholder: 'Graphic: CI lump sum, DI income stream',
      },
      {
        title: 'Why It Matters',
        content: [
          'A health event can derail savings; coverage keeps your plan on track.',
          'Coordinate with workplace benefits and fill gaps as needed.',
        ],
        placeholder: 'Graphic: Bridge over gap',
      },
    ],
  },
  'insurance-coverage': {
    title: 'How Much Insurance Do You Need?',
    slides: [
      {
        title: 'Coverage Frameworks',
        content: [
          'Add up debts, final expenses, income replacement years, and education costs.',
          'Subtract existing assets and benefits to estimate the gap to insure.',
        ],
        placeholder: 'Graphic: Coverage formula',
      },
      {
        title: 'Right-Sizing',
        content: [
          'Start with affordable term and revisit as life changes (marriage, kids, mortgage).',
          'Mix term and permanent if you have lifelong needs and estate goals.',
        ],
        placeholder: 'Graphic: Policy mix bars',
      },
    ],
  },
  'investment-taxation': {
    title: 'Capital Gains, Dividends, Interest',
    slides: [
      {
        title: 'Capital Gains',
        content: [
          'Only 50% of capital gains are taxable in Canada when realized.',
          'Tax timing is within your control—consider holding for the long term.',
        ],
        placeholder: 'Graphic: Purchase vs sale timeline',
      },
      {
        title: 'Dividends',
        content: [
          'Eligible Canadian dividends receive a tax credit that can lower taxes.',
          'Foreign dividends are typically fully taxable and may face withholding tax.',
        ],
        placeholder: 'Graphic: Dividend tax credit badge',
      },
      {
        title: 'Interest',
        content: [
          'Interest income is fully taxable at your marginal rate in non-registered accounts.',
          'Consider holding interest-bearing assets in registered accounts when possible.',
        ],
        placeholder: 'Graphic: Interest slip T5',
      },
    ],
  },
  'retirement-basics': {
    title: 'Retirement Basics',
    slides: [
      {
        title: 'How Much Do You Need?',
        content: [
          'Estimate annual spending, subtract government and employer pensions, and fill the gap with savings.',
          'A common rule: plan for 70–80% of pre-retirement income, adjusted to your lifestyle.',
        ],
        placeholder: 'Graphic: Retirement budget worksheet',
      },
      {
        title: 'Withdrawal Order',
        content: [
          'Coordinate RRSP/RRIF, TFSA, and non-registered withdrawals for tax efficiency.',
          'Delay CPP/OAS can increase lifetime benefits; run scenarios with an advisor.',
        ],
        placeholder: 'Graphic: Account withdrawal order',
      },
    ],
  },
  'cpp-oas': {
    title: 'CPP & OAS',
    slides: [
      {
        title: 'What They Are',
        content: [
          'CPP is an earnings-based pension; OAS is a residency-based benefit.',
          'Both can be taken earlier or later, with adjustments to amounts.',
        ],
        placeholder: 'Graphic: CPP and OAS logos',
      },
      {
        title: 'Timing & Clawbacks',
        content: [
          'Delaying to age 70 increases payments but must fit your plan and health.',
          'OAS may be clawed back above certain income thresholds; plan withdrawals accordingly.',
        ],
        placeholder: 'Graphic: OAS clawback meter',
      },
    ],
  },
  'staying-invested': {
    title: 'Staying Invested',
    slides: [
      {
        title: 'Discipline Wins',
        content: [
          'Missing just a few best days can seriously reduce long-term returns.',
          'Create a plan you can stick with during market swings.',
        ],
        placeholder: 'Graphic: Best days bar chart placeholder',
      },
      {
        title: 'Focus on Process',
        content: [
          'Automate contributions and rebalancing to remove emotion.',
          'Review annually, not daily; zoom out to the long-term trend.',
        ],
        placeholder: 'Graphic: Calendar with auto transfer',
      },
    ],
  },
  'risk-vs-reward': {
    title: 'Risk vs Reward',
    slides: [
      {
        title: 'Know Your Comfort Zone',
        content: [
          'Use risk questionnaires and historical scenarios to find a suitable mix.',
          'The right portfolio is one you can hold through tough markets.',
        ],
        placeholder: 'Graphic: Risk meter',
      },
      {
        title: 'Match Risk to Timeline',
        content: [
          'More stocks for long-term goals, more bonds/cash for short-term goals.',
          'Diversification across regions and sectors reduces single-risk exposure.',
        ],
        placeholder: 'Graphic: Glide path visual',
      },
    ],
  },
  'investing-mistakes': {
    title: 'Common Investing Mistakes',
    slides: [
      {
        title: 'Behavioral Pitfalls',
        content: [
          'Chasing past winners, panic selling, and trying to time the market hurt results.',
          'Set rules ahead of time to avoid emotional decisions.',
        ],
        placeholder: 'Graphic: Fear and greed pendulum',
      },
      {
        title: 'Cost and Complexity',
        content: [
          'High fees compound against you; prefer simple, low-cost, diversified approaches.',
          'Too many overlapping funds can dilute performance and add confusion.',
        ],
        placeholder: 'Graphic: Fee drag illustration',
      },
    ],
  },
};

export default function EducationChapter() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const slideTitleRef = useRef<any>(null);

  const chapter = slug ? chapterData[slug] : null;

  useEffect(() => {
    setCurrentSlide(0);
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setCurrentSlide((s) => {
            const next = Math.min((chapter?.slides.length ?? 1) - 1, s + 1);
            return next;
          });
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setCurrentSlide((s) => Math.max(0, s - 1));
        } else if (e.key === 'Escape') {
          e.preventDefault();
          router.back();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    return () => {};
  }, [router, chapter?.slides.length]);

  useEffect(() => {
    try {
      // @ts-ignore
      slideTitleRef.current?.focus?.();
    } catch {}
  }, [currentSlide]);

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
            accessibilityRole="button"
            accessibilityLabel="Go back"
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
  const progressPercent = ((currentSlide + 1) / chapter.slides.length) * 100;

  const goToNextSlide = () => {
    if (!isLastSlide) {
      setCurrentSlide((s) => s + 1);
    } else {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && slug) {
        try { localStorage.setItem(`edu_completed_${slug}`, '1'); } catch {}
      }
      router.back();
    }
  };

  const goToPreviousSlide = () => {
    if (!isFirstSlide) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const handlePrint = () => {
    if (Platform.OS === 'web') {
      try { window.print(); return; } catch {}
    }
    if (Platform.OS !== 'web') {
      Alert.alert('Export', 'Export to PDF coming soon');
    } else {
      console.log('Export to PDF coming soon');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          testID="header-back"
          accessibilityRole="button"
          accessibilityLabel="Back to Education menu"
        >
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} accessibilityRole="header">{chapter.title}</Text>
          <Text style={styles.headerSubtitle}>
            {currentSlide + 1} of {chapter.slides.length}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handlePrint}
          style={styles.headerPrint}
          accessibilityRole="button"
          accessibilityLabel="Print or export topic"
          testID="print-topic"
        >
          <Printer size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
            accessibilityRole="progressbar"
            accessibilityValue={{ now: Math.round(progressPercent), min: 0, max: 100 }}
            testID="progress-fill"
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
        <EducationSlide slide={currentSlideData} testID="education-slide" titleRef={slideTitleRef} />
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, isFirstSlide && styles.navButtonDisabled]}
          onPress={goToPreviousSlide}
          accessibilityRole="button"
          accessibilityLabel="Previous slide"
          disabled={isFirstSlide}
          testID="nav-prev"
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
          style={[styles.navButton, isLastSlide && styles.navButtonPrimary]}
          onPress={goToNextSlide}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Return to menu' : 'Next slide'}
          testID="nav-next"
        >
          <Text
            style={[
              styles.navButtonText,
              isLastSlide && styles.navButtonTextPrimary,
            ]}
          >
            {isLastSlide ? 'Return to Menu' : 'Next'}
          </Text>
          <ArrowRight
            size={20}
            color={isLastSlide ? Colors.background : Colors.primary}
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
  headerPrint: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  navButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  navButtonTextPrimary: {
    color: Colors.background,
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