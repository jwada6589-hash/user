import React, { useState } from 'react';
import { User, Lock, Phone, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function AuthView({ onSuccess }: { onSuccess: () => void }) {
  const otaTestMarker = import.meta.env.VITE_OTA_TEST_MARKER;
  const { setAuthState, login, register } = useAppContext();
  const [mode, setMode] = useState<'intro' | 'login' | 'register'>('intro');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    landmark: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    setError(''); setIsSubmitting(true);
    try { await login(phone, password); onSuccess(); }
    catch { setError('رقم الهاتف أو كلمة المرور غير صحيحة.'); }
    finally { setIsSubmitting(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) { setError('كلمتا المرور غير متطابقتين.'); return; }
    setError(''); setIsSubmitting(true);
    try {
      await register({ fullName: regData.fullName, phone: regData.phone, password: regData.password, address: regData.address, landmark: regData.landmark });
      onSuccess();
    } catch (err: any) {
      const message = String(err?.message ?? err);
      setError(message.includes('PHONE_ALREADY_EXISTS') ? 'رقم الهاتف مستخدم بالفعل.' : message.includes('WEAK_PASSWORD') ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' : 'تعذر إنشاء الحساب. تحقق من البيانات.');
    } finally { setIsSubmitting(false); }
  };

  const continueAsGuest = () => {
    setAuthState('guest');
    onSuccess();
  };

  if (mode === 'intro') {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-[#055C33] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-[#055C33]/20">
            <span className="text-white text-4xl font-black">أ</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">مرحباً بك في أسواق</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">تسوق جميع احتياجاتك اليومية بسهولة</p>
          {otaTestMarker && (
            <p data-ota-test-marker className="mb-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              {otaTestMarker}
            </p>
          )}
          
          <div className="w-full space-y-4 max-w-sm">
            <button 
              onClick={() => setMode('register')}
              className="w-full bg-[#055C33] text-white font-bold py-4 rounded-2xl shadow-md hover:bg-[#044727] transition"
            >
              إنشاء حساب
            </button>
            <button 
              onClick={() => setMode('login')}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              لدي حساب
            </button>
            
            <div className="pt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-400">أو</span>
              </div>
            </div>
            
            <button 
              onClick={continueAsGuest}
              className="w-full text-[#055C33] dark:text-[#2DD4BF] font-bold py-4 transition hover:opacity-80"
            >
              الدخول كزائر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FCA5A5] dark:bg-[#4C1D1D]">
      <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => setMode('intro')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>
      </div>

      <div className="p-6 flex-1">
        {error && <div className="max-w-sm mx-auto mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-bold">{error}</div>}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel" 
                  required
                  placeholder="07XX XXX XXXX"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33] dark:focus:ring-[#2DD4BF]"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33] dark:focus:ring-[#2DD4BF]"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#055C33] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#044727] transition mt-6 disabled:opacity-60">
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto pb-8">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الاسم الكامل</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="اسمك الكامل"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33]"
                  value={regData.fullName}
                  onChange={e => setRegData({...regData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel" 
                  required
                  placeholder="07XX XXX XXXX"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33]"
                  value={regData.phone}
                  onChange={e => setRegData({...regData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33]"
                  value={regData.password}
                  onChange={e => setRegData({...regData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">تأكيد كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33]"
                  value={regData.confirmPassword}
                  onChange={e => setRegData({...regData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">العنوان</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="المدينة، المنطقة، الشارع"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33]"
                  value={regData.address}
                  onChange={e => setRegData({...regData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">أقرب نقطة دالة</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Navigation size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: قرب مدرسة الأجيال"
                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#055C33]"
                  value={regData.landmark}
                  onChange={e => setRegData({...regData, landmark: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#055C33] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#044727] transition mt-6 disabled:opacity-60">
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
