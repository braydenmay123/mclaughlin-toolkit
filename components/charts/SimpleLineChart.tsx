import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText } from 'react-native-svg';
import Colors from '@/constants/colors';

interface SimpleLineChartProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
}

export default function SimpleLineChart({
  data,
  labels,
  width = 300,
  height = 200,
}: SimpleLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const valueRange = maxValue - minValue || 1;

  // Generate points for the polyline
  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  // Generate grid lines
  const gridLines = [];
  const numGridLines = 4;
  for (let i = 0; i <= numGridLines; i++) {
    const y = padding + (i / numGridLines) * chartHeight;
    gridLines.push(
      <Line
        key={`grid-${i}`}
        x1={padding}
        y1={y}
        x2={padding + chartWidth}
        y2={y}
        stroke={Colors.borderLight}
        strokeWidth="1"
        opacity="0.5"
      />
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {gridLines.map(line => line)}
        
        {/* Main line */}
        <Polyline
          points={points}
          fill="none"
          stroke={Colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Y-axis labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const value = minValue + (i / 4) * valueRange;
          const y = padding + chartHeight - (i / 4) * chartHeight;
          return (
            <SvgText
              key={`y-label-${i}`}
              x={padding - 10}
              y={y + 4}
              fontSize="12"
              fill={Colors.textSecondary}
              textAnchor="end"
            >
              {value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${Math.round(value)}`}
            </SvgText>
          );
        })}
        
        {/* X-axis labels */}
        {labels && labels.map((label, index) => {
          const x = padding + (index / (labels.length - 1)) * chartWidth;
          return (
            <SvgText
              key={`x-label-${index}`}
              x={x}
              y={height - 10}
              fontSize="12"
              fill={Colors.textSecondary}
              textAnchor="middle"
            >
              {String(label)}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});