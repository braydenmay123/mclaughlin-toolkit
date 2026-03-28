import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BarChart3, Users, TrendingUp, Calendar, Mail, ArrowLeft, Download, RefreshCw } from "lucide-react-native";
import Colors from "@/constants/colors";
import ToolkitHeader from "@/components/ToolkitHeader";
import { getAnalyticsSummary, getStoredAnalytics, AnalyticsData } from "@/utils/emailService";

interface AnalyticsSummary {
  totalUsers: number;
  calculatorUsage: Record<string, number>;
  recentActivity: AnalyticsData[];
  topCalculators: { name: string; count: number }[];
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalUsers: 0,
    calculatorUsage: {},
    recentActivity: [],
    topCalculators: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalyticsSummary();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCalculatorDisplayName = (calculatorType: string) => {
    const names: Record<string, string> = {
      'Investment Growth Calculator': 'Investment Growth',
      'Home Affordability Calculator': 'Home Affordability',
      'TFSA Contribution Calculator': 'TFSA Calculator',
      'Income Tax Calculator': 'Tax Calculator',
      'Large Purchase Calculator': 'Large Purchase',
      'Investment ROI vs Life Insurance': 'Investment vs Insurance'
    };
    return names[calculatorType] || calculatorType;
  };

  const exportAnalytics = async () => {
    try {
      const data = await getStoredAnalytics();
      const csvContent = [
        'Name,Email,Calculator Type,Timestamp,Session ID',
        ...data.map((entry: AnalyticsData) => 
          `"${entry.userInfo.name}","${entry.userInfo.email}","${entry.calculatorType}","${entry.timestamp}","${entry.sessionId}"`
        )
      ].join('\n');
      
      // For web, create download
      if (typeof window !== 'undefined' && window.document) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `calculator_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert('Success', 'Analytics data exported successfully!');
      } else {
        Alert.alert('Export', 'Analytics export is available on web version.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Error', 'Failed to export analytics data.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["right", "left"]}>
        <ToolkitHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ToolkitHeader />
        
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={Colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Usage Analytics</Text>
          <Text style={styles.subtitle}>
            Track calculator usage and user engagement
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={exportAnalytics}
              activeOpacity={0.7}
            >
              <Download size={16} color={Colors.primary} />
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
              activeOpacity={0.7}
            >
              <RefreshCw size={16} color={Colors.primary} />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statNumber}>{analytics.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <BarChart3 size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statNumber}>{Object.keys(analytics.calculatorUsage).length}</Text>
            <Text style={styles.statLabel}>Active Calculators</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statNumber}>
              {analytics.topCalculators[0]?.count || 0}
            </Text>
            <Text style={styles.statLabel}>Most Used</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Calculators</Text>
          {analytics.topCalculators.length > 0 ? (
            analytics.topCalculators.map((calc, index) => (
              <View key={calc.name} style={styles.calculatorItem}>
                <View style={styles.calculatorRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.calculatorInfo}>
                  <Text style={styles.calculatorName}>
                    {getCalculatorDisplayName(calc.name)}
                  </Text>
                  <Text style={styles.calculatorCount}>{calc.count} uses</Text>
                </View>
                <View style={styles.calculatorBar}>
                  <View 
                    style={[
                      styles.calculatorBarFill, 
                      { 
                        width: `${(calc.count / analytics.topCalculators[0].count) * 100}%` 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No calculator usage data yet</Text>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {analytics.recentActivity.length > 0 ? (
            analytics.recentActivity.map((activity, index) => (
              <View key={`${activity.sessionId}-${index}`} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Calendar size={16} color={Colors.primary} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityUser}>
                    {activity.userInfo.name}
                  </Text>
                  <Text style={styles.activityCalculator}>
                    {getCalculatorDisplayName(activity.calculatorType)}
                  </Text>
                  <Text style={styles.activityDate}>
                    {formatDate(activity.timestamp)}
                  </Text>
                </View>
                <View style={styles.activityContact}>
                  <Mail size={14} color={Colors.textLight} />
                  <Text style={styles.activityEmail}>
                    {activity.userInfo.email}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent activity</Text>
          )}
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerTitle}>Data Privacy Notice</Text>
          <Text style={styles.disclaimerText}>
            This analytics data is stored locally and includes only basic usage statistics and contact information provided by users who opted in to receive results. All data is handled in accordance with privacy regulations.
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  calculatorItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  calculatorRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  calculatorInfo: {
    flex: 1,
    marginRight: 16,
  },
  calculatorName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  calculatorCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  calculatorBar: {
    width: 60,
    height: 6,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 3,
    overflow: "hidden",
  },
  calculatorBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityUser: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  activityCalculator: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  activityContact: {
    alignItems: "flex-end",
  },
  activityEmail: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
    maxWidth: 120,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 32,
  },
  disclaimerContainer: {
    marginHorizontal: 24,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  exportButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  refreshButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
});