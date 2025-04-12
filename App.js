
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CalendarScreen from './screens/CalendarScreen';

export default function App() {
  return (
    <NavigationContainer>
      <CalendarScreen />
    </NavigationContainer>
  );
}
