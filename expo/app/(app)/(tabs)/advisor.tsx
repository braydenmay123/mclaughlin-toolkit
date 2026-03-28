import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone, Mail, MapPin, Clock, User, MessageCircle } from "lucide-react-native";
import Colors from "@/constants/colors";

interface ContactMethod {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  action: () => void;
  color: string;
  bgColor: string;
}

export default function AdvisorScreen() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePhoneCall = async () => {
    setIsLoading("phone");
    try {
      const phoneNumber = "tel:+15195100411";
      const canOpen = await Linking.canOpenURL(phoneNumber);
      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert("Error", "Unable to make phone call");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to make phone call");
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmail = async () => {
    setIsLoading("email");
    try {
      const emailUrl = "mailto:info@mclaughlinfinancial.ca?subject=Financial Planning Inquiry";
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert("Error", "Unable to open email client");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open email client");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDirections = async () => {
    setIsLoading("directions");
    try {
      const address = "1 Elora Street North, Unit 1, Harriston, Ontario";
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
      const canOpen = await Linking.canOpenURL(mapsUrl);
      if (canOpen) {
        await Linking.openURL(mapsUrl);
      } else {
        Alert.alert("Error", "Unable to open maps");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open maps");
    } finally {
      setIsLoading(null);
    }
  };

  const contactMethods: ContactMethod[] = [
    {
      id: "phone",
      title: "Call Joe",
      subtitle: "519-510-0411",
      icon: Phone,
      action: handlePhoneCall,
      color: Colors.primary,
      bgColor: Colors.primaryLight,
    },
    {
      id: "email",
      title: "Send Email",
      subtitle: "info@mclaughlinfinancial.ca",
      icon: Mail,
      action: handleEmail,
      color: Colors.secondary,
      bgColor: Colors.secondaryLight,
    },
    {
      id: "directions",
      title: "Get Directions",
      subtitle: "1 Elora Street North, Unit 1",
      icon: MapPin,
      action: handleDirections,
      color: Colors.accent,
      bgColor: Colors.accentLight,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Talk with Joe</Text>
          <Text style={styles.subtitle}>
            Joe McLaughlin, Financial Advisor
          </Text>
          <Text style={styles.description}>
            Get personalized financial advice and guidance for your home buying journey
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Methods</Text>
          
          {contactMethods.map((method) => {
            const IconComponent = method.icon;
            const isMethodLoading = isLoading === method.id;
            
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.contactCard, { backgroundColor: method.bgColor }]}
                onPress={method.action}
                activeOpacity={0.7}
                disabled={isMethodLoading}
                testID={`contact-${method.id}`}
              >
                <View style={styles.contactContent}>
                  <View style={[styles.contactIcon, { backgroundColor: method.color }]}>
                    <IconComponent size={24} color="white" />
                  </View>
                  
                  <View style={styles.contactText}>
                    <Text style={[styles.contactTitle, { color: method.color }]}>
                      {method.title}
                    </Text>
                    <Text style={styles.contactSubtitle}>
                      {method.subtitle}
                    </Text>
                  </View>
                  
                  {isMethodLoading && (
                    <View style={styles.loadingIndicator}>
                      <Text style={styles.loadingText}>Opening...</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Office Hours */}
        <View style={styles.hoursContainer}>
          <Text style={styles.sectionTitle}>Office Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.hoursHeader}>
              <Clock size={24} color={Colors.primary} />
              <Text style={styles.hoursTitle}>Business Hours</Text>
            </View>
            <View style={styles.hoursContent}>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>9:00 AM - 5:00 PM</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Saturday</Text>
                <Text style={styles.hoursTime}>By Appointment</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursDay}>Sunday</Text>
                <Text style={styles.hoursTime}>Closed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesCard}>
            <MessageCircle size={24} color={Colors.secondary} style={styles.servicesIcon} />
            <Text style={styles.servicesTitle}>Financial Planning Services</Text>
            <Text style={styles.servicesDescription}>
              • First-time home buyer guidance{'\n'}
              • Mortgage pre-approval assistance{'\n'}
              • Investment planning{'\n'}
              • Tax optimization strategies{'\n'}
              • Insurance planning{'\n'}
              • Retirement planning
            </Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  contactContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 20,
  },
  contactCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  loadingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  hoursContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  hoursCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 12,
  },
  hoursContent: {
    gap: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursDay: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  servicesContainer: {
    paddingHorizontal: 24,
  },
  servicesCard: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  servicesIcon: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 12,
  },
  servicesDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});