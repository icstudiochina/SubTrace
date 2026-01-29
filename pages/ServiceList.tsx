
import React, { useState, useMemo } from 'react';
import { Service, ServiceStatus } from '../types';

interface ServiceListProps {
  onBack: () => void;
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

const CATEGORIES = ['全部', '雲端服務', '軟體服務', '娛樂', '電郵', '管理', '社交', '金融'];
const FORM_CATEGORIES = ['雲端服務', '軟體服務', '娛樂', '電郵', '管理', '社交', '金融'];
const ICONS = ['cloud', 'palette', 'movie', 'music_note', 'mail', 'bug_report', 'credit_card', 'public'];
const CURRENCIES = ['$', 'HK$', '¥', '€', '£', 'US$'];

const ServiceList: React.FC<ServiceListProps> = ({ onBack, services, onAddService, onUpdateService, onDeleteService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [formState, setFormState] = useState<Partial<Service>>({
    name: '',
    category: FORM_CATEGORIES[0],
    price: '0.00',
    currency: CURRENCIES[0],
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    icon: ICONS[0],
    notes: '',
    renewalLink: ''
  });

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '全部' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormState({
      name: '',
      category: FORM_CATEGORIES[0],
      price: '0.00',
      currency: CURRENCIES[0],
      billingCycle: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      icon: ICONS[0],
      notes: '',
      renewalLink: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingId(service.id);
    const priceNumeric = service.price.replace(/[^0-9.]/g, '');
    const currency = CURRENCIES.find(c => service.price.startsWith(c)) || CURRENCIES[0];

    setFormState({
      ...service,
      price: priceNumeric,
      currency: currency
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.expiryDate) return;

    const expiry = new Date(formState.expiryDate!);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: ServiceStatus = 'active';
    if (diffDays < 0) status = 'expired';
    else if (diffDays <= 7) status = 'expiring';

    const serviceData: Service = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formState.name!,
      category: formState.category!,
      price: `${formState.currency}${formState.price}`,
      currency: formState.currency,
      billingCycle: formState.billingCycle as 'monthly' | 'yearly',
      startDate: formState.startDate!,
      expiryDate: formState.expiryDate!,
      status,
      icon: formState.icon!,
      daysRemaining: diffDays,
      notes: formState.notes,
      renewalLink: formState.renewalLink
    };

    if (editingId) {
      onUpdateService(serviceData);
    } else {
      onAddService(serviceData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-background-light dark:bg-background-dark font-display min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onBack}
          className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-gray-900 dark:text-white text-lg font-bold flex-1 text-center pr-12">所有服務</h2>
      </div>

      {/* Search and filter */}
      <div className="sticky top-[65px] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex gap-3 items-center border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400">search</span>
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border-none bg-white dark:bg-gray-800 py-3 pl-10 pr-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary shadow-sm text-sm"
            placeholder="搜尋服務..."
            type="text"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-3 pr-10 rounded-xl shadow-sm font-medium border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors appearance-none cursor-pointer text-sm outline-none ring-primary focus:ring-2"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === '全部' ? '所有類別' : cat}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[20px]">filter_list</span>
        </div>
      </div>

      {/* Service List */}
      <div className="flex-1 flex flex-col gap-3 p-4 pb-24">
        {filteredServices.map((service, idx) => (
          <div key={service.id} className={`flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-visible transition-all group ${service.status === 'expiring' ? 'border-amber-200 ring-1 ring-amber-100 shadow-amber-500/10' :
              service.status === 'expired' ? 'border-red-100 ring-1 ring-red-50' : 'border-gray-100 dark:border-gray-700'
            }`}>
            <div className="flex gap-4 p-4 items-center">
              <span className="text-gray-400 text-xs font-mono font-bold w-6 text-center">{(idx + 1).toString().padStart(2, '0')}</span>
              <div className={`flex items-center justify-center rounded-xl shrink-0 size-12 shadow-sm ${service.status === 'expired' ? 'bg-red-50 text-red-500' :
                  service.status === 'expiring' ? 'bg-amber-50 text-amber-500' :
                    'bg-blue-50 text-primary'
                }`}>
                <span className="material-symbols-outlined">{service.icon}</span>
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-gray-900 dark:text-white text-base font-bold truncate">{service.name}</p>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${service.status === 'expired' ? 'bg-red-50 text-red-700' :
                      service.status === 'expiring' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                    }`}>
                    {service.category}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">開始日期 {service.startDate.replace(/-/g, '/')}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {service.status === 'expiring' && <span className="material-symbols-outlined text-[14px] text-red-500">warning</span>}
                  <p className={`text-xs ${service.status === 'expiring' ? 'text-red-600 font-bold' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    到期日期 <span className="font-bold">{service.expiryDate.replace(/-/g, '/')}</span>
                    {service.status === 'expiring' && ` (將於 ${service.daysRemaining} 天後到期)`}
                    {service.status === 'expired' && ` (已過期 ${Math.abs(service.daysRemaining)} 天)`}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setActiveMenuId(activeMenuId === service.id ? null : service.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
                {activeMenuId === service.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)}></div>
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-40 overflow-hidden animate-in fade-in zoom-in duration-100 origin-top-right">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                        <span className="font-medium">編輯</span>
                      </button>
                      <button
                        onClick={() => {
                          onDeleteService(service.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-gray-100 dark:border-gray-700"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        <span className="font-medium">刪除</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-6 right-6 z-30 flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all duration-200 ring-4 ring-white dark:ring-background-dark"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a232e] rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200 no-scrollbar">
            <div className="sticky top-0 bg-white dark:bg-[#1a232e] z-10 p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? '編輯訂閱服務' : '新增訂閱服務'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">服務名稱</label>
                <input
                  required
                  type="text"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-primary focus:border-primary"
                  placeholder="例如: Netflix, AWS..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">類別</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState({ ...formState, category: e.target.value })}
                    className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-primary focus:border-primary"
                  >
                    {FORM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">價格</label>
                  <div className="flex">
                    <select
                      value={formState.currency}
                      onChange={e => setFormState({ ...formState, currency: e.target.value })}
                      className="h-12 rounded-l-xl border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary border-r-0 min-w-[70px]"
                    >
                      {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={formState.price}
                      onChange={e => setFormState({ ...formState, price: e.target.value })}
                      className="flex-1 min-w-0 h-12 rounded-r-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">圖標</label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormState({ ...formState, icon })}
                      className={`flex-shrink-0 size-12 rounded-xl flex items-center justify-center border-2 transition-all ${formState.icon === icon ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">開始日期</label>
                  <input
                    type="date"
                    value={formState.startDate}
                    onChange={e => setFormState({ ...formState, startDate: e.target.value })}
                    className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">到期日期</label>
                  <input
                    required
                    type="date"
                    value={formState.expiryDate}
                    onChange={e => setFormState({ ...formState, expiryDate: e.target.value })}
                    className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">續期鏈接 (URL)</label>
                <input
                  type="url"
                  value={formState.renewalLink}
                  onChange={e => setFormState({ ...formState, renewalLink: e.target.value })}
                  className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm px-4 focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/renew"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">備註信息</label>
                <textarea
                  value={formState.notes}
                  onChange={e => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-primary focus:border-primary p-4 min-h-[100px]"
                  placeholder="在此處添加備註..."
                />
              </div>

              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95"
                >
                  {editingId ? '保存更改' : '確認新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
