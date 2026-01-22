
import { Service } from './types';

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'AWS Hosting',
    category: '雲端服務',
    price: '$45.00',
    billingCycle: 'monthly',
    startDate: '2023-01-01',
    expiryDate: '2024-05-20',
    status: 'expired',
    icon: 'cloud',
    daysRemaining: -1
  },
  {
    id: '2',
    name: 'Adobe Creative Cloud',
    category: '軟體服務',
    price: '$54.99',
    billingCycle: 'monthly',
    startDate: '2023-10-05',
    expiryDate: '2024-05-23',
    status: 'expiring',
    icon: 'palette',
    daysRemaining: 2
  },
  {
    id: '3',
    name: 'Netflix Premium',
    category: '娛樂',
    price: '$15.99',
    billingCycle: 'monthly',
    startDate: '2023-05-10',
    expiryDate: '2024-06-15',
    status: 'active',
    icon: 'movie',
    daysRemaining: 25
  },
  {
    id: '4',
    name: 'Spotify Duo',
    category: '娛樂',
    price: '$12.99',
    billingCycle: 'monthly',
    startDate: '2023-12-01',
    expiryDate: '2024-06-20',
    status: 'active',
    icon: 'music_note',
    daysRemaining: 30
  },
  {
    id: '5',
    name: 'Google Workspace',
    category: '電郵',
    price: '$6.00',
    billingCycle: 'monthly',
    startDate: '2023-01-01',
    expiryDate: '2024-12-31',
    status: 'active',
    icon: 'mail',
    daysRemaining: 220
  },
  {
    id: '6',
    name: 'Jira Software',
    category: '管理',
    price: '$7.50',
    billingCycle: 'monthly',
    startDate: '2023-11-20',
    expiryDate: '2024-11-20',
    status: 'active',
    icon: 'bug_report',
    daysRemaining: 180
  }
];

export const IMAGES = {
  USER_AVATAR: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzKIUd5RicVkrnHk4RHO2P_qD_Zx6t2p-oz-LURmalgi0nNgT_eVeEJ1w_cHVdmpRKouc8TGOv0Ml51YEo8ubBs390Qj6Ds6RVWAu_rfQvWHXpqwtTolP1nCnsA4-4hsaKi0ayt-eULOYsyu4mIjC_CGo15nV2Hua1vOn6-xefsX1G9hu6i0xaMWS9vgKtUVh-N15CGrk7RT-M70Xr7y8zsNE_gHs-y2dkCWrUx-W3fWjh6exGfw9tMnGxE-aHED8On5gTa8SigTWw',
  NETFLIX_LOGO: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpCDNocpNBjk2693Z6VvbEBd4j3VA9Y7_15sbsfdG2ePhsAaP8GlO0ppI6WZth1iWuiCVWlTxNS6O9O9qw0bAAEZt-jQxbDNjPXvEGEYd0tdmChww34y_Xypt8qH3u9DQeWcP024cUgZs_X6HewoX3UKXaXOfM9KudRqBipkNpGqwnqZ0iUP_dMA1rz0RJM269srkIVL2BFfYkvCyr7LWXJg25qzodWR8dN9XzdwAqTrJcN2_ogRFj-kHcJNeRessLiryYKZESaUEz',
  ADOBE_LOGO: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrcLl6IP_jdOFjLKVLq1XbwhKfZEbcieqwquly_P-epCAj-qGtE9Ph2LxlzPW8giYJ1J749MqOdA00hp_OEDSeCr6L0x12RjmSi4HeN-km9-mCIhmqnnfimD0Qn6gSaAtoCT_f8ZgVGqI1FfVjkTH9Ai0Ch6p_uLqbXYCi96ExQ6KinqLrQasxXbLHwPMn4bs3BX-qL42zTP4iC6_L4oBEZYO49_GgqYk-AtzXD8Jr73efWrrh2fyOQ1CqUbPGvTkFR8hDUOIQgCXb',
  CAR_LOGO: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgDdQI7KcEpKLqMFQ54Rof6uLIdDk9Cp2vh6nQzhO_yc7RwPRj8R8e4K1b2_e7A-VrKn2BoQRyW1zNCvmnwqoRgsNdmagtXgdeC2W3eYphRePHVPJPFka0sSfqr_QMPpBMUNg560KGhPkwOqX-4QFDsDG-PDASGufUcA7uBREZEgoE-U-2-tB5p8NVg0KifW6Cx88-_YmXnlCCPq5iwYCoYGmPSD4zHBiDHGVnhBxZIfwLgVNOdSExRSmP3wbpsYaWsAvJAi_vIDd4',
  SPOTIFY_LOGO: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBme05jct_X78JOp1BvKGNu11Dyeb6-SAUrX2bYEWZEAn0Z3DlERV5NVysXHoL4R2W3uonbIMdpCbCjv6PXnDHUKJ-e9aJxPyQBQ78TXUiEv0vqhxvN54livyV4D3n6Rvb5LKxzlWX5x0mSrwV8JMGbtw0p_aUyleOL_MiwHzZQQmSzSutK9OQhnFBZjKp8TyNT4hc--KL05sbNLJHmO52_cYrpoWewJsrSb8s4OO3xj3PQRzuPrLlfkCWdL4X1wFq_f2jcx865jgF'
};
