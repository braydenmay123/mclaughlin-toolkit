import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookOpen, DollarSign, Home, Shield, TrendingUp, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";

const educationTopics = [
  {
    id: 1,
    title: "Understanding Mortgage Types",
    description: "Learn about fixed-rate, variable-rate, and other mortgage options to find what's best for you.",
    icon: <DollarSign size={24} color={Colors.navy} />,
    content: `
      <h2>Fixed-Rate Mortgages</h2>
      <p>A fixed-rate mortgage has an interest rate that remains the same for the entire term of the loan, typically 15, 20, or 30 years. This provides predictable monthly payments.</p>
      <p><strong>Benefits:</strong> Payment stability, protection from rising interest rates</p>
      <p><strong>Drawbacks:</strong> Higher initial rates than variable mortgages, no benefit if rates fall</p>
      
      <h2>Variable-Rate Mortgages</h2>
      <p>Also called adjustable-rate mortgages (ARMs), these have interest rates that can change periodically based on market conditions.</p>
      <p><strong>Benefits:</strong> Lower initial rates, potential savings if rates decrease</p>
      <p><strong>Drawbacks:</strong> Payment uncertainty, risk of higher payments if rates rise</p>
      
      <h2>Open vs. Closed Mortgages</h2>
      <p><strong>Open Mortgage:</strong> Allows you to repay the mortgage in full at any time without penalty. Typically has a higher interest rate.</p>
      <p><strong>Closed Mortgage:</strong> Restricts prepayment options but offers lower interest rates. Prepayment penalties apply if you pay off the mortgage before the term ends.</p>
      
      <h2>Conventional vs. High-Ratio Mortgages</h2>
      <p><strong>Conventional Mortgage:</strong> Down payment of 20% or more of the purchase price</p>
      <p><strong>High-Ratio Mortgage:</strong> Down payment less than 20%, requires mortgage default insurance</p>
    `,
  },
  {
    id: 2,
    title: "First-Time Buyer Programs",
    description: "Discover government programs and incentives designed to help first-time homebuyers.",
    icon: <Home size={24} color={Colors.navy} />,
    content: `
      <h2>First-Time Home Buyer Incentive (FTHBI)</h2>
      <p>The Government of Canada offers 5% or 10% of the home's purchase price to put toward a down payment. This is a shared equity mortgage, meaning the government shares in the upside and downside of the property value.</p>
      
      <h2>Home Buyers' Plan (HBP)</h2>
      <p>Withdraw up to $35,000 tax-free from your RRSP to buy or build a qualifying home. You must repay the funds within 15 years.</p>
      
      <h2>First-Time Home Buyer Tax Credit</h2>
      <p>A $5,000 non-refundable income tax credit that provides up to $750 in tax relief to eligible first-time home buyers.</p>
      
      <h2>GST/HST New Housing Rebate</h2>
      <p>Recover some of the GST or HST paid on the purchase price or cost of building a new house, or on the cost of substantially renovating an existing house.</p>
      
      <h2>Land Transfer Tax Rebates</h2>
      <p>Many provinces offer land transfer tax rebates for first-time home buyers. For example, in Ontario, first-time buyers can receive a rebate of up to $4,000.</p>
      
      <h2>Tax-Free First Home Savings Account (FHSA)</h2>
      <p>The FHSA allows Canadians to save up to $40,000 on a tax-free basis toward the purchase of a first home. Key features include:</p>
      <p><strong>Annual contribution limit:</strong> $8,000 per year</p>
      <p><strong>Tax benefits:</strong> Contributions are tax-deductible, and withdrawals for a first home purchase are tax-free</p>
      <p><strong>Investment options:</strong> Similar to TFSAs and RRSPs, allowing various investment choices</p>
      <p><strong>Flexibility:</strong> If not used for a home purchase, funds can be transferred to an RRSP without affecting contribution room</p>
    `,
  },
  {
    id: 3,
    title: "Building Your Credit Score",
    description: "Tips to improve your credit score to qualify for better mortgage rates.",
    icon: <TrendingUp size={24} color={Colors.navy} />,
    content: `
      <h2>Understanding Your Credit Score</h2>
      <p>Your credit score is a number between 300 and 900 that represents your creditworthiness. Lenders use this score to determine whether to approve your mortgage and what interest rate to offer.</p>
      
      <h2>Factors That Affect Your Credit Score</h2>
      <ul>
        <li><strong>Payment History (35%):</strong> Making payments on time</li>
        <li><strong>Credit Utilization (30%):</strong> Amount of available credit you're using</li>
        <li><strong>Credit History Length (15%):</strong> How long you've had credit accounts</li>
        <li><strong>Credit Mix (10%):</strong> Types of credit accounts you have</li>
        <li><strong>New Credit Inquiries (10%):</strong> Recent applications for credit</li>
      </ul>
      
      <h2>Tips to Improve Your Score</h2>
      <p><strong>Pay Bills on Time:</strong> Set up automatic payments to avoid late payments</p>
      <p><strong>Reduce Debt:</strong> Pay down credit card balances to below 30% of your limit</p>
      <p><strong>Don't Close Old Accounts:</strong> Keep older credit cards open to maintain credit history</p>
      <p><strong>Limit New Credit Applications:</strong> Multiple inquiries can lower your score</p>
      <p><strong>Check Your Credit Report:</strong> Review for errors and dispute inaccuracies</p>
      
      <h2>Timeline for Improvement</h2>
      <p>Improving your credit score takes time. Minor issues may be resolved in a few months, while major issues like bankruptcy can affect your score for years.</p>
    `,
  },
  {
    id: 4,
    title: "Home Insurance Basics",
    description: "What you need to know about protecting your new investment with the right insurance.",
    icon: <Shield size={24} color={Colors.navy} />,
    content: `
      <h2>Types of Home Insurance Coverage</h2>
      <p><strong>Dwelling Coverage:</strong> Protects the physical structure of your home</p>
      <p><strong>Personal Property Coverage:</strong> Covers your belongings inside the home</p>
      <p><strong>Liability Protection:</strong> Covers legal costs if someone is injured on your property</p>
      <p><strong>Additional Living Expenses:</strong> Covers costs if you need to live elsewhere while your home is repaired</p>
      
      <h2>Common Insurance Terms</h2>
      <p><strong>Premium:</strong> The amount you pay for insurance coverage</p>
      <p><strong>Deductible:</strong> The amount you pay out of pocket before insurance kicks in</p>
      <p><strong>Replacement Cost:</strong> Pays to replace damaged items with new ones</p>
      <p><strong>Actual Cash Value:</strong> Pays the depreciated value of damaged items</p>
      
      <h2>Factors That Affect Premiums</h2>
      <p><strong>Home Location:</strong> Areas prone to natural disasters cost more to insure</p>
      <p><strong>Home Age and Condition:</strong> Older homes or those needing repairs may cost more</p>
      <p><strong>Claims History:</strong> Previous claims can increase premiums</p>
      <p><strong>Security Features:</strong> Alarm systems and smoke detectors can lower costs</p>
      
      <h2>Tips for First-Time Buyers</h2>
      <p>Get quotes from multiple insurers to compare coverage and prices</p>
      <p>Consider bundling home and auto insurance for discounts</p>
      <p>Create a home inventory with photos for easier claims</p>
      <p>Review your policy annually to ensure adequate coverage</p>
      
      <h2>Life Insurance and Mortgage Protection</h2>
      <p>While home insurance protects your property, life insurance protects your family's ability to keep the home if something happens to you:</p>
      <p><strong>Term Life Insurance:</strong> Provides coverage for a specific period, often matching your mortgage term</p>
      <p><strong>Permanent Life Insurance:</strong> Provides lifelong coverage and can build cash value over time</p>
      <p><strong>Mortgage Insurance:</strong> Pays off your mortgage if you die, but decreases in value as your mortgage balance decreases</p>
      <p>Consider working with Joe to determine the right insurance strategy for your specific situation.</p>
    `,
  },
  {
    id: 5,
    title: "Balancing Homeownership & Retirement",
    description: "Strategies for buying a home while still saving for retirement.",
    icon: <BookOpen size={24} color={Colors.navy} />,
    content: `
      <h2>The Homeownership vs. Retirement Dilemma</h2>
      <p>Many first-time homebuyers face the challenge of balancing their desire to own a home with the need to save for retirement. Both goals require significant financial resources, and finding the right balance is crucial for long-term financial health.</p>
      
      <h2>The 50/30/20 Budget Rule</h2>
      <p>Consider allocating your after-tax income as follows:</p>
      <p><strong>50%:</strong> Essential expenses (including mortgage payment)</p>
      <p><strong>30%:</strong> Discretionary spending</p>
      <p><strong>20%:</strong> Savings and debt repayment (including retirement savings)</p>
      
      <h2>Strategies for Balancing Both Goals</h2>
      <p><strong>Don't Overextend on Your Home Purchase:</strong> Buy a home that allows you to continue retirement contributions</p>
      <p><strong>Maximize Employer Matching:</strong> At minimum, contribute enough to your workplace retirement plan to get the full employer match</p>
      <p><strong>Use Tax-Advantaged Accounts:</strong> Contribute to RRSPs and TFSAs for retirement while saving for your down payment</p>
      <p><strong>Accelerate Mortgage Payments:</strong> Once you've established retirement savings, consider making extra mortgage payments to build equity faster</p>
      
      <h2>The Power of Starting Early</h2>
      <p>Starting retirement savings early, even in small amounts, allows compound interest to work in your favor. A 25-year-old who invests $200 monthly until age 65 could accumulate over $500,000 (assuming 7% annual returns).</p>
      
      <h2>Home Equity as Part of Retirement Planning</h2>
      <p>While your home can be a valuable asset in retirement (through downsizing, home equity lines of credit, or reverse mortgages), it shouldn't be your only retirement strategy.</p>
      
      <h2>Leveraging Life Insurance in Retirement Planning</h2>
      <p>Permanent life insurance can serve dual purposes in your financial plan:</p>
      <p><strong>Protection:</strong> Ensures your family can maintain their lifestyle and keep the home if you're no longer there</p>
      <p><strong>Retirement supplement:</strong> Cash value in permanent policies can be accessed tax-efficiently in retirement</p>
      <p><strong>Estate planning:</strong> Provides tax-efficient wealth transfer to your heirs</p>
      <p><strong>Long-term care needs:</strong> Some policies offer riders for long-term care expenses</p>
      <p>Joe can help you determine if incorporating life insurance into your financial plan makes sense for your specific situation.</p>
    `,
  },
];

export default function EducationScreen() {
  const [selectedTopic, setSelectedTopic] = useState<typeof educationTopics[0] | null>(null);

  const openTopic = (topic: typeof educationTopics[0]) => {
    setSelectedTopic(topic);
  };

  const closeTopic = () => {
    setSelectedTopic(null);
  };

  const renderHTMLContent = (htmlContent: string) => {
    // Simple HTML parser for React Native
    // This is a basic implementation - in a real app, you might use a library
    const sections = htmlContent.split('<h2>');
    
    return sections.map((section, index) => {
      if (index === 0) return null; // Skip the first empty section
      
      const [title, ...contentParts] = section.split('</h2>');
      const content = contentParts.join('</h2>');
      
      const paragraphs = content.split('<p>').map(p => p.replace('</p>', '').trim()).filter(p => p);
      const listItems = content.includes('<ul>') 
        ? content.split('<ul>')[1].split('</ul>')[0].split('<li>').map(li => li.replace('</li>', '').trim()).filter(li => li)
        : [];
      
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
          
          {listItems.length > 0 && (
            <View style={styles.listContainer}>
              {listItems.map((item, liIndex) => {
                // Handle strong tags in list items
                if (item.includes('<strong>')) {
                  const parts = item.split(/<strong>|<\/strong>/);
                  return (
                    <View key={`li-${liIndex}`} style={styles.listItem}>
                      <Text style={styles.listBullet}>•</Text>
                      <Text style={styles.listItemText}>
                        {parts.map((part, partIndex) => 
                          partIndex % 2 === 0 ? 
                            part : 
                            <Text key={`strong-${partIndex}`} style={{fontWeight: 'bold'}}>{part}</Text>
                        )}
                      </Text>
                    </View>
                  );
                }
                return (
                  <View key={`li-${liIndex}`} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Home Buying Education</Text>
          <Text style={styles.subtitle}>
            Resources to help you make informed decisions
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
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          <View style={styles.resourceCard}>
            <Text style={styles.resourceText}>
              For more detailed information on home buying, financing options, and financial planning, 
              schedule a consultation with Joe to receive personalized guidance tailored to your specific situation.
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
  listContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 14,
    color: Colors.navy,
    marginRight: 8,
    width: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
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