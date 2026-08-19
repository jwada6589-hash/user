import React from 'react';
import { Lock, UserPlus, LogIn, X } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, setAuthState } = useAppContext();

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center animate-scale-in relative overflow-hidden">
        
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-gray-800 transition"
        >
          <X size={18} />
        </button>

        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mb-4 mt-2">
          <Lock className="w-10 h-10" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">هذه الميزة تتطلب حسابًا</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          سجّل الدخول أو أنشئ حسابًا للمتابعة والاستفادة من كافة ميزات التطبيق.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => {
              setShowAuthModal(false);
              setAuthState('logged_out');
            }}
            className="w-full py-3.5 bg-[#055C33] text-white font-bold rounded-xl shadow-md transition hover:bg-[#044727] flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            تسجيل الدخول
          </button>
          
          <button 
            onClick={() => {
              setShowAuthModal(false);
              setAuthState('logged_out');
            }}
            className="w-full py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            إنشاء حساب
          </button>
        </div>
      </div>
    </div>
  );
}
