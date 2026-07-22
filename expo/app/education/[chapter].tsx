import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  Pressable,
  Dimensions,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Lightbulb,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import {
  getCompletedChapters,
  markChapterComplete,
  markChapterIncomplete,
} from "@/utils/educationProgress";

interface Slide {
  title: string;
  content: string[];
  takeaway?: string;
  chart?: {
    type: "line";
    data: number[];
    labels?: string[];
    title?: string;
  };
}

interface ChapterContent {
  title: string;
  section: string;
  readTime: string;
  slides: Slide[];
}

const CHAPTER_DATA: Record<string, ChapterContent> = {
  "investing-basics": {
    title: "Investing Basics",
    section: "Foundational Topics",
    readTime: "5 min",
    slides: [
      {
        title: "Saving vs. Investing",
        content: [
          "Saving keeps money safe for short-term needs, usually in cash with low risk.",
          "Investing aims for higher long-term growth by accepting some risk and volatility.",
          "Use savings for emergencies and near-term goals; invest for goals 3–5+ years away.",
        ],
        takeaway: "Match the tool to the timeline: save for short-term, invest for long-term.",
      },
      {
        title: "Risk and Return",
        content: [
          "Higher potential returns come with higher risk and bigger ups and downs.",
          "Match risk to your time horizon and comfort level to stay invested through cycles.",
          "Diversification reduces risk without giving up all the return potential.",
        ],
        takeaway: "Risk and return travel together — diversify to manage both.",
      },
      {
        title: "Compounding Over Time",
        content: [
          "Reinvesting returns allows growth to build on itself year after year.",
          "Small, consistent contributions can snowball into large balances over decades.",
          "Time in the market usually beats trying to time the market.",
        ],
        takeaway: "Start early, stay consistent — time is your biggest advantage.",
      },
    ],
  },
  "compound-growth": {
    title: "Power of Compound Growth",
    section: "Foundational Topics",
    readTime: "4 min",
    slides: [
      {
        title: "What is Compound Growth?",
        content: [
          "Compound growth is earning returns on your returns, not just your original contribution.",
          "It turns steady saving into exponential growth over long periods.",
        ],
        takeaway: "Earnings on earnings — the snowball effect in action.",
      },
      {
        title: "Starting Early Helps",
        content: [
          "Starting 10 years earlier can result in dramatically higher balances at retirement.",
          "Consistency matters more than finding the \"perfect\" time to invest.",
        ],
        takeaway: "Time in the market beats timing the market.",
      },
      {
        title: "The Rule of 72",
        content: [
          "A quick way to estimate how long it takes for your money to double: divide 72 by your expected annual return rate.",
          "At 6% return: 72 ÷ 6 = 12 years to double.",
          "At 8% return: 72 ÷ 8 = 9 years to double.",
        ],
        takeaway: "The Rule of 72 shows why even small return differences matter over time.",
      },
    ],
  },
  "risk-vs-reward": {
    title: "Risk vs Reward",
    section: "Foundational Topics",
    readTime: "6 min",
    slides: [
      {
        title: "Know Your Comfort Zone",
        content: [
          "Use risk questionnaires and historical scenarios to find a suitable mix.",
          "The right portfolio is one you can hold through tough markets.",
        ],
        takeaway: "The best portfolio is one you won't panic-sell.",
      },
      {
        title: "Match Risk to Timeline",
        content: [
          "More stocks for long-term goals, more bonds/cash for short-term goals.",
          "Diversification across regions and sectors reduces single-risk exposure.",
        ],
        takeaway: "Long horizon = growth focus. Short horizon = stability focus.",
      },
    ],
  },
  "staying-invested": {
    title: "Staying Invested",
    section: "Foundational Topics",
    readTime: "5 min",
    slides: [
      {
        title: "Discipline Wins",
        content: [
          "Missing just a few of the market's best days can seriously reduce long-term returns.",
          "Create a plan you can stick with during market swings.",
        ],
        takeaway: "Being out of the market on its best days is costly — stay the course.",
      },
      {
        title: "Focus on Process",
        content: [
          "Automate contributions and rebalancing to remove emotion.",
          "Review annually, not daily; zoom out to the long-term trend.",
        ],
        takeaway: "Automate the boring parts — let the process do the heavy lifting.",
      },
    ],
  },
  "investing-mistakes": {
    title: "Common Investing Mistakes",
    section: "Foundational Topics",
    readTime: "7 min",
    slides: [
      {
        title: "Behavioral Pitfalls",
        content: [
          "Chasing past winners, panic selling, and trying to time the market hurt results.",
          "Set rules ahead of time to avoid emotional decisions.",
        ],
        takeaway: "Decide your strategy in calm moments — not during market panic.",
      },
      {
        title: "Cost and Complexity",
        content: [
          "High fees compound against you; prefer simple, low-cost, diversified approaches.",
          "Too many overlapping funds can dilute performance and add confusion.",
        ],
        takeaway: "Simple, low-cost, diversified — boring is beautiful in investing.",
      },
    ],
  },
  "tfsa-basics": {
    title: "Understanding the TFSA",
    section: "Investment Accounts",
    readTime: "6 min",
    slides: [
      {
        title: "TFSA Rules",
        content: [
          "18+ Canadians get yearly TFSA room; unused room carries forward.",
          "Growth and withdrawals are tax-free and do not count as income.",
          "Withdrawals add back to room the following calendar year.",
        ],
        takeaway: "Tax-free growth, tax-free withdrawals — incredibly flexible.",
      },
      {
        title: "What Can You Hold?",
        content: [
          "Eligible investments include ETFs, stocks, bonds, and GICs.",
          "Use TFSA for higher-growth assets if you can tolerate volatility.",
        ],
        takeaway: "Don't waste TFSA room on cash — hold growth assets here.",
      },
      {
        title: "Tax-Free Withdrawals",
        content: [
          "Withdraw anytime without tax; ideal for medium-term goals and flexibility.",
          "Avoid over-contributing — excess amounts incur a monthly penalty.",
        ],
        takeaway: "Track your contribution room carefully to avoid penalties.",
      },
    ],
  },
  "rrsp-basics": {
    title: "RRSP Basics",
    section: "Investment Accounts",
    readTime: "7 min",
    slides: [
      {
        title: "Contributions",
        content: [
          "Room equals 18% of prior-year earned income up to a yearly limit.",
          "Contributions are tax-deductible and can reduce your tax bill.",
        ],
        takeaway: "RRSP contributions reduce your taxable income today.",
      },
      {
        title: "Withdrawals",
        content: [
          "Withdrawals are taxable as income in the year you take them.",
          "At retirement, RRSP converts to RRIF; minimum withdrawals apply.",
        ],
        takeaway: "Withdrawals are taxed — plan the timing strategically.",
      },
      {
        title: "Special Uses",
        content: [
          "Home Buyers' Plan lets you withdraw for a first home and repay later.",
          "Lifelong Learning Plan supports education with repayment rules.",
        ],
        takeaway: "RRSP can help with a first home or education — not just retirement.",
      },
    ],
  },
  "fhsa-guide": {
    title: "FHSA — First Home Savings Account",
    section: "Investment Accounts",
    readTime: "5 min",
    slides: [
      {
        title: "Eligibility & Basics",
        content: [
          "For first-time homebuyers meeting residency rules.",
          "Contributions are tax-deductible; growth and qualifying withdrawals are tax-free.",
        ],
        takeaway: "FHSA combines the best of TFSA and RRSP for first homes.",
      },
      {
        title: "Pairing with RRSP HBP",
        content: [
          "You can combine FHSA withdrawals with RRSP Home Buyers' Plan.",
          "This can significantly increase your down payment potential.",
        ],
        takeaway: "Stack FHSA + HBP for a bigger down payment.",
      },
    ],
  },
  "resp-guide": {
    title: "RESP — Saving for Education",
    section: "Investment Accounts",
    readTime: "6 min",
    slides: [
      {
        title: "Grants",
        content: [
          "CESG: 20% match on contributions up to yearly limits; lifetime grant caps apply.",
          "Additional provincial grants may be available depending on residence.",
        ],
        takeaway: "Free government money — the CESG 20% match is hard to beat.",
      },
      {
        title: "Rules & Contributions",
        content: [
          "RESPs can be open for many years; contributions are not tax-deductible.",
          "Investment growth is tax-deferred and taxed in the student's hands at withdrawal.",
        ],
        takeaway: "Growth compounds tax-deferred until the student withdraws.",
      },
      {
        title: "Withdrawals",
        content: [
          "Education Assistance Payments are taxable to the student, often at low rates.",
          "Plan for expected costs and coordinate with scholarships and loans.",
        ],
        takeaway: "Withdrawals are taxed in the student's hands — usually at a low rate.",
      },
    ],
  },
  "rdsp-guide": {
    title: "RDSP — Disability Savings",
    section: "Investment Accounts",
    readTime: "5 min",
    slides: [
      {
        title: "Grants & Bonds",
        content: [
          "Government grants and bonds can significantly boost savings, subject to eligibility.",
          "Designed to support long-term financial security for persons with disabilities.",
        ],
        takeaway: "Grants and bonds can multiply your contributions dramatically.",
      },
      {
        title: "Withdrawals",
        content: [
          "Withdrawals have specific timing and repayment rules tied to government incentives.",
          "Plan contributions and withdrawals carefully to maximize benefits.",
        ],
        takeaway: "Withdrawals have rules — plan ahead to keep the grants.",
      },
    ],
  },
  "non-registered": {
    title: "Non-Registered Accounts",
    section: "Investment Accounts",
    readTime: "4 min",
    slides: [
      {
        title: "When to Use",
        content: [
          "After maximizing TFSA and RRSP (and FHSA/RESP/RDSP as applicable).",
          "Useful for flexible investing without contribution limits.",
        ],
        takeaway: "Fill registered accounts first, then use non-registered for the rest.",
      },
      {
        title: "Tax Treatment",
        content: [
          "You pay tax annually on interest, dividends, and realized capital gains.",
          "Keep good records for adjusted cost base and transactions.",
        ],
        takeaway: "Track your cost base carefully — you'll need it at tax time.",
      },
    ],
  },
  "mutual-funds": {
    title: "Mutual Funds",
    section: "Types of Investments",
    readTime: "6 min",
    slides: [
      {
        title: "What They Are",
        content: [
          "Professionally managed pools of investments you buy as units.",
          "Provide diversification and simplicity for many investors.",
        ],
        takeaway: "Diversification and simplicity in a single purchase.",
      },
      {
        title: "Pros & Cons",
        content: [
          "Pros: Easy to buy, diversified, automatic rebalancing.",
          "Cons: MER fees can be higher; performance varies by manager.",
        ],
        takeaway: "Watch the MER — fees are the only thing you can control.",
      },
    ],
  },
  "etf-basics": {
    title: "ETFs",
    section: "Types of Investments",
    readTime: "5 min",
    slides: [
      {
        title: "What They Are",
        content: [
          "Exchange-traded funds typically track an index and trade like a stock.",
          "Often very low MERs with broad diversification.",
        ],
        takeaway: "Index ETFs = broad diversification at very low cost.",
      },
      {
        title: "Pros & Cons",
        content: [
          "Pros: Low cost, liquid, tax-efficient for many strategies.",
          "Cons: Bid/ask spreads; some complexity when building portfolios.",
        ],
        takeaway: "Low cost + tax-efficient — a favourite for DIY investors.",
      },
    ],
  },
  "gic-basics": {
    title: "GICs",
    section: "Types of Investments",
    readTime: "4 min",
    slides: [
      {
        title: "How They Work",
        content: [
          "Guaranteed Investment Certificates pay a fixed rate for a set term.",
          "Principal is protected; ideal for short-term or safety-first goals.",
        ],
        takeaway: "Guaranteed principal + known return = peace of mind.",
      },
      {
        title: "When They Fit",
        content: [
          "Use for emergency funds and near-term purchases where stability matters.",
          "Rates vary by term and issuer; consider CDIC coverage limits.",
        ],
        takeaway: "Perfect for money you can't afford to lose.",
      },
    ],
  },
  "stocks-basics": {
    title: "Stocks",
    section: "Types of Investments",
    readTime: "7 min",
    slides: [
      {
        title: "Ownership and Growth",
        content: [
          "Buying a stock means owning a piece of a company and its future profits.",
          "Historically offer higher long-term returns with higher volatility.",
        ],
        takeaway: "Stocks = ownership. Long-term returns are high, but so is volatility.",
      },
      {
        title: "Volatility & Diversification",
        content: [
          "Individual stocks can swing widely; diversify to reduce company-specific risk.",
          "Use ETFs or mutual funds to spread risk if stock picking isn't your focus.",
        ],
        takeaway: "Don't bet it all on one company — diversify.",
      },
      {
        title: "Long-Term Mindset",
        content: [
          "Focus on decades, not days. Short-term drops are normal and expected.",
          "Align stock allocation with your time horizon and risk tolerance.",
        ],
        takeaway: "Zoom out — decades, not days.",
      },
    ],
  },
  "bonds-explained": {
    title: "Bonds",
    section: "Types of Investments",
    readTime: "6 min",
    slides: [
      {
        title: "What is a Bond?",
        content: [
          "A bond is a loan to a government or company that pays interest and returns principal at maturity.",
          "Bonds help stabilize portfolios and provide income.",
        ],
        takeaway: "Bonds = loans you make to governments or companies, paid back with interest.",
      },
      {
        title: "Interest Rates & Risk",
        content: [
          "When rates rise, existing bond prices often fall; duration measures sensitivity.",
          "Mix shorter and longer terms to balance risk and return.",
        ],
        takeaway: "Bond prices move opposite to interest rates — know the duration.",
      },
    ],
  },
  "emergency-funds": {
    title: "Emergency Funds",
    section: "Financial Planning",
    readTime: "4 min",
    slides: [
      {
        title: "How Much?",
        content: [
          "Target 3–6 months of essential expenses; more if income is variable.",
          "Start with a small target and build steadily.",
        ],
        takeaway: "3–6 months of expenses is the target — start small if you need to.",
      },
      {
        title: "Where to Keep It",
        content: [
          "Use a high-interest savings account or short-term GIC for safety and access.",
          "Keep it separate from daily spending to avoid temptation.",
        ],
        takeaway: "Safe, liquid, and separate from spending money.",
      },
    ],
  },
  budgeting: {
    title: "Budgeting & Cash Flow",
    section: "Financial Planning",
    readTime: "6 min",
    slides: [
      {
        title: "Simple Frameworks",
        content: [
          "50/30/20 rule: 50% needs, 30% wants, 20% saving/debt repayment.",
          "Customize percentages to your situation; the point is clarity and consistency.",
        ],
        takeaway: "50/30/20 is a starting point — adjust to your life.",
      },
      {
        title: "Track and Tweak",
        content: [
          "List income and expenses; look for quick wins you can automate.",
          "Review monthly and adjust to stay on course.",
        ],
        takeaway: "Awareness is the first step — track, then automate.",
      },
      {
        title: "Build Buffers",
        content: [
          "Set aside sinking funds for irregular expenses like car repairs and gifts.",
          "This reduces reliance on credit cards and stress.",
        ],
        takeaway: "Sinking funds for irregular costs = less credit card stress.",
      },
    ],
  },
  "financial-goals": {
    title: "Setting Financial Goals",
    section: "Financial Planning",
    readTime: "5 min",
    slides: [
      {
        title: "Define and Prioritize",
        content: [
          "Write down short-, medium-, and long-term goals with dollar amounts and dates.",
          "Prioritize by urgency and impact to focus your savings.",
        ],
        takeaway: "Written goals with dates and amounts are far more likely to be reached.",
      },
      {
        title: "Align Accounts & Investments",
        content: [
          "Match each goal to the right account (TFSA, RRSP, non-registered) and risk level.",
          "Automate transfers to make steady progress.",
        ],
        takeaway: "Right account, right risk, automated — set it and forget it.",
      },
    ],
  },
  "debt-vs-investing": {
    title: "Debt vs. Investing",
    section: "Financial Planning",
    readTime: "6 min",
    slides: [
      {
        title: "Rules of Thumb",
        content: [
          "High-interest debt (e.g., credit cards) usually beats investment returns — pay it first.",
          "Consider splitting extra cash: some to debt, some to investing, to build momentum.",
        ],
        takeaway: "Kill high-interest debt first — it's a guaranteed negative return.",
      },
      {
        title: "Compare Rates and Risk",
        content: [
          "If your after-tax expected return is lower than your interest rate, prioritize debt.",
          "Emergency fund and employer matches can justify investing sooner.",
        ],
        takeaway: "Compare the debt rate vs expected return — pick the bigger winner.",
      },
    ],
  },
  "why-insurance": {
    title: "Why Insurance Matters",
    section: "Insurance Fundamentals",
    readTime: "5 min",
    slides: [
      {
        title: "Protect What Matters",
        content: [
          "Insurance replaces income, pays debts, and protects family goals if the unexpected happens.",
          "It turns big, unpredictable risks into manageable monthly costs.",
        ],
        takeaway: "Insurance converts catastrophic risk into manageable monthly costs.",
      },
      {
        title: "Timing",
        content: [
          "Get coverage when others rely on your income or you have significant debts.",
          "Coverage costs are generally lower when you are younger and healthier.",
        ],
        takeaway: "Buy insurance when you're young and healthy — it's cheaper.",
      },
    ],
  },
  "life-insurance-types": {
    title: "Life Insurance Types",
    section: "Insurance Fundamentals",
    readTime: "7 min",
    slides: [
      {
        title: "Term Insurance",
        content: [
          "Covers you for a set period (e.g., 10, 20, 30 years) with affordable premiums.",
          "Great for income replacement while raising a family or paying a mortgage.",
        ],
        takeaway: "Term = affordable coverage for your highest-need years.",
      },
      {
        title: "Whole Life",
        content: [
          "Permanent coverage with a cash value component and level premiums.",
          "Useful for estate planning and lifelong needs; typically higher cost.",
        ],
        takeaway: "Whole life = lifelong coverage + cash value, at a higher price.",
      },
      {
        title: "Universal Life",
        content: [
          "Flexible premiums and investment options inside the policy.",
          "Suited for advanced planning with advisor guidance.",
        ],
        takeaway: "Universal life = flexibility + investment — get advice first.",
      },
    ],
  },
  "ci-di": {
    title: "Critical Illness & Disability",
    section: "Insurance Fundamentals",
    readTime: "6 min",
    slides: [
      {
        title: "What They Cover",
        content: [
          "Critical Illness pays a lump sum after diagnosis of covered conditions.",
          "Disability Insurance replaces a portion of income if you cannot work.",
        ],
        takeaway: "CI = lump sum on diagnosis. DI = income when you can't work.",
      },
      {
        title: "Why It Matters",
        content: [
          "A health event can derail savings; coverage keeps your plan on track.",
          "Coordinate with workplace benefits and fill gaps as needed.",
        ],
        takeaway: "Health shocks derail plans — insurance keeps them on track.",
      },
    ],
  },
  "insurance-coverage": {
    title: "How Much Insurance Do You Need?",
    section: "Insurance Fundamentals",
    readTime: "5 min",
    slides: [
      {
        title: "Coverage Frameworks",
        content: [
          "Add up debts, final expenses, income replacement years, and education costs.",
          "Subtract existing assets and benefits to estimate the gap to insure.",
        ],
        takeaway: "Coverage = needs minus existing assets — close the gap.",
      },
      {
        title: "Right-Sizing",
        content: [
          "Start with affordable term and revisit as life changes (marriage, kids, mortgage).",
          "Mix term and permanent if you have lifelong needs and estate goals.",
        ],
        takeaway: "Review coverage at every major life event.",
      },
    ],
  },
  "investment-taxation": {
    title: "Capital Gains, Dividends, Interest",
    section: "Taxes & Retirement",
    readTime: "6 min",
    slides: [
      {
        title: "Capital Gains",
        content: [
          "Only 50% of capital gains are taxable in Canada when realized.",
          "Tax timing is within your control — consider holding for the long term.",
        ],
        takeaway: "Only half of capital gains are taxed — and you control when to realize them.",
      },
      {
        title: "Dividends",
        content: [
          "Eligible Canadian dividends receive a tax credit that can lower taxes.",
          "Foreign dividends are typically fully taxable and may face withholding tax.",
        ],
        takeaway: "Canadian eligible dividends get a tax credit — foreign dividends don't.",
      },
      {
        title: "Interest",
        content: [
          "Interest income is fully taxable at your marginal rate in non-registered accounts.",
          "Consider holding interest-bearing assets in registered accounts when possible.",
        ],
        takeaway: "Interest is fully taxed — shelter it in registered accounts.",
      },
    ],
  },
  "retirement-basics": {
    title: "Retirement Basics",
    section: "Taxes & Retirement",
    readTime: "5 min",
    slides: [
      {
        title: "How Much Do You Need?",
        content: [
          "Estimate annual spending, subtract government and employer pensions, and fill the gap with savings.",
          "A common rule: plan for 70–80% of pre-retirement income, adjusted to your lifestyle.",
        ],
        takeaway: "Estimate needs, subtract pensions, save the gap.",
      },
      {
        title: "Withdrawal Order",
        content: [
          "Coordinate RRSP/RRIF, TFSA, and non-registered withdrawals for tax efficiency.",
          "Delaying CPP/OAS can increase lifetime benefits; run scenarios with an advisor.",
        ],
        takeaway: "Withdrawal order matters for taxes — coordinate across accounts.",
      },
    ],
  },
  "cpp-oas": {
    title: "CPP & OAS",
    section: "Taxes & Retirement",
    readTime: "7 min",
    slides: [
      {
        title: "What They Are",
        content: [
          "CPP is an earnings-based pension; OAS is a residency-based benefit.",
          "Both can be taken earlier or later, with adjustments to amounts.",
        ],
        takeaway: "CPP = earnings-based. OAS = residency-based. Both are adjustable in timing.",
      },
      {
        title: "Timing & Clawbacks",
        content: [
          "Delaying to age 70 increases payments but must fit your plan and health.",
          "OAS may be clawed back above certain income thresholds; plan withdrawals accordingly.",
        ],
        takeaway: "Delay = bigger checks. Watch OAS clawback thresholds.",
      },
    ],
  },
};

const { width } = Dimensions.get("window");

export default function EducationChapter() {
  const router = useRouter();
  const { chapter: chapterId } = useLocalSearchParams<{ chapter: string }>();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const slideOpacity = useRef(new Animated.Value(1)).current;
  const slideTranslateX = useRef(new Animated.Value(0)).current;
  const completeScale = useRef(new Animated.Value(0)).current;

  const chapter = chapterId ? CHAPTER_DATA[chapterId] : null;

  useEffect(() => {
    setCurrentSlide(0);
    if (chapterId) {
      getCompletedChapters().then((ids) => {
        setIsCompleted(ids.includes(chapterId));
      });
    }
  }, [chapterId]);

  const animateSlideChange = useCallback(
    (direction: "next" | "prev", action: () => void) => {
      const exitX = direction === "next" ? -width * 0.3 : width * 0.3;
      Animated.parallel([
        Animated.timing(slideOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(slideTranslateX, {
          toValue: exitX,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => {
        action();
        slideTranslateX.setValue(direction === "next" ? width * 0.3 : -width * 0.3);
        Animated.parallel([
          Animated.timing(slideOpacity, {
            toValue: 1,
            duration: 240,
            useNativeDriver: true,
          }),
          Animated.spring(slideTranslateX, {
            toValue: 0,
            friction: 8,
            tension: 60,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [slideOpacity, slideTranslateX]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        router.back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (isCompleted) {
      Animated.spring(completeScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      completeScale.setValue(0);
    }
  }, [isCompleted, completeScale]);

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📚</Text>
          <Text style={styles.errorTitle}>Chapter not found</Text>
          <Text style={styles.errorText}>
            The topic you're looking for doesn't exist or has been moved.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.replace("/education" as Href)}
          >
            <Text style={styles.errorButtonText}>Back to Education</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const slide = chapter.slides[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === chapter.slides.length - 1;
  const progressPercent = ((currentSlide + 1) / chapter.slides.length) * 100;

  const goNext = () => {
    if (isLastSlide) return;
    animateSlideChange("next", () => setCurrentSlide((s) => s + 1));
  };

  const goPrev = () => {
    if (isFirstSlide) return;
    animateSlideChange("prev", () => setCurrentSlide((s) => s - 1));
  };

  const handleComplete = () => {
    if (!chapterId) return;
    const newValue = !isCompleted;
    setIsCompleted(newValue);
    if (newValue) {
      markChapterComplete(chapterId);
      if (Platform.OS !== "web") {
        Alert.alert("Completed!", `Great job finishing "${chapter.title}".`);
      }
    } else {
      markChapterIncomplete(chapterId);
    }
  };

  const handleFinish = () => {
    if (!chapterId) return;
    if (!isCompleted) {
      setIsCompleted(true);
      markChapterComplete(chapterId);
    }
    router.replace("/education" as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to Education"
        >
          <ChevronLeft size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>{chapter.section}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chapter.title}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleComplete}
          accessibilityRole="button"
          accessibilityLabel={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <CheckCircle2 size={22} color={Colors.success} />
          ) : (
            <Circle size={22} color={Colors.textLight} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
            accessibilityRole="progressbar"
            accessibilityValue={{
              now: Math.round(progressPercent),
              min: 0,
              max: 100,
            }}
          />
        </View>
        <Text style={styles.progressText}>
          Slide {currentSlide + 1} of {chapter.slides.length}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: slideOpacity,
            transform: [{ translateX: slideTranslateX }],
          }}
        >
          <View style={styles.slideNumberBadge}>
            <Text style={styles.slideNumberText}>
              {currentSlide + 1} / {chapter.slides.length}
            </Text>
          </View>

          <Text style={styles.slideTitle}>{slide.title}</Text>

          <View style={styles.contentBlock}>
            {slide.content.map((paragraph, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>

          {slide.takeaway && (
            <View style={styles.takeawayCard}>
              <View style={styles.takeawayHeader}>
                <Lightbulb size={16} color={Colors.warning} />
                <Text style={styles.takeawayLabel}>Key Takeaway</Text>
              </View>
              <Text style={styles.takeawayText}>{slide.takeaway}</Text>
            </View>
          )}

          {isCompleted && (
            <Animated.View
              style={[styles.completedBanner, { transform: [{ scale: completeScale }] }]}
            >
              <CheckCircle2 size={18} color="#ffffff" />
              <Text style={styles.completedBannerText}>Marked as complete</Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.navButton, isFirstSlide && styles.navButtonDisabled]}
          onPress={goPrev}
          disabled={isFirstSlide}
          accessibilityRole="button"
          accessibilityLabel="Previous slide"
        >
          <ChevronLeft
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

        {isLastSlide ? (
          <TouchableOpacity
            style={styles.navButtonPrimary}
            onPress={handleFinish}
            accessibilityRole="button"
            accessibilityLabel="Finish and return to Education"
          >
            <Text style={styles.navButtonTextPrimary}>Finish</Text>
            <Sparkles size={18} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButtonPrimary}
            onPress={goNext}
            accessibilityRole="button"
            accessibilityLabel="Next slide"
          >
            <Text style={styles.navButtonTextPrimary}>Next</Text>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.backgroundGray,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerEyebrow: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "500",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  slideNumberBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  slideNumberText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 20,
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  contentBlock: {
    gap: 14,
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 25,
    color: Colors.text,
    fontWeight: "400",
  },
  takeawayCard: {
    backgroundColor: Colors.warningLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f6e05e",
    marginBottom: 16,
  },
  takeawayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  takeawayLabel: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  takeawayText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: "500",
  },
  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.success,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  completedBannerText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    gap: 8,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  navButtonTextPrimary: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  navButtonTextDisabled: {
    color: Colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
  },
  errorButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
