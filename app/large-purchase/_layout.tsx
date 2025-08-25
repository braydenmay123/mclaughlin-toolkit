import { Stack } from 'expo-router';

export default function LargePurchaseLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Large Purchase Calculator',
          headerStyle: { backgroundColor: '#04233a' },
          headerTintColor: '#fff'
        }} 
      />
      <Stack.Screen 
        name="results" 
        options={{ 
          title: 'Purchase Scenarios',
          headerStyle: { backgroundColor: '#04233a' },
          headerTintColor: '#fff'
        }} 
      />
    </Stack>
  );
}