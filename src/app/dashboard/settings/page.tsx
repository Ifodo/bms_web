'use client';

import { BsMoon, BsSun, BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 light:bg-white rounded-lg shadow-lg">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-700 light:border-gray-200">
          <h2 className="text-xl font-semibold text-white light:text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 light:text-gray-500 mb-1">Username</label>
              <p className="text-white light:text-gray-900">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 light:text-gray-500 mb-1">Email</label>
              <p className="text-white light:text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 light:text-gray-500 mb-1">Charging Station</label>
              <p className="text-white light:text-gray-900">{user?.chargingStation}</p>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white light:text-gray-900 mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 bg-gray-700/50 light:bg-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <BsMoon className="h-5 w-5 text-blue-500" />
              ) : (
                <BsSun className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium text-white light:text-gray-900">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-sm text-gray-400 light:text-gray-500">
                  {theme === 'dark'
                    ? 'Use dark theme for low light environments'
                    : 'Use light theme for better readability'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="text-2xl text-blue-500"
            >
              {theme === 'dark' ? <BsToggleOn /> : <BsToggleOff />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 