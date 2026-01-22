
import React from 'react';
import { Page, UserProfile } from '../types';
import { IMAGES } from '../constants.tsx';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  urgentCount: number;
  userProfile?: UserProfile | null;
}

const DEFAULT_AVATAR = IMAGES.USER_AVATAR;

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, urgentCount, userProfile }) => {
  const navItems = [
    { page: Page.DASHBOARD, label: '儀表板', icon: 'dashboard' },
    { page: Page.RENEWALS, label: '急需續期', icon: 'notification_important', badge: urgentCount },
    { page: Page.SERVICES, label: '所有服務', icon: 'list_alt' },
    { page: Page.SETTINGS, label: '系統設定', icon: 'settings' },
  ];

  // Dynamic user info from profile
  const displayName = userProfile?.nickname || userProfile?.email?.split('@')[0] || '用戶';
  const displayEmail = userProfile?.email || '未設定電郵';
  const avatarUrl = userProfile?.avatarUrl || DEFAULT_AVATAR;

  return (
    <div className="flex h-full w-[280px] flex-col bg-white dark:bg-surface-dark shadow-2xl overflow-hidden border-r border-gray-100 dark:border-gray-800">
      <div className="pt-12 pb-6 px-6 bg-background-light dark:bg-background-dark/50 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              alt="Profile"
              className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
              src={avatarUrl}
            />
            <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">{displayName}</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{displayEmail}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`group flex h-12 items-center gap-4 rounded-xl px-4 transition-all duration-200 ${currentPage === item.page
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${currentPage === item.page ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {item.icon}
              </span>
              <span className="text-[15px] font-semibold leading-tight flex-1 text-left">
                {item.label}
              </span>
              {!!item.badge && item.badge > 0 && (
                <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold shadow-sm ${currentPage === item.page ? 'bg-white text-primary' : 'bg-primary text-white shadow-primary/30'
                  }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <button
          onClick={onLogout}
          className="group flex w-full h-12 items-center gap-4 rounded-xl px-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px] rotate-180">logout</span>
          <span className="text-[15px] font-semibold leading-tight">登出</span>
        </button>
        <div className="mt-4">
          <p className="text-[10px] text-gray-400 text-center">版本 1.0.1</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
