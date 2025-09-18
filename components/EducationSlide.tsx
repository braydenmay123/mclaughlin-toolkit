import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import SimpleLineChart from '@/components/charts/SimpleLineChart';

export interface EducationSlideChart {
  type: 'line';
  data: number[];
  labels?: string[];
  title?: string;
}

export interface EducationSlideData {
  title: string;
  content: string[];
  chart?: EducationSlideChart;
  placeholder?: string;
}

interface Props {
  slide: EducationSlideData;
  testID?: string;
  titleRef?: any;
}

export default function EducationSlide({ slide, testID, titleRef }: Props) {
  return (
    <View style={styles.container} testID={testID ?? 'education-slide'}>
      <Text
        style={styles.title}
        accessibilityRole="header"
        // @ts-ignore forward ref for web focus where supported
        ref={titleRef}
      >
        {slide.title}
      </Text>

      {slide.chart ? (
        <View style={styles.chartContainer} testID="education-slide-chart">
          <Text style={styles.chartTitle}>{slide.chart.title ?? 'Chart'}</Text>
          <SimpleLineChart data={slide.chart.data} labels={slide.chart.labels} />
        </View>
      ) : slide.placeholder ? (
        <View style={styles.placeholder} testID="education-slide-placeholder">
          <Text style={styles.placeholderText}>{slide.placeholder}</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        {slide.content.map((paragraph, idx) => (
          <Text key={idx} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
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
  placeholder: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    gap: 16,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 26,
    color: Colors.text,
    fontWeight: '400',
  },
});