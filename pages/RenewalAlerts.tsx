
import React from 'react';
import { Service } from '../types';

interface RenewalAlertsProps {
  onBack: () => void;
  services: Service[];
}

const RenewalAlerts: React.FC<RenewalAlertsProps> = ({ onBack, services }) => {
  const urgentServices = services.filter(s => s.status === 'expired' || s.status === 'expiring');
  const expiredCount = services.filter(s => s.status === 'expired').length;
  const expiringCount = services.filter(s => s.status === 'expiring').length;

  const handleRenewClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert('未提供續期鏈接');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <div className="sticky top-0 z-10 flex items-center px-4 py-3 justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[#111418] dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-[#111418] dark:text-white text-lg font-bold flex-1 text-center">急需續期</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex gap-3 p-4">
        <div className="flex flex-1 flex-col gap-1 rounded-2xl p-4 bg-white dark:bg-[#1e2936] shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-red-500 text-xl">error_outline</span>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">已過期</p>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">{expiredCount}</p>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-2xl p-4 bg-white dark:bg-[#1e2936] shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-xl">warning</span>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">即將到期</p>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">{expiringCount}</p>
        </div>
      </div>

      <div className="px-4 pb-2">
        <h3 className="text-xs font-semibold text-[#617589] dark:text-gray-400 uppercase tracking-widest">待處理事項</h3>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-20">
        {urgentServices.map((service) => {
          const isExpired = service.daysRemaining <= 0;
          
          return (
            <div 
              key={service.id}
              className={`relative flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-[#1e2936] shadow-sm border transition-all ${
                isExpired ? 'border-red-100 ring-1 ring-red-50 dark:ring-red-900/10' : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              {/* Top Row: Icon and Info */}
              <div className="flex items-start gap-4 pr-20">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl h-14 w-14 shrink-0 shadow-inner flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                  <span className={`material-symbols-outlined text-3xl ${
                    isExpired ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {service.icon}
                  </span>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-[#111418] dark:text-white text-base font-bold truncate mb-1">{service.name}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-inset ring-primary/20 uppercase">
                      {service.category}
                    </span>
                    <span className="text-[#617589] dark:text-gray-400 text-xs font-medium">
                      {service.price}/{service.billingCycle === 'monthly' ? '月' : '年'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Absolute Badge at Top Right */}
              <div className="absolute top-4 right-4">
                <span className={`text-sm font-bold whitespace-nowrap px-2 py-0.5 rounded ${
                  isExpired 
                    ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                    : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                }`}>
                  {service.daysRemaining} 天
                </span>
              </div>

              {/* Full Width Button */}
              <button 
                onClick={() => handleRenewClick(service.renewalLink)}
                className="flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal transition-all shadow-md active:scale-[0.98]"
              >
                立即續期
              </button>
            </div>
          );
        })}
        {urgentServices.length === 0 && (
          <div className="py-20 text-center bg-white dark:bg-[#1e2936] rounded-2xl border border-gray-100 dark:border-gray-700">
            <span className="material-symbols-outlined text-5xl text-gray-200 dark:text-gray-700 mb-4">check_circle</span>
            <p className="text-gray-500">太棒了！目前沒有即將到期的訂閱。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalAlerts;
