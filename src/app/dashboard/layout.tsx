'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BsBatteryCharging,
  BsSpeedometer2,
  BsBell,
  BsGrid,
  BsGear,
  BsPerson,
  BsBoxArrowRight,
  BsList,
  BsX,
  BsLayoutSidebarInset,
  BsLayoutSidebar
} from 'react-icons/bs';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: BsSpeedometer2 },
  { name: 'Battery Cells', href: '/dashboard/cells', icon: BsGrid },
  { name: 'Alerts', href: '/dashboard/alerts', icon: BsBell },
  { name: 'Settings', href: '/dashboard/settings', icon: BsGear },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Save collapsed state to localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!user) {
    return null; // or a loading spinner
  }

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
        className={`fixed inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center gap-2 px-4 border-b border-gray-700 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <BsBatteryCharging className="h-8 w-8 text-blue-500 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xl font-bold text-white truncate">AutoTrack</span>
              <span className="text-xs text-gray-400 truncate">BMS</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isItemActive = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isItemActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  aria-label={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {/* Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700">
          <div className={`px-2 py-4 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center gap-3 px-3 py-2 text-sm text-gray-300 group relative ${isCollapsed ? 'justify-center' : ''}`}>
              <BsPerson className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="font-medium text-white truncate">{user?.username}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-xs">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`mt-2 flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors group relative ${isCollapsed ? 'justify-center' : ''}`}
              aria-label={isCollapsed ? 'Sign out' : undefined}
            >
              <BsBoxArrowRight className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span className="truncate">Sign out</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Sign out
                </div>
              )}
            </button>
            {!isCollapsed && (
              <p className="text-xs text-gray-500 text-center mt-4 truncate">Powered by AutoTrack IOT</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        } min-h-screen flex flex-col`}
      >
        {/* Top bar */}
        <div className="h-16 border-b border-gray-700 bg-gray-800 flex items-center px-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-400 hover:text-white mr-3"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <BsList className="h-6 w-6" />
          </button>

          {/* Collapse button moved to left of title */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center text-gray-400 hover:text-white transition-colors group relative mr-3"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <BsLayoutSidebar className="h-5 w-5" />
            ) : (
              <BsLayoutSidebarInset className="h-5 w-5" />
            )}
            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </span>
          </button>

          <h1 className="text-xl font-semibold text-white truncate">
            {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
          </h1>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
} 