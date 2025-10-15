import { User, Target, Scale, Activity, Heart, ChevronRight, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function ProfileScreen() {
  const { profile, logout } = useAuth();
  const [isLoading] = useState(false);

  const calculateBMI = () => {
    if (profile?.weight_kg && profile?.height_cm) {
      const heightInMeters = profile.height_cm / 100;
      const bmi = profile.weight_kg / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return 'N/A';
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

  return (
    <div className="h-full flex flex-col pt-12 pb-20 bg-white overflow-y-auto">
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
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <p className="text-blue-600 text-sm">Weight</p>
            </div>
            <p className="text-gray-900">{profile?.weight_kg ? `${profile.weight_kg} kg` : 'Not set'}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-600" />
              <p className="text-green-600 text-sm">Height</p>
            </div>
            <p className="text-gray-900">{profile?.height_cm ? `${profile.height_cm} cm` : 'Not set'}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <p className="text-purple-600 text-sm">BMI</p>
            </div>
            <p className="text-gray-900">{calculateBMI()}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <p className="text-orange-600 text-sm">Goal</p>
            </div>
            <p className="text-gray-900 text-sm">{profile?.goal || 'Not set'}</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700">Food Preferences</h3>
          <button className="text-orange-500 text-sm">Edit</button>
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700">Allergies & Restrictions</h3>
          <button className="text-orange-500 text-sm">Edit</button>
        </div>
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

      {/* Settings Menu */}
      <div className="px-6 py-4 space-y-2">
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
  );
}
