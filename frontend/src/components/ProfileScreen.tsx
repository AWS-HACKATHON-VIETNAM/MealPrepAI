import {
  User,
  Target,
  Scale,
  Activity,
  Heart,
  ChevronRight,
  LogOut,
  Package,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile as UserProfileType } from '../types/api.types';
import { UserProfile as Profile } from '../types/api.types';

interface ProfileScreenProps {
  onNavigateToPantry?: () => void;
}

const GOAL_OPTIONS = [
  { value: 'lose_fat', label: 'Lose Fat' },
  { value: 'gain_muscle', label: 'Gain Muscle' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'general_health', label: 'General Health' },
] as const;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

const GOAL_LABELS: Record<string, string> = {
  lose_fat: 'Lose Fat',
  gain_muscle: 'Gain Muscle',
  maintain: 'Maintain Weight',
  general_health: 'General Health',
};

export function ProfileScreen({ onNavigateToPantry }: ProfileScreenProps = {}) {
  const { profile, logout, updateProfile, isLoading } = useAuth();
  const [editingMetric, setEditingMetric] = useState<
    'weight' | 'height' | 'goal' | 'gender' | null
  >(null);
  const [metricFormValue, setMetricFormValue] = useState('');
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const [isDietDialogOpen, setIsDietDialogOpen] = useState(false);
  const [preferencesInput, setPreferencesInput] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [dietError, setDietError] = useState('');
  const [isSavingDiet, setIsSavingDiet] = useState(false);

  const calculateBMI = () => {
    if (
      !profile ||
      profile.weight_kg === null ||
      profile.height_cm === null ||
      profile.height_cm === 0
    ) {
      return 'N/A';
    }

    const heightInMeters = profile.height_cm / 100;
    const bmi = profile.weight_kg / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  useEffect(() => {
    if (!profile) {
      return;
    }

    if (!isDietDialogOpen) {
      setPreferencesInput(profile.preferences.join('\n'));
      setAllergiesInput(profile.allergies.join('\n'));
    }
  }, [profile, isDietDialogOpen]);

  const handleEditMetric = (
    metric: 'weight' | 'height' | 'goal' | 'gender'
  ) => {
    setEditingMetric(metric);
    if (profile) {
      switch (metric) {
        case 'weight':
          setMetricFormValue(
            profile.weight_kg !== null ? profile.weight_kg.toString() : ''
          );
          break;
        case 'height':
          setMetricFormValue(
            profile.height_cm !== null ? profile.height_cm.toString() : ''
          );
          break;
        case 'goal':
          setMetricFormValue(profile.goal ?? '');
          break;
        case 'gender':
          setMetricFormValue(profile.gender ?? 'none');
          break;
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMetric(null);
  };

  const handleMetricsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMetric) return;
    
    setMetricsError(null);
    setIsSavingMetrics(true);

    const getNumericValue = (value: string) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    };

    let updateData: Partial<Profile> = {};
    if (editingMetric === 'weight') {
        const numericValue = getNumericValue(metricFormValue);
        if (numericValue !== null) {
            updateData.weight_kg = numericValue;
        } else {
            setMetricsError(`Please enter a valid number for weight.`);
            setIsSavingMetrics(false);
            return;
        }
    } else if (editingMetric === 'height') {
        const numericValue = getNumericValue(metricFormValue);
        if (numericValue !== null) {
            updateData.height_cm = numericValue;
        } else {
            setMetricsError(`Please enter a valid number for height.`);
            setIsSavingMetrics(false);
            return;
        }
    } else if (editingMetric === 'goal') {
        if (!metricFormValue) {
          setMetricsError('Please select a goal.');
          setIsSavingMetrics(false);
          return;
        }
        updateData.goal = metricFormValue as Profile['goal'];
    } else if (editingMetric === 'gender') {
        updateData.gender = metricFormValue as Profile['gender'];
    }


    try {
      await updateProfile(updateData);
      setEditingMetric(null); // Close dialog on success
    } catch (error) {
      console.error("Failed to update body metrics:", error);
      setMetricsError("Failed to update. Please try again.");
    } finally {
      setIsSavingMetrics(false);
    }
  };

  const handleDietSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDietError('');

    const parseListInput = (value: string) =>
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

    const preferencesList = parseListInput(preferencesInput);
    const allergiesList = parseListInput(allergiesInput);

    try {
      setIsSavingDiet(true);
      await updateProfile({
        preferences: preferencesList,
        allergies: allergiesList,
      });
      setIsDietDialogOpen(false);
    } catch (error) {
      setDietError(
        error instanceof Error ? error.message : 'Failed to update dietary information.'
      );
    } finally {
      setIsSavingDiet(false);
    }
  };

  const formatGoal = (goal: UserProfileType['goal']) => {
    if (!goal) {
      return 'Not set';
    }

    return GOAL_LABELS[goal] ?? goal;
  };

  const formatGender = (gender: UserProfileType['gender']) => {
    if (!gender) {
      return 'Not set';
    }

    const match = GENDER_OPTIONS.find((option) => option.value === gender);
    return match ? match.label : gender;
  };

  const preferences = profile?.preferences || [];
  const allergies = profile?.allergies || [];

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (profile?.first_name) {
      return profile.first_name;
    }
    return 'User';
  };

  const handleLogout = () => {
    logout();
    // App.tsx will automatically redirect to login screen
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Profile details are not available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col pt-12 pb-20 bg-white overflow-y-auto relative scrollbar-hide">
        {/* Dialog Overlay - positioned relative to this container */}
        {editingMetric && (
          <div className="absolute inset-0 bg-black/30 z-40 flex items-center justify-center backdrop-blur-sm rounded-[40px]">
            <div className="bg-white rounded-2xl p-6 w-[85vw] max-w-sm shadow-xl z-50 border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingMetric === 'weight' && 'Update Weight'}
                    {editingMetric === 'height' && 'Update Height'}
                    {editingMetric === 'goal' && 'Update Goal'}
                    {editingMetric === 'gender' && 'Update Gender'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    {editingMetric === 'weight' && 'Enter your current weight to keep your profile up to date.'}
                    {editingMetric === 'height' && 'Enter your height for accurate health metrics.'}
                    {editingMetric === 'goal' && 'Select your fitness goal to personalize your experience.'}
                    {editingMetric === 'gender' && 'Select your gender for better recommendations.'}
                  </p>
                </div>
                <button
                  onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleMetricsSubmit} className="space-y-6 mt-4 overflow-y-auto flex-1">
            {['weight', 'height'].includes(editingMetric) && (
              <div className="grid gap-3">
                <Label htmlFor="metric-value" className="text-gray-800 text-sm font-medium">
                  {editingMetric === 'weight' ? 'Weight (kg)' : 'Height (cm)'}
                </Label>
                <Input
                  id="metric-value"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={metricFormValue}
                  onChange={(e) => setMetricFormValue(e.target.value)}
                  placeholder={editingMetric === 'weight' ? 'Enter weight' : 'Enter height'}
                  className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all p-3"
                  autoFocus
                />
              </div>
            )}

            {editingMetric === 'goal' && (
            <div className="grid gap-3 w-full">
              <Label htmlFor="goal" className="text-gray-800 text-sm font-medium">
                Goal
              </Label>

              <Select value={metricFormValue} onValueChange={setMetricFormValue}>
                <SelectTrigger
                  id="goal"
                  className="bg-white border border-gray-200 text-gray-900 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all p-3 flex items-center justify-between shadow-sm hover:border-gray-300 w-full"
                >
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  align="start"
                  style={{ width: 'var(--radix-select-trigger-width)' }}
                  className="bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 animate-[fadeIn_0.15s_ease-out] box-border"
                >
                  <div className="px-3 py-2 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                    Choose your focus
                  </div>

                  

                  {GOAL_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md transition-colors"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            )}


            {editingMetric === 'gender' && (
              <div className="grid gap-3 w-full">
                <Label htmlFor="gender" className="text-gray-800 text-sm font-medium">Gender</Label>
                <Select value={metricFormValue} onValueChange={setMetricFormValue}>
                  <SelectTrigger
                    id="gender"
                    className="bg-white border border-gray-200 text-gray-900 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all p-3 flex items-center justify-between shadow-sm hover:border-gray-300 w-full"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    align="start"
                    style={{ width: 'var(--radix-select-trigger-width)' }}
                    className="bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 animate-[fadeIn_0.15s_ease-out] box-border"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                      Choose your gender
                    </div>
                    <SelectItem
                      value="none"
                      className="cursor-pointer text-gray-600 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md transition-colors"
                    >
                      Not specified
                    </SelectItem>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-md transition-colors"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {metricsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{metricsError}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-[4px] transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingMetrics}
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-[4px] hover:bg-orange-600 transition-all text-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isSavingMetrics && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSavingMetrics ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-gray-900">Profile</h2>
        </div>

        {/* User Info */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">{getUserDisplayName()}</h3>
              <p className="text-gray-500">{profile?.email || ''}</p>
            </div>
          </div>
        </div>
        {/* Body Metrics */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-gray-700 mb-4">Body Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <p className="text-blue-600 text-sm">Weight</p>
                </div>
                <button
                  onClick={() => handleEditMetric('weight')}
                  className="text-orange-500 text-sm"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-900">
                {profile.weight_kg !== null
                  ? `${profile.weight_kg} kg`
                  : 'Not set'}
              </p>
            </div>

            {/* Height */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <p className="text-green-600 text-sm">Height</p>
                </div>
                <button
                  onClick={() => handleEditMetric('height')}
                  className="text-orange-500 text-sm"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-900">
                {profile.height_cm !== null
                  ? `${profile.height_cm} cm`
                  : 'Not set'}
              </p>
            </div>

            {/* BMI */}
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <p className="text-purple-600 text-sm">BMI</p>
              </div>
              <p className="text-gray-900">{calculateBMI()}</p>
            </div>

            {/* Goal */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <p className="text-orange-600 text-sm">Goal</p>
                </div>
                <button
                  onClick={() => handleEditMetric('goal')}
                  className="text-orange-500 text-sm"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-900 text-sm">
                {formatGoal(profile.goal)}
              </p>
            </div>

            {/* Gender */}
            <div className="bg-pink-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-600" />
                  <p className="text-pink-600 text-sm">Gender</p>
                </div>
                <button
                  onClick={() => handleEditMetric('gender')}
                  className="text-orange-500 text-sm"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-900 text-sm">
                {formatGender(profile.gender)}
              </p>
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-700">Food Preferences</h3>
            <button
              onClick={() => setIsDietDialogOpen(true)}
              className="text-orange-500 text-sm"
            >
              Edit
            </button>
          </div>
          {preferences.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-orange-50 text-orange-700 rounded-full text-sm"
                >
                  {pref}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No preferences set</p>
          )}
        </div>

        {/* Allergies */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-gray-700 mb-3">Allergies & Restrictions</h3>
          {allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-full text-sm border border-red-200"
                >
                  {allergy}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No allergies recorded</p>
          )}
        </div>

        {isDietDialogOpen && (
          <div className="absolute inset-0 bg-black/30 z-40 flex items-center justify-center backdrop-blur-sm rounded-[40px]">
            <div className="bg-white rounded-2xl p-6 w-[85vw] max-w-sm shadow-xl z-50 border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Update Dietary Preferences</h2>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    Tell us about your food preferences and any allergies or restrictions.
                  </p>
                </div>
                <button
                  onClick={() => setIsDietDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleDietSubmit} className="space-y-6 mt-4 overflow-y-auto flex-1">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="preferences" className="text-gray-800 text-sm font-medium">Food Preferences</Label>
                    <Textarea
                      id="preferences"
                      rows={4}
                      value={preferencesInput}
                      onChange={(event) => setPreferencesInput(event.target.value)}
                      placeholder="Enter each preference on a new line or separate with commas"
                      className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all p-3"
                      autoFocus
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="allergies" className="text-gray-800 text-sm font-medium">Allergies & Restrictions</Label>
                    <Textarea
                      id="allergies"
                      rows={4}
                      value={allergiesInput}
                      onChange={(event) => setAllergiesInput(event.target.value)}
                      placeholder="Enter each allergy on a new line or separate with commas"
                      className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all p-3"
                    />
                  </div>
                </div>

                {dietError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{dietError}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsDietDialogOpen(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-[4px] transition-all font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDiet}
                    className="px-6 py-2 bg-orange-500 text-white font-medium rounded-[4px] hover:bg-orange-600 transition-all text-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSavingDiet && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Menu */}
        <div className="px-6 py-4 space-y-2">
          {onNavigateToPantry && (
            <button
              onClick={onNavigateToPantry}
              className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-xl hover:bg-orange-100 border border-orange-200"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-orange-500" />
                <span className="text-orange-700 font-medium">My Pantry</span>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-400" />
            </button>
          )}
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100">
            <span className="text-gray-700">Meal History</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100">
            <span className="text-gray-700">Nutrition Goals</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100">
            <span className="text-gray-700">Settings</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <div className="px-6 py-4">
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </div>

      </div>

      
    </>
  );
}
