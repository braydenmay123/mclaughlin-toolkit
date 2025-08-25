import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DollarSign, TrendingUp, Calendar, Shield, BookOpen, X, AlertTriangle, Home } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

const educationTopics = [
  {
    id: 1,
    title: "TFSA Basics",
    description: "Learn about the Tax-Free Savings Account and how it can benefit your financial future.",
    icon: <DollarSign size={24} color={Colors.navy} />,
    content: `
      <h2>What is a TFSA?</h2>
      <p>A Tax-Free Savings Account (TFSA) is a registered account that allows Canadians to earn investment income tax-free. Introduced in 2009, the TFSA has become an essential component of financial planning for Canadians of all ages.</p>
      
      <h2>Key TFSA Features</h2>
      <p><strong>Tax-free growth:</strong> All investment income earned within a TFSA, including interest, dividends, and capital gains, is completely tax-free.</p>
      <p><strong>Contribution room:</strong> Each year, the government sets a contribution limit. For 2023, the annual contribution limit is $6,500. For 2024-2025, the limit is $7,000.</p>
      <p><strong>Cumulative room:</strong> Unused contribution room accumulates and carries forward indefinitely. If you've never contributed to a TFSA and were 18 or older in 2009, you would have $102,000 in contribution room as of 2025.</p>
      <p><strong>Flexibility:</strong> You can withdraw funds from your TFSA at any time without tax consequences. The amount withdrawn is added back to your contribution room in the following calendar year.</p>
      
      <h2>TFSA Contribution Limits (2009-2025)</h2>
      <p>• 2009-2012: $5,000 per year</p>
      <p>• 2013-2014: $5,500 per year</p>
      <p>• 2015: $10,000</p>
      <p>• 2016-2018: $5,500 per year</p>
      <p>• 2019-2022: $6,000 per year</p>
      <p>• 2023: $6,500</p>
      <p>• 2024-2025: $7,000 per year</p>
      
      <h2>TFSA vs. RRSP</h2>
      <p><strong>TFSA:</strong> Contributions are not tax-deductible, but withdrawals are tax-free.</p>
      <p><strong>RRSP:</strong> Contributions are tax-deductible, but withdrawals are taxed as income.</p>
      <p>Generally, TFSAs are more beneficial if you expect to be in a higher tax bracket in retirement, while RRSPs are more advantageous if you expect to be in a lower tax bracket in retirement.</p>
      
      <h2>Who Should Use a TFSA?</h2>
      <p>TFSAs are versatile and beneficial for almost everyone, but they're particularly valuable for:</p>
      <p><strong>Young savers:</strong> Building tax-free savings early in your career</p>
      <p><strong>High-income earners:</strong> Supplementing retirement savings beyond RRSP limits</p>
      <p><strong>Retirees:</strong> Generating tax-free income that doesn't affect government benefits</p>
      <p><strong>Short-term savers:</strong> Saving for major purchases with flexible access to funds</p>
    `,
  },
  {
    id: 2,
    title: "Investment Strategies for TFSAs",
    description: "Discover optimal investment approaches to maximize your TFSA's growth potential.",
    icon: <TrendingUp size={24} color={Colors.navy} />,
    content: `
      <h2>Choosing the Right Investments</h2>
      <p>Since all investment growth in a TFSA is tax-free, it's generally best to hold investments with the highest growth potential or those that would otherwise be heavily taxed.</p>
      
      <h2>Conservative Strategy (2.5% Expected Return)</h2>
      <p>A conservative TFSA strategy focuses on capital preservation with modest growth.</p>
      <p><strong>Suitable investments:</strong></p>
      <p>• High-interest savings accounts</p>
      <p>• Guaranteed Investment Certificates (GICs)</p>
      <p>• Government bonds</p>
      <p>• Low-volatility bond ETFs</p>
      <p><strong>Best for:</strong> Short-term goals (1-3 years), emergency funds, or investors with low risk tolerance</p>
      
      <h2>Balanced Strategy (5% Expected Return)</h2>
      <p>A balanced approach aims to provide moderate growth while managing volatility.</p>
      <p><strong>Suitable investments:</strong></p>
      <p>• Balanced mutual funds or ETFs (40-60% equity, 40-60% fixed income)</p>
      <p>• Blue-chip dividend stocks</p>
      <p>• Corporate bonds</p>
      <p>• REITs (Real Estate Investment Trusts)</p>
      <p><strong>Best for:</strong> Medium-term goals (3-10 years) or investors with moderate risk tolerance</p>
      
      <h2>Growth Strategy (7.5% Expected Return)</h2>
      <p>A growth strategy focuses on capital appreciation over the long term.</p>
      <p><strong>Suitable investments:</strong></p>
      <p>• Equity mutual funds or ETFs</p>
      <p>• Individual growth stocks</p>
      <p>• Small and mid-cap stocks</p>
      <p>• International equity</p>
      <p><strong>Best for:</strong> Long-term goals (10+ years) or investors with higher risk tolerance</p>
      
      <h2>Tax-Efficient Considerations</h2>
      <p>To maximize the tax benefits of your TFSA, consider holding investments that would otherwise face high taxation:</p>
      <p>• Canadian dividend stocks (normally eligible for dividend tax credit)</p>
      <p>• Foreign dividend-paying stocks (normally subject to withholding taxes)</p>
      <p>• Corporate bonds and GICs (interest income is fully taxable outside a TFSA)</p>
      <p>• Investments with high turnover or frequent capital gains</p>
    `,
  },
  {
    id: 3,
    title: "Contribution Strategies",
    description: "Learn how to optimize your TFSA contributions for maximum long-term benefit.",
    icon: <Calendar size={24} color={Colors.navy} />,
    content: `
      <h2>Understanding Contribution Limits</h2>
      <p>The annual TFSA contribution limit changes each year based on inflation, rounded to the nearest $500. Here's the historical contribution room:</p>
      <p>• 2009-2012: $5,000 per year</p>
      <p>• 2013-2014: $5,500 per year</p>
      <p>• 2015: $10,000</p>
      <p>• 2016-2018: $5,500 per year</p>
      <p>• 2019-2022: $6,000 per year</p>
      <p>• 2023: $6,500</p>
      <p>• 2024-2025: $7,000 per year</p>
      <p>If you were 18 or older in 2009 and have never contributed, your total contribution room in 2025 would be $102,000.</p>
      
      <h2>Lump Sum vs. Regular Contributions</h2>
      <p><strong>Lump sum:</strong> Contributing a large amount at once can maximize time in the market, potentially leading to greater returns.</p>
      <p><strong>Regular contributions:</strong> Setting up automatic monthly or bi-weekly contributions helps build the savings habit and benefits from dollar-cost averaging.</p>
      <p>The best approach often combines both: contribute what you can as early as possible each year, then set up regular contributions for the remainder.</p>
      
      <h2>Timing Your Contributions</h2>
      <p><strong>Early in the year:</strong> Contributing in January rather than December could result in an extra year of tax-free growth.</p>
      <p><strong>After withdrawals:</strong> Remember that withdrawn amounts are added back to your contribution room, but not until January 1 of the following year.</p>
      
      <h2>Avoiding Over-Contribution Penalties</h2>
      <p>Exceeding your TFSA contribution limit results in a penalty tax of 1% per month on the excess amount.</p>
      <p>To avoid penalties:</p>
      <p>• Track your contribution room carefully</p>
      <p>• Check your available contribution room on the CRA My Account portal</p>
      <p>• If you make a withdrawal, wait until the next calendar year to recontribute that amount</p>
      <p>• Set up contribution alerts with your financial institution</p>
      
      <h2>Spousal TFSA Strategy</h2>
      <p>Unlike RRSPs, there's no such thing as a spousal TFSA. However, you can give money to your spouse to contribute to their own TFSA without triggering attribution rules.</p>
      <p>This strategy effectively doubles a family's tax-sheltered investment room and can be particularly beneficial for income-splitting in retirement.</p>
    `,
  },
  {
    id: 4,
    title: "TFSA and Retirement Planning",
    description: "How to incorporate your TFSA into a comprehensive retirement strategy.",
    icon: <Shield size={24} color={Colors.navy} />,
    content: `
      <h2>TFSA as a Retirement Vehicle</h2>
      <p>While RRSPs are often considered the primary retirement savings vehicle, TFSAs offer unique advantages that make them an excellent complement to your retirement plan:</p>
      <p><strong>Tax-free withdrawals:</strong> Unlike RRSP/RRIF withdrawals, TFSA withdrawals don't count as income and won't affect income-tested benefits like OAS or GIS.</p>
      <p><strong>No mandatory withdrawals:</strong> TFSAs don't have required minimum withdrawals like RRIFs, giving you more flexibility in retirement.</p>
      <p><strong>Estate planning benefits:</strong> TFSA assets can be passed to beneficiaries tax-free.</p>
      
      <h2>Optimal TFSA-RRSP Balance</h2>
      <p>For most Canadians, a combination of TFSA and RRSP savings provides the best retirement outcome:</p>
      <p><strong>Lower income earners ($50,000 or less):</strong> Prioritize TFSA contributions, then RRSP</p>
      <p><strong>Middle income earners ($50,000-$100,000):</strong> Balance between TFSA and RRSP contributions</p>
      <p><strong>Higher income earners ($100,000+):</strong> Maximize RRSP contributions first, then TFSA</p>
      
      <h2>TFSA Withdrawal Strategy in Retirement</h2>
      <p>A tax-efficient withdrawal strategy in retirement might look like this:</p>
      <p>1. Non-registered investments first (manage capital gains)</p>
      <p>2. RRSP/RRIF minimum required withdrawals</p>
      <p>3. TFSA withdrawals as needed (these can be strategically timed as they don't affect your tax situation)</p>
      
      <h2>TFSA and Government Benefits</h2>
      <p>One of the most significant advantages of TFSAs in retirement is that withdrawals don't affect government benefits:</p>
      <p><strong>Old Age Security (OAS):</strong> Not affected by TFSA withdrawals, helping avoid the OAS clawback</p>
      <p><strong>Guaranteed Income Supplement (GIS):</strong> Not affected by TFSA withdrawals, making TFSAs particularly valuable for lower-income seniors</p>
      <p><strong>Canada Child Benefit:</strong> Not affected by TFSA withdrawals for those still receiving this benefit in retirement</p>
      
      <h2>TFSA and Life Insurance in Retirement Planning</h2>
      <p>Combining TFSAs with permanent life insurance can create a powerful retirement and estate planning strategy:</p>
      <p><strong>Tax-efficient wealth transfer:</strong> Life insurance proceeds are paid tax-free to beneficiaries, similar to TFSA assets</p>
      <p><strong>Creditor protection:</strong> Both TFSAs (in some provinces) and life insurance can offer creditor protection</p>
      <p><strong>Estate planning:</strong> Using TFSA withdrawals to fund life insurance premiums can maximize the legacy left to heirs</p>
      <p><strong>Complementary tax advantages:</strong> When you've maximized your TFSA contributions, permanent life insurance provides additional tax-sheltered investment growth</p>
    `,
  },
  {
    id: 5,
    title: "Common TFSA Mistakes to Avoid",
    description: "Learn about pitfalls that can reduce the effectiveness of your TFSA strategy.",
    icon: <AlertTriangle size={24} color={Colors.navy} />,
    content: `
      <h2>Over-Contributing</h2>
      <p>Exceeding your contribution limit results in a 1% per month penalty on the excess amount.</p>
      <p><strong>How to avoid it:</strong></p>
      <p>• Track your contributions carefully</p>
      <p>• Check your available contribution room on the CRA My Account portal</p>
      <p>• Set up alerts with your financial institution</p>
      <p>• Remember that withdrawn amounts aren't added back to your contribution room until the following calendar year</p>
      
      <h2>Using Your TFSA as a Regular Savings Account</h2>
      <p>While TFSAs offer flexibility, frequent withdrawals and deposits can limit long-term growth potential.</p>
      <p><strong>How to avoid it:</strong></p>
      <p>• Maintain a separate emergency fund outside your TFSA</p>
      <p>• Use your TFSA primarily for medium to long-term goals</p>
      <p>• Consider having multiple TFSAs for different purposes (e.g., one for short-term goals and one for retirement)</p>
      
      <h2>Holding the Wrong Investments</h2>
      <p>Not all investments are ideal for a TFSA. Some investments don't take full advantage of the tax-free growth potential.</p>
      <p><strong>How to avoid it:</strong></p>
      <p>• Avoid holding low-interest savings or GICs in your TFSA if you have higher-return options</p>
      <p>• Consider holding investments that would otherwise be heavily taxed (e.g., interest-bearing investments, dividend stocks)</p>
      <p>• Align your TFSA investments with your time horizon and risk tolerance</p>
      
      <h2>Day Trading in Your TFSA</h2>
      <p>The CRA may consider frequent trading in a TFSA as carrying on a business, which could make all gains taxable as business income.</p>
      <p><strong>How to avoid it:</strong></p>
      <p>• Use your TFSA for long-term investing, not active trading</p>
      <p>• Limit the frequency of your trades</p>
      <p>• Consider using a non-registered account for more active trading strategies</p>
      
      <h2>Holding US Dividend-Paying Stocks</h2>
      <p>US dividends in a TFSA are subject to a 15% withholding tax that cannot be recovered, unlike in an RRSP.</p>
      <p><strong>How to avoid it:</strong></p>
      <p>• Consider holding US dividend-paying stocks in an RRSP instead</p>
      <p>• Focus on US growth stocks (with no or low dividends) in your TFSA</p>
      <p>• Use Canadian-listed ETFs that hold US stocks for broader exposure</p>
      
      <h2>Not Naming a Successor Holder or Beneficiary</h2>
      <p>Without proper designation, your TFSA may be subject to probate and the tax-free status could be lost upon death.</p>
      <p><strong>How to avoid it:</strong></p>
      <p>• Name your spouse as a successor holder (they inherit the TFSA with its tax-free status intact)</p>
      <p>• Name other beneficiaries for the TFSA assets if you don't have a spouse</p>
      <p>• Review and update your designations after major life events</p>
    `,
  },
  {
    id: 6,
    title: "TFSA and First Home Savings Account (FHSA)",
    description: "Learn how to combine TFSA and FHSA strategies for first-time home buyers.",
    icon: <Home size={24} color={Colors.navy} />,
    content: `
      <h2>Understanding the FHSA</h2>
      <p>The First Home Savings Account (FHSA) is a registered account designed specifically for first-time home buyers in Canada. It combines the tax-deductible contributions of an RRSP with the tax-free withdrawals of a TFSA when used for a qualifying home purchase.</p>
      
      <h2>Key FHSA Features</h2>
      <p><strong>Contribution limits:</strong> Up to $8,000 annually with a lifetime limit of $40,000</p>
      <p><strong>Tax advantages:</strong> Contributions are tax-deductible, and qualified withdrawals for a first home purchase are tax-free</p>
      <p><strong>Investment options:</strong> Similar to TFSAs and RRSPs, allowing various investment choices</p>
      <p><strong>Time limit:</strong> Account can be maintained for up to 15 years or until age 71</p>
      
      <h2>TFSA vs. FHSA Comparison</h2>
      <p><strong>TFSA:</strong></p>
      <p>• Contributions are not tax-deductible</p>
      <p>• Withdrawals are always tax-free</p>
      <p>• No restrictions on withdrawal purposes</p>
      <p>• Annual contribution room of $7,000 (2024-2025)</p>
      <p>• Withdrawn amounts can be recontributed in future years</p>
      
      <p><strong>FHSA:</strong></p>
      <p>• Contributions are tax-deductible</p>
      <p>• Withdrawals are tax-free only for qualifying home purchases</p>
      <p>• Annual contribution limit of $8,000</p>
      <p>• Lifetime contribution limit of $40,000</p>
      <p>• Must be a first-time home buyer</p>
      
      <h2>Strategic Combination for Home Buyers</h2>
      <p>For first-time home buyers, a strategic approach to using both accounts can maximize benefits:</p>
      
      <p><strong>Step 1:</strong> Open an FHSA and contribute the maximum $8,000 annually to get the tax deduction</p>
      <p><strong>Step 2:</strong> Use your TFSA for additional down payment savings beyond the FHSA annual limit</p>
      <p><strong>Step 3:</strong> Invest according to your home purchase timeline (more conservative as you get closer to buying)</p>
      <p><strong>Step 4:</strong> When ready to purchase, withdraw from both accounts tax-free</p>
      
      <h2>Advantages of the Combined Approach</h2>
      <p><strong>Maximize tax benefits:</strong> Get tax deductions now (FHSA) and tax-free growth (both)</p>
      <p><strong>Larger down payment:</strong> Combined contribution room allows for faster saving</p>
      <p><strong>Flexibility:</strong> If home plans change, TFSA funds can be used for other purposes without penalty</p>
      <p><strong>Fallback option:</strong> If FHSA funds aren't used for a home purchase, they can be transferred to an RRSP without affecting RRSP contribution room</p>
      
      <h2>Who Should Consider This Strategy</h2>
      <p>This combined TFSA-FHSA approach is ideal for:</p>
      <p>• First-time home buyers with 1-5 year purchase timelines</p>
      <p>• Those with sufficient income to benefit from FHSA tax deductions</p>
      <p>• Individuals who can save more than $8,000 annually toward a home</p>
      <p>• Those who want to maximize government programs for home buying</p>
    `,
  },
];

export default function TFSAEducationScreen() {
  const [selectedTopic, setSelectedTopic] = useState<typeof educationTopics[0] | null>(null);

  const openTopic = (topic: typeof educationTopics[0]) => {
    setSelectedTopic(topic);
  };

  const closeTopic = () => {
    setSelectedTopic(null);
  };

  const renderHTMLContent = (htmlContent: string) => {
    // Simple HTML parser for React Native
    const sections = htmlContent.split('<h2>');
    
    return sections.map((section, index) => {
      if (index === 0) return null; // Skip the first empty section
      
      const [title, ...contentParts] = section.split('</h2>');
      const content = contentParts.join('</h2>');
      
      const paragraphs = content.split('<p>').map(p => p.replace('</p>', '').trim()).filter(p => p);
      
      return (
        <View key={index} style={styles.contentSection}>
          <Text style={styles.contentSectionTitle}>{title}</Text>
          
          {paragraphs.map((paragraph, pIndex) => {
            // Handle strong tags
            if (paragraph.includes('<strong>')) {
              const parts = paragraph.split(/<strong>|<\/strong>/);
              return (
                <Text key={`p-${pIndex}`} style={styles.contentParagraph}>
                  {parts.map((part, partIndex) => 
                    partIndex % 2 === 0 ? 
                      part : 
                      <Text key={`strong-${partIndex}`} style={{fontWeight: 'bold'}}>{part}</Text>
                  )}
                </Text>
              );
            }
            return <Text key={`p-${pIndex}`} style={styles.contentParagraph}>{paragraph}</Text>;
          })}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>TFSA Education Guide</Text>
          <Text style={styles.subtitle}>
            Learn how to maximize the benefits of your Tax-Free Savings Account
          </Text>
        </View>
        
        <View style={styles.topicsContainer}>
          {educationTopics.map((topic) => (
            <TouchableOpacity 
              key={topic.id} 
              style={styles.topicCard}
              onPress={() => openTopic(topic)}
            >
              <View style={styles.topicIconContainer}>{topic.icon}</View>
              <View style={styles.topicContent}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.resourcesContainer}>
          <Text style={styles.resourcesTitle}>Investment Consultation</Text>
          <View style={styles.resourceCard}>
            <Text style={styles.resourceText}>
              For personalized TFSA investment strategies tailored to your specific financial goals and risk tolerance, 
              schedule a consultation with Joe at McLaughlin Financial Group.
            </Text>
            <TouchableOpacity style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>Schedule with Joe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Modal for displaying topic content */}
      <Modal
        visible={selectedTopic !== null}
        animationType="slide"
        transparent={false}
      >
        {selectedTopic && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeTopic} style={styles.closeButton}>
                <X size={24} color={Colors.navy} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedTopic.title}</Text>
            </View>
            <ScrollView style={styles.modalContent}>
              {renderHTMLContent(selectedTopic.content)}
              
              <View style={styles.modalFooter}>
                <Text style={styles.footerText}>
                  Have questions about {selectedTopic.title.toLowerCase()}? 
                  Contact Joe for personalized advice.
                </Text>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact Joe</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.navy,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  topicsContainer: {
    paddingHorizontal: 20,
  },
  topicCard: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.navyLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 6,
  },
  topicDescription: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  resourcesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resourcesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.navy,
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: Colors.navyLight,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.navy,
  },
  resourceText: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  scheduleButton: {
    backgroundColor: Colors.navy,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.navy,
    textAlign: "center",
    marginRight: 40, // To offset the close button and center the title
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  contentSection: {
    marginBottom: 24,
  },
  contentSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 12,
  },
  contentParagraph: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  modalFooter: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.navyLight,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: Colors.navy,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});