import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/state/AuthContext';
import { ProfileProvider } from './src/state/ProfileContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ProfileProvider>
    </AuthProvider>
  );
}
