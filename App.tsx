
import React, { useState, useEffect } from 'react';
import { Page, Service, UserProfile } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RenewalAlerts from './pages/RenewalAlerts';
import ServiceList from './pages/ServiceList';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import { onAuthStateChange, signOut as authSignOut } from './services/authService';
import { getServices, addService as apiAddService, updateService as apiUpdateService, deleteService as apiDeleteService } from './services/serviceService';
import { getProfile } from './services/profileService';
import type { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Handle dark mode (simplified)
  useEffect(() => {
    document.documentElement.classList.add('light'); // Default to light
  }, []);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);

      if (session) {
        setCurrentPage(Page.DASHBOARD);
        // Load user data
        await loadUserData();
      } else {
        setCurrentPage(Page.LOGIN);
        setServices([]);
        setUserProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async () => {
    try {
      // Load services
      const { services: loadedServices, error: servicesError } = await getServices();
      if (!servicesError) {
        setServices(loadedServices);
      }

      // Load profile
      const { profile, error: profileError } = await getProfile();
      if (!profileError && profile) {
        setUserProfile({
          id: profile.id,
          nickname: profile.nickname,
          email: profile.email,
          avatarUrl: profile.avatar_url,
          emailNotify: profile.email_notify,
          reminderDays: profile.reminder_days,
        });
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleLogin = () => {
    // Auth state change will handle navigation
  };

  const handleLogout = async () => {
    await authSignOut();
    setIsAuthenticated(false);
    setCurrentPage(Page.LOGIN);
  };

  const handleAddService = async (newService: Service) => {
    // Optimistic update
    setServices(prev => [newService, ...prev]);

    // API call
    const { service, error } = await apiAddService(newService);
    if (error) {
      // Revert on error
      setServices(prev => prev.filter(s => s.id !== newService.id));
      console.error('Error adding service:', error);
    } else if (service) {
      // Replace temp service with real one
      setServices(prev => prev.map(s => s.id === newService.id ? service : s));
    }
  };

  const handleUpdateService = async (updatedService: Service) => {
    // Optimistic update
    const originalServices = [...services];
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));

    // API call
    const { error } = await apiUpdateService(updatedService.id, updatedService);
    if (error) {
      // Revert on error
      setServices(originalServices);
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (id: string) => {
    // Optimistic update
    const originalServices = [...services];
    setServices(prev => prev.filter(s => s.id !== id));

    // API call
    const { error } = await apiDeleteService(id);
    if (error) {
      // Revert on error
      setServices(originalServices);
      console.error('Error deleting service:', error);
    }
  };

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500">載入中...</p>
        </div>
      </div>
    );
  }

  if (currentPage === Page.LOGIN && !isAuthenticated) {
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage(Page.REGISTER)} />;
  }

  if (currentPage === Page.REGISTER && !isAuthenticated) {
    return <Register onRegister={handleLogin} onNavigateToLogin={() => setCurrentPage(Page.LOGIN)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard onNavigate={setCurrentPage} services={services} userProfile={userProfile} />;
      case Page.RENEWALS:
        return <RenewalAlerts onBack={() => setCurrentPage(Page.DASHBOARD)} services={services} />;
      case Page.SERVICES:
        return (
          <ServiceList
            onBack={() => setCurrentPage(Page.DASHBOARD)}
            services={services}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
          />
        );
      case Page.SETTINGS:
        return (
          <Settings
            onBack={() => setCurrentPage(Page.DASHBOARD)}
            onLogout={handleLogout}
            userProfile={userProfile}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} services={services} userProfile={userProfile} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[70] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <Sidebar
          currentPage={currentPage}
          onNavigate={(p) => {
            setCurrentPage(p);
            setIsSidebarOpen(false);
          }}
          onLogout={handleLogout}
          urgentCount={services.filter(s => s.status === 'expired' || s.status === 'expiring').length}
          userProfile={userProfile}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto relative">
        <header className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-14 flex items-center px-4 justify-between md:hidden">
          <button
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-lg font-bold">SubTrack</h1>
          <div className="w-8" />
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
