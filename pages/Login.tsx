
import React, { useState } from 'react';
import { signIn, resetPassword } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);

    setIsLoading(false);

    if (signInError) {
      setError(signInError);
    } else {
      onLogin();
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('請輸入電郵地址');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: resetError } = await resetPassword(email);

    setIsLoading(false);

    if (resetError) {
      setError(resetError);
    } else {
      setResetEmailSent(true);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display p-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-pattern opacity-60 pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[380px] bg-white dark:bg-[#1a232e] rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col items-center pt-10 pb-4 px-6 text-center">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary shadow-sm ring-1 ring-primary/20">
              <span className="material-symbols-outlined text-[32px]">lock_reset</span>
            </div>
            <h1 className="text-[#111418] dark:text-white tracking-tight text-[26px] font-bold leading-tight pb-2">
              {resetEmailSent ? '郵件已發送' : '忘記密碼？'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal max-w-[260px]">
              {resetEmailSent
                ? '請查看您的電郵以重置密碼。'
                : '輸入您的電郵地址，我們將發送重置密碼的鏈接。'
              }
            </p>
          </div>

          <div className="px-6 pb-8 pt-2">
            {resetEmailSent ? (
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                }}
                className="w-full bg-primary hover:bg-[#0f6bca] text-white h-12 rounded-xl font-semibold text-base transition-all"
              >
                返回登入
              </button>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[#111418] dark:text-slate-200 text-sm font-medium leading-normal ml-1">電郵地址</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                    </div>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 h-12 pl-11 pr-4 placeholder:text-slate-400 text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                      placeholder="name@company.com"
                      type="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-[#0f6bca] active:bg-[#0c59a8] text-white h-12 rounded-xl font-semibold text-base shadow-[0_4px_14px_0_rgba(19,127,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,127,236,0.23)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>發送重置郵件</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  返回登入
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display p-4 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-pattern opacity-60 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[380px] bg-white dark:bg-[#1a232e] rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col items-center pt-10 pb-4 px-6 text-center">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary shadow-sm ring-1 ring-primary/20">
            <span className="material-symbols-outlined text-[32px]">autorenew</span>
          </div>
          <h1 className="text-[#111418] dark:text-white tracking-tight text-[26px] font-bold leading-tight pb-2">歡迎回來</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal max-w-[260px]">有效管理您的訂閱和續訂。</p>
        </div>

        <div className="px-6 pb-8 pt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[#111418] dark:text-slate-200 text-sm font-medium leading-normal ml-1">電郵地址</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">person</span>
                </div>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 h-12 pl-11 pr-4 placeholder:text-slate-400 text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="name@company.com"
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#111418] dark:text-slate-200 text-sm font-medium leading-normal ml-1">密碼</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">lock</span>
                </div>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input flex w-full rounded-xl text-[#111418] dark:text-white border border-[#dbe0e6] dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 h-12 pl-11 pr-11 placeholder:text-slate-400 text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline"
                >
                  忘記密碼？
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#0f6bca] active:bg-[#0c59a8] text-white h-12 rounded-xl font-semibold text-base shadow-[0_4px_14px_0_rgba(19,127,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,127,236,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>登入</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                還沒有帳號？
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
                >
                  立即註冊
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 flex items-center gap-2 opacity-50 select-none">
        <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">shield_lock</span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">SSL 安全加密</span>
      </div>
    </div>
  );
};

export default Login;
