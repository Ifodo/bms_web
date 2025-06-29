'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BsBatteryCharging,
  BsSpeedometer2,
  BsBell,
  BsGrid,
  BsMap,
  BsGear,
  BsPerson,
  BsBoxArrowRight,
  BsList,
  BsX
} from 'react-icons/bs';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BsSpeedometer2 },
  { name: 'Battery Cells', href: '/dashboard/cells', icon: BsGrid },
  { name: 'Alerts', href: '/dashboard/alerts', icon: BsBell },
  { name: 'Map', href: '/dashboard/map', icon: BsMap },
  { name: 'Settings', href: '/dashboard/settings', icon: BsGear },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-700">
          <BsBatteryCharging className="h-8 w-8 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">AutoTrack</span>
            <span className="text-xs text-gray-400">Battery Management System</span>
          </div>
        </div>

        {/* Close button (mobile only) */}
        <button
          className="lg:hidden absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <BsX className="h-6 w-6" />
        </button>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700">
          <div className="px-3 py-4">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300">
              <BsPerson className="h-5 w-5" />
              <div>
                <p className="font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <BsBoxArrowRight className="h-5 w-5" />
              Sign out
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">Powered by AutoTrack IOT</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`lg:pl-64 min-h-screen flex flex-col transition-padding duration-200 ease-in-out`}
      >
        {/* Top bar */}
        <div className="h-16 border-b border-gray-700 bg-gray-800 flex items-center gap-4 px-4">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <BsList className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">
            {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
          </h1>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
} 