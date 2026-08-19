import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export interface UserProfile { fullName: string; phone: string; address: string; landmark: string; notes: string }
export type AuthState = 'guest' | 'authenticated' | 'logged_out';

interface AppContextType {
  products: any[]; categories: any[]; subCategories: any[]; orders: any[];
  userProfile: UserProfile; wallet: { balance: number; totalEarned: number }; walletTransactions: any[];
  gifts: any[]; giftRedemptions: any[]; favorites: string[];
  accountDeletionRequest: { id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'; requestedAt: number } | null;
  authState: AuthState; setAuthState: (state: AuthState) => void;
  login: (phone: string, password: string) => Promise<void>; register: (data: any) => Promise<void>;
  logout: () => Promise<void>; deleteAccount: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>; toggleFavorite: (productId: string) => Promise<boolean>;
  redeemGift: (giftId: string) => Promise<{ success: boolean; message?: string }>; placeOrder: (order: any) => Promise<any>;
  theme: 'light' | 'dark'; toggleTheme: () => void;
  showAuthModal: boolean; setShowAuthModal: (show: boolean) => void; requireAuth: (action: () => void) => void;
  deliveryFee: number; settings: any;
}

const emptyProfile: UserProfile = { fullName: '', phone: '', address: '', landmark: '', notes: '' };
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialTokenHash = Number(localStorage.getItem('userSessionExpiry') ?? 0) > Date.now() ? (localStorage.getItem('userSessionHash') ?? '') : '';
  const [tokenHash, setTokenHash] = useState(initialTokenHash);
  const [authState, setAuthStateValue] = useState<AuthState>(() => {
    if (initialTokenHash) return 'authenticated';
    return localStorage.getItem('authState') === 'guest' ? 'guest' : 'logged_out';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('appTheme') as 'light' | 'dark') || 'light');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const products = useQuery(api.catalog.products, {}) ?? [];
  const categories = useQuery(api.catalog.categories, {}) ?? [];
  const subCategories = useQuery(api.catalog.subcategories, {}) ?? [];
  const settings = useQuery(api.settings.get, {});
  const profile = useQuery(api.users.me, tokenHash ? { tokenHash } : 'skip');
  const orders = useQuery(api.orders.mine, tokenHash ? { tokenHash } : 'skip') ?? [];
  const walletData = useQuery(api.wallet.get, tokenHash ? { tokenHash } : 'skip');
  const gifts = useQuery(api.gifts.list, {}) ?? [];
  const giftRedemptions = useQuery(api.gifts.mine, tokenHash ? { tokenHash } : 'skip') ?? [];
  const favorites = useQuery(api.favorites.list, tokenHash ? { tokenHash } : 'skip') ?? [];
  const accountDeletionRequest = useQuery(api.accountDeletionRequests.mine, tokenHash ? { tokenHash } : 'skip') ?? null;

  const loginAction = useAction(api.authActions.login);
  const registerAction = useAction(api.authActions.register);
  const logoutMutation = useMutation(api.users.logout);
  const requestDeletionMutation = useMutation(api.accountDeletionRequests.request);
  const updateProfileMutation = useMutation(api.users.updateProfile);
  const favoriteMutation = useMutation(api.favorites.toggle);
  const redeemMutation = useMutation(api.gifts.redeem);
  const createOrderMutation = useMutation(api.orders.create);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('appTheme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('authState', authState); }, [authState]);

  const saveSession = (result: { tokenHash: string; expiresAt: number }) => {
    localStorage.setItem('userSessionHash', result.tokenHash); localStorage.setItem('userSessionExpiry', String(result.expiresAt));
    setTokenHash(result.tokenHash); setAuthStateValue('authenticated');
  };
  const login = async (phone: string, password: string) => saveSession(await loginAction({ phone, password }));
  const register = async (data: any) => saveSession(await registerAction(data));
  const logout = async () => {
    if (tokenHash) await logoutMutation({ tokenHash }).catch(() => undefined);
    localStorage.removeItem('userSessionHash'); localStorage.removeItem('userSessionExpiry'); setTokenHash(''); setAuthStateValue('logged_out');
  };
  const setAuthState = (state: AuthState) => {
    if (state !== 'authenticated') {
      if (state === 'logged_out') { localStorage.removeItem('userSessionHash'); localStorage.removeItem('userSessionExpiry'); setTokenHash(''); }
      setAuthStateValue(state);
    }
  };
  const updateUserProfile = async (next: UserProfile) => {
    if (!tokenHash) throw new Error('UNAUTHENTICATED');
    await updateProfileMutation({ tokenHash, fullName: next.fullName, address: next.address, landmark: next.landmark, notes: next.notes ?? '' });
  };
  const deleteAccount = async () => {
    if (!tokenHash) throw new Error('UNAUTHENTICATED');
    await requestDeletionMutation({ tokenHash });
  };
  const toggleFavorite = async (productId: string) => {
    if (!tokenHash) throw new Error('UNAUTHENTICATED');
    return await favoriteMutation({ tokenHash, productId: productId as any });
  };
  const redeemGift = async (giftId: string) => {
    if (!tokenHash) return { success: false, message: 'يجب تسجيل الدخول أولاً.' };
    try { await redeemMutation({ tokenHash, giftId: giftId as any, idempotencyKey: crypto.randomUUID() }); return { success: true }; }
    catch (error: any) {
      const message = String(error?.message ?? error);
      if (message.includes('INSUFFICIENT_BALANCE')) return { success: false, message: 'رصيدك غير كافٍ للحصول على هذه الهدية.' };
      if (message.includes('OUT_OF_STOCK')) return { success: false, message: 'الهدية نفدت من المخزون.' };
      return { success: false, message: 'تعذر تنفيذ الاستبدال.' };
    }
  };
  const placeOrder = async (order: any) => {
    if (!tokenHash) throw new Error('UNAUTHENTICATED');
    return await createOrderMutation({ tokenHash, customer: order.customer, items: order.items.map((item: any) => ({
      productId: item.id as any,
      selectedOptions: Object.entries(item.selectedOptions ?? {}).map(([name, value]) => ({ name, value: String(value) })),
      quantity: item.quantity,
    })) });
  };
  const requireAuth = (action: () => void) => authState === 'authenticated' ? action() : setShowAuthModal(true);
  const value = useMemo<AppContextType>(() => ({
    products, categories, subCategories, orders, userProfile: profile ?? emptyProfile,
    wallet: walletData?.wallet ?? { balance: 0, totalEarned: 0 }, walletTransactions: walletData?.transactions ?? [],
    gifts, giftRedemptions, favorites, accountDeletionRequest, authState, setAuthState, login, register, logout, deleteAccount,
    updateUserProfile, toggleFavorite, redeemGift, placeOrder, theme,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
    showAuthModal, setShowAuthModal, requireAuth, deliveryFee: settings?.deliveryFee ?? 0, settings,
  }), [products, categories, subCategories, orders, profile, walletData, gifts, giftRedemptions, favorites, accountDeletionRequest, authState, theme, showAuthModal, settings, tokenHash]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
