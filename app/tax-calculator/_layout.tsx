import { Stack } from 'expo-router';

export default function TaxCalculatorLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Income Tax Calculator',
          headerStyle: { backgroundColor: '#04233a' },
          headerTintColor: '#fff'
        }} 
      />
      <Stack.Screen 
        name="results" 
        options={{ 
          title: 'Tax Results',
          headerStyle: { backgroundColor: '#04233a' },
          headerTintColor: '#fff'
        }} 
      />
    </Stack>
  );
}