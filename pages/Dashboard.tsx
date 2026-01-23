
import React from 'react';
import { Page, Service, UserProfile } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  services: Service[];
  userProfile?: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, services, userProfile }) => {
  const activeCount = services.filter(s => s.status === 'active').length;
  const expiringCount = services.filter(s => s.status === 'expiring').length;
  const expiredCount = services.filter(s => s.status === 'expired').length;

  const displayName = userProfile?.nickname || userProfile?.email?.split('@')[0] || '用戶';

  const stats = [
    { label: '服務總數', value: services.length, icon: 'inventory_2', color: 'blue' },
    { label: '服務正常', value: activeCount, icon: 'check_circle', color: 'green' },
    { label: '即將到期', value: expiringCount, icon: 'timer', color: 'amber', badge: '需注意' },
    { label: '服務中斷', value: expiredCount, icon: 'error', color: 'red', badge: '需續訂' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="w-full">
        <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">歡迎回來，{displayName}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">以下是你訂閱服務的最新狀況。</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col gap-3 rounded-2xl p-5 shadow-sm border relative group cursor-pointer hover:shadow-md transition-all ${stat.color === 'blue' ? 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-800' :
                stat.color === 'green' ? 'bg-white dark:bg-surface-dark border-slate-100 dark:border-slate-800' :
                  stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/50' :
                    'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/50'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-xl ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-primary' :
                  stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/30 text-green-600' :
                    stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-800/40 text-amber-700' :
                      'bg-red-100 dark:bg-red-800/40 text-red-700'
                }`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              {stat.value > 0 && stat.badge && (
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${stat.color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {stat.badge}
                </span>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${stat.color === 'amber' ? 'text-amber-900 dark:text-amber-100/70' :
                  stat.color === 'red' ? 'text-red-900 dark:text-red-100/70' :
                    'text-slate-500 dark:text-slate-400'
                }`}>{stat.label}</p>
              <p className={`text-3xl font-bold tracking-tight mt-1 ${stat.color === 'amber' ? 'text-amber-900 dark:text-amber-100' :
                  stat.color === 'red' ? 'text-red-900 dark:text-red-100' :
                    'text-slate-900 dark:text-white'
                }`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 pb-2">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">最近動態</h3>
        <button
          onClick={() => onNavigate(Page.SERVICES)}
          className="text-primary text-sm font-semibold hover:text-blue-600 transition-colors"
        >
          查看全部
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {services.slice(0, 4).map((service) => (
          <div
            key={service.id}
            onClick={() => onNavigate(Page.SERVICES)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all hover:scale-[1.01]"
          >
            <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">{service.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-slate-900 dark:text-white font-bold truncate pr-2">{service.name}</h4>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${service.status === 'expired' ? 'bg-red-100 text-red-700' :
                    service.status === 'expiring' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                  }`}>
                  {service.status === 'expired' ? '服務中斷' : service.status === 'expiring' ? '即將到期' : '服務正常'}
                </span>
              </div>
              <p className={`text-sm mt-0.5 truncate ${service.status === 'expired' ? 'text-red-600' :
                  service.status === 'expiring' ? 'text-amber-600' :
                    'text-slate-500'
                }`}>
                {service.status === 'expired' ? `已過期 ${Math.abs(service.daysRemaining)} 天` :
                  service.status === 'expiring' ? `${service.daysRemaining} 天後到期` :
                    '穩定使用中'}
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">chevron_right</span>
          </div>
        ))}
        {services.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">尚無服務，請點擊右下方按鈕新增。</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onNavigate(Page.SERVICES)}
          className="bg-primary hover:bg-blue-600 text-white rounded-full size-14 shadow-lg flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
