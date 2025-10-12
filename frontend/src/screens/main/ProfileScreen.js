import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { loading, execute } = useApi();
  
  const [formData, setFormData] = useState({
    weight_kg: '',
    height_cm: '',
    goal: '',
    preferences: [],
    allergies: [],
  });
  
  const [preferencesText, setPreferencesText] = useState('');
  const [allergiesText, setAllergiesText] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        weight_kg: profile.weight_kg?.toString() || '',
        height_cm: profile.height_cm?.toString() || '',
        goal: profile.goal || '',
        preferences: profile.preferences || [],
        allergies: profile.allergies || [],
      });
      setPreferencesText((profile.preferences || []).join(', '));
      setAllergiesText((profile.allergies || []).join(', '));
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    const preferences = preferencesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const allergies = allergiesText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const updatedData = {
      ...formData,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      preferences,
      allergies,
    };

    const result = await execute(() => updateProfile(updatedData));
    
    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const goalOptions = [
    { value: 'lose_fat', label: 'Lose Fat' },
    { value: 'gain_muscle', label: 'Gain Muscle' },
    { value: 'maintain', label: 'Maintain Weight' },
    { value: 'general_health', label: 'General Health' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your personal information</Text>
      </View>

      <Card style={styles.userInfoCard}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userLabel}>Email Address</Text>
        </View>
      </Card>

      <Card style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        
        <TextInput
          label="Weight (kg)"
          placeholder="Enter your weight"
          value={formData.weight_kg}
          onChangeText={(value) => setFormData({ ...formData, weight_kg: value })}
          keyboardType="numeric"
        />

        <TextInput
          label="Height (cm)"
          placeholder="Enter your height"
          value={formData.height_cm}
          onChangeText={(value) => setFormData({ ...formData, height_cm: value })}
          keyboardType="numeric"
        />

        <View style={styles.goalSection}>
          <Text style={styles.label}>Health Goal</Text>
          {goalOptions.map((option) => (
            <View key={option.value} style={styles.goalOption}>
              <Text style={styles.goalLabel}>{option.label}</Text>
              <Switch
                value={formData.goal === option.value}
                onValueChange={(value) => {
                  if (value) {
                    setFormData({ ...formData, goal: option.value });
                  }
                }}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={formData.goal === option.value ? COLORS.surface : COLORS.textSecondary}
              />
            </View>
          ))}
        </View>

        <TextInput
          label="Food Preferences"
          placeholder="e.g., spicy, vegetarian, gluten-free"
          value={preferencesText}
          onChangeText={setPreferencesText}
          multiline
        />

        <TextInput
          label="Allergies"
          placeholder="e.g., peanuts, shellfish, dairy"
          value={allergiesText}
          onChangeText={setAllergiesText}
          multiline
        />

        <Button
          title="Update Profile"
          onPress={handleUpdateProfile}
          loading={loading}
          style={styles.updateButton}
        />
      </Card>

      <Card style={styles.logoutCard}>
        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  userInfoCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  userInfo: {
    alignItems: 'center',
  },
  userEmail: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  userLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  profileCard: {
    marginBottom: SPACING.md,
  },
  goalSection: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  goalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  goalLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  updateButton: {
    marginTop: SPACING.md,
  },
  logoutCard: {
    marginBottom: SPACING.xl,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
});

export default ProfileScreen;
