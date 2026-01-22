
export type ServiceStatus = 'active' | 'expiring' | 'expired';

export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  currency?: string;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  expiryDate: string;
  status: ServiceStatus;
  icon: string;
  daysRemaining: number;
  notes?: string;
  renewalLink?: string;
}

export enum Page {
  LOGIN = 'login',
  REGISTER = 'register',
  DASHBOARD = 'dashboard',
  RENEWALS = 'renewals',
  SERVICES = 'services',
  SETTINGS = 'settings'
}

export interface UserProfile {
  id: string;
  nickname: string | null;
  email: string | null;
  avatarUrl: string | null;
  emailNotify: boolean;
  reminderDays: number;
}
