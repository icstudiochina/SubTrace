
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { updateProfile, updateSettings, uploadAvatar } from '../services/profileService';
import { updatePassword } from '../services/authService';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  userProfile: UserProfile | null;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
}

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKIUd5RicVkrnHk4RHO2P_qD_Zx6t2p-oz-LURmalgi0nNgT_eVeEJ1w_cHVdmpRKouc8TGOv0Ml51YEo8ubBs390Qj6Ds6RVWAu_rfQvWHXpqwtTolP1nCnsA4-4hsaKi0ayt-eULOYsyu4mIjC_CGo15nV2Hua1vOn6-xefsX1G9hu6i0xaMWS9vgKtUVh-N15CGrk7RT-M70Xr7y8zsNE_gHs-y2dkCWrUx-W3fWjh6exGfw9tMnGxE-aHED8On5gTa8SigTWw';

const Settings: React.FC<SettingsProps> = ({ onBack, onLogout, userProfile, onProfileUpdate }) => {
  const [emailNotify, setEmailNotify] = useState(userProfile?.emailNotify ?? true);
  const [reminderDays, setReminderDays] = useState(userProfile?.reminderDays ?? 7);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [email, setEmail] = useState(userProfile?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update local state when profile changes
  useEffect(() => {
    if (userProfile) {
      setEmailNotify(userProfile.emailNotify);
      setReminderDays(userProfile.reminderDays);
      setNickname(userProfile.nickname || '');
      setEmail(userProfile.email || '');
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const { profile, error: updateError } = await updateProfile({
      nickname,
      email,
    });

    setIsSaving(false);

    if (updateError) {
      setError(updateError);
    } else if (profile) {
      onProfileUpdate({
        nickname: profile.nickname,
        email: profile.email,
      });
      setIsProfileModalOpen(false);
      setSuccess('資料更新成功');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }

    if (newPassword.length < 6) {
      setError('密碼長度至少需要 6 個字符');
      return;
    }

    setIsSaving(true);

    const { error: updateError } = await updatePassword(newPassword);

    setIsSaving(false);

    if (updateError) {
      setError(updateError);
    } else {
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('密碼更新成功');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleSettingsChange = async (notify: boolean, days: number) => {
    setEmailNotify(notify);
    setReminderDays(days);

    const { error: updateError } = await updateSettings(notify, days);

    if (updateError) {
      console.error('Error updating settings:', updateError);
    } else {
      onProfileUpdate({
        emailNotify: notify,
        reminderDays: days,
      });
    }
  };

  const triggerAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsSaving(true);
        const { url, error: uploadError } = await uploadAvatar(file);
        setIsSaving(false);

        if (uploadError) {
          setError(uploadError);
          setTimeout(() => setError(null), 3000);
        } else if (url) {
          onProfileUpdate({ avatarUrl: url });
          setSuccess('頭像更新成功');
          setTimeout(() => setSuccess(null), 3000);
        }
      }
    };
    input.click();
  };

  const avatarUrl = userProfile?.avatarUrl || DEFAULT_AVATAR;

  return (
    <div className="bg-[#f6f7f9] dark:bg-background-dark flex flex-col min-h-screen font-display">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-14 flex items-center px-4 justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
          <span className="text-base font-medium">返回</span>
        </button>
        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">系統設定</h1>
        <div className="w-10"></div>
      </header>

      {/* Success/Error Toast */}
      {(success || error) && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl shadow-lg ${success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          {success || error}
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Profile Avatar Section */}
        <div className="flex flex-col items-center justify-center pb-2">
          <div className="relative w-24 h-24 mb-6">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full border-2 border-white dark:border-surface-dark shadow-sm"
              src={avatarUrl}
            />
            <button
              onClick={triggerAvatarUpload}
              disabled={isSaving}
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 border-2 border-white dark:border-surface-dark shadow-md hover:scale-110 transition-transform flex items-center justify-center disabled:opacity-50"
              aria-label="更換頭像"
            >
              {isSaving ? (
                <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">edit</span>
              )}
            </button>
          </div>
        </div>

        {/* Personal Info Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 pl-2">個人資料設定</h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-50 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">編輯個人資料</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{userProfile?.nickname || '未設定'} • {userProfile?.email || '未設定'}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <span className="text-base font-semibold text-gray-900 dark:text-white">更改密碼</span>
              </div>
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Notification Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 pl-2">通知配置</h3>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-50 dark:border-gray-800">
            <div className="p-4 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">電郵通知</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">到期時接收摘要</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => handleSettingsChange(e.target.checked, reminderDays)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900 dark:text-white">到期前提醒我</span>
                <div className="relative inline-block">
                  <select
                    value={reminderDays}
                    onChange={(e) => handleSettingsChange(emailNotify, parseInt(e.target.value))}
                    className="appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl pl-4 pr-10 py-2 text-sm font-bold text-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 5, 7, 14, 30].map(day => (
                      <option key={day} value={day}>{day} 天</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
                我們會根據此設定，在您的服務訂閱到期前發送通知。
              </p>
            </div>
          </div>
        </section>

        {/* Logout Section */}
        <section>
          <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-50 dark:border-gray-800">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
            >
              <span className="text-base font-bold text-red-500 group-hover:text-red-600">登出</span>
            </button>
          </div>
        </section>

        <div className="pt-4 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-600 font-medium tracking-wide">應用程式版本 1.0.1</p>
        </div>

        <div className="h-6"></div>
      </main>

      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1a232e] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleUpdateProfile}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-xl font-bold">編輯個人資料</h3>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="text-gray-400">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">暱稱</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">電郵 (用於接收通知)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="p-6 pt-0">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    '保存更改'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPasswordModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1a232e] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleUpdatePassword}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-xl font-bold">更改密碼</h3>
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">新密碼</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="至少 6 個字符"
                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">確認新密碼</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="再次輸入新密碼"
                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="p-6 pt-0">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    '確認更改'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
