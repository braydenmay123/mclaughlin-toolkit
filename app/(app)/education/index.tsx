import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, BookOpen, Home, DollarSign, FileText, Calculator, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

interface EducationSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  bgColor: string;
  slug: string;
  estimatedTime: string;
}

const educationSections: EducationSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Essential first steps for home buying in Canada',
    icon: Home,
    color: Colors.primary,
    bgColor: Colors.primaryLight,
    slug: 'getting-started',
    estimatedTime: '10 min read',
  },
  {
    id: 'budgeting',
    title: 'Budgeting & Saving',
    description: 'How much house can you afford and saving strategies',
    icon: DollarSign,
    color: Colors.secondary,
    bgColor: Colors.secondaryLight,
    slug: 'budgeting',
    estimatedTime: '15 min read',
  },
  {
    id: 'mortgage-basics',
    title: 'Mortgage Basics',
    description: 'Understanding mortgages, rates, and pre-approval',
    icon: Calculator,
    color: Colors.accent,
    bgColor: Colors.accentLight,
    slug: 'mortgage-basics',
    estimatedTime: '20 min read',
  },
  {
    id: 'home-search',
    title: 'Finding Your Home',
    description: 'Tips for searching and evaluating properties',
    icon: BookOpen,
    color: Colors.success,
    bgColor: Colors.successLight,
    slug: 'home-search',
    estimatedTime: '12 min read',
  },
  {
    id: 'legal-process',
    title: 'Legal Process',
    description: 'Offers, inspections, and closing procedures',
    icon: FileText,
    color: Colors.warning,
    bgColor: Colors.warningLight,
    slug: 'legal-process',
    estimatedTime: '18 min read',
  },
  {
    id: 'investment-strategies',
    title: 'Investment Strategies',
    description: 'Building wealth through real estate',
    icon: TrendingUp,
    color: Colors.info,
    bgColor: Colors.infoLight,
    slug: 'investment-strategies',
    estimatedTime: '25 min read',
  },
];

export default function EducationHomeScreen() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleSectionPress = (section: EducationSection) => {
    setSelectedSection(section.id);
    setTimeout(() => {
      router.push(`/education/${section.slug}` as any);
      setSelectedSection(null);
    }, 150);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.heroImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop&crop=center' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Home Buying Guide</Text>
              <Text style={styles.heroSubtitle}>
                Your complete guide to buying your first home in Canada
              </Text>
            </View>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Learn at Your Own Pace</Text>
          <Text style={styles.introText}>
            Navigate the Canadian real estate market with confidence. Our comprehensive guides cover everything from budgeting to closing day.
          </Text>
        </View>

        {/* Education Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionTitle}>Choose a Topic</Text>
          
          {educationSections.map((section, index) => {
            const IconComponent = section.icon;
            const isSelected = selectedSection === section.id;
            
            return (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.sectionCard,
                  { backgroundColor: section.bgColor },
                  isSelected && styles.sectionCardSelected
                ]}
                onPress={() => handleSectionPress(section)}
                activeOpacity={0.7}
                testID={`education-section-${section.id}`}
              >
                <View style={styles.sectionContent}>
                  <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                    <IconComponent size={24} color="white" />
                  </View>
                  
                  <View style={styles.sectionText}>
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionCardTitle, { color: section.color }]}>
                        {section.title}
                      </Text>
                      <Text style={styles.estimatedTime}>
                        {section.estimatedTime}
                      </Text>
                    </View>
                    <Text style={styles.sectionDescription}>
                      {section.description}
                    </Text>
                  </View>
                  
                  <ChevronRight size={20} color={section.color} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Need Personal Guidance?</Text>
          <Text style={styles.ctaText}>
            Connect with Joe McLaughlin for personalized advice on your home buying journey.
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/(app)/(tabs)/advisor' as any)}
          >
            <Text style={styles.ctaButtonText}>Talk with Joe</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  heroImageContainer: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 35, 58, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  introContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 20,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionCardSelected: {
    transform: [{ scale: 0.98 }],
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionText: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  sectionCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
  },
  estimatedTime: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});