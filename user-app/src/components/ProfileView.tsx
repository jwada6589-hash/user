import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Edit2, LogOut, Heart, Gift, MessageCircle, Info, HelpCircle, Shield, FileText, Trash2, ArrowRight, Wallet, CheckCircle, Moon, Sun, AlertTriangle, Clock, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function ProfileView({ onViewChange }: { onViewChange: (view: string) => void }) {
  const { userProfile, updateUserProfile, logout, deleteAccount, accountDeletionRequest, wallet, walletTransactions, theme, toggleTheme, settings } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    landmark: userProfile?.landmark || '',
    notes: userProfile?.notes || ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWalletTransactions, setShowWalletTransactions] = useState(false);
  const [deleteRequestMessage, setDeleteRequestMessage] = useState('');
  const [deleteRequestError, setDeleteRequestError] = useState('');
  const [isSubmittingDeletion, setIsSubmittingDeletion] = useState(false);
  const deletionIsPending = accountDeletionRequest?.status === 'PENDING' || accountDeletionRequest?.status === 'APPROVED';

  useEffect(() => {
    if (!userProfile) return;
    setFormData({
      fullName: userProfile.fullName || '',
      phone: userProfile.phone || '',
      address: userProfile.address || '',
      landmark: userProfile.landmark || '',
      notes: userProfile.notes || ''
    });
  }, [userProfile]);

  // Nested views
  const [nestedView, setNestedView] = useState<string | null>(null);
  
  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    await updateUserProfile(formData);
    setIsEditing(false); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleWhatsAppClick = () => {
    if (!settings?.whatsappEnabled) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9+]/g, '');
    const encodedMessage = encodeURIComponent(settings.whatsappDefaultMessage);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleLogout = async () => {
    await logout();
    onViewChange('home');
  };

  const renderNestedView = () => {
    switch(nestedView) {
      case 'about':
        return (
          <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col transition-colors">
            <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <button onClick={() => setNestedView(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-800 dark:text-white -mr-2">
                <ArrowRight size={20} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">من نحن</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="w-20 h-20 bg-[#055C33]/10 dark:bg-[#2DD4BF]/10 text-[#055C33] dark:text-[#2DD4BF] rounded-3xl mx-auto flex items-center justify-center mb-6">
                <Info size={40} />
              </div>
              <h3 className="text-xl font-black text-center text-gray-900 dark:text-white mb-2">{settings?.storeName}</h3>
              <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-6">{settings?.storeSubtitle}</p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 leading-relaxed text-gray-700 dark:text-gray-300">
                مرحباً بك في متجرنا! نحن نسعى دائماً لتقديم أفضل المنتجات وأجود الخدمات لتلبية كافة احتياجاتك اليومية. نؤمن بأن الجودة والسرعة في التوصيل هما مفتاح رضا عملائنا.
                <br/><br/>
                تأسس متجرنا لتسهيل تجربة التسوق وجعلها ممتعة، آمنة ومريحة لجميع أفراد العائلة.
              </div>
            </div>
          </div>
        );
      case 'how_to_use':
        return (
          <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col transition-colors">
            <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <button onClick={() => setNestedView(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-800 dark:text-white -mr-2">
                <ArrowRight size={20} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">طريقة الاستخدام</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {[
                { step: '1', title: 'إنشاء حساب أو تسجيل الدخول', desc: 'قم بتسجيل الدخول للاستفادة من كامل ميزات التطبيق.' },
                { step: '2', title: 'تصفح الأقسام والفروع', desc: 'اختر ما يناسبك من الأقسام والفروع المتوفرة.' },
                { step: '3', title: 'اختيار المنتج وخياراته', desc: 'حدد المنتجات المفضلة لديك مع اختيار الإضافات والخيارات المناسبة.' },
                { step: '4', title: 'إضافة المنتجات للسلة', desc: 'أضف المنتجات إلى سلة التسوق الخاصة بك.' },
                { step: '5', title: 'مراجعة الطلب', desc: 'راجع طلبك داخل السلة وتأكد من التفاصيل.' },
                { step: '6', title: 'تأكيد الطلب', desc: 'تأكد من عنوانك ثم اضغط على زر تأكيد الطلب.' },
                { step: '7', title: 'متابعة حالة الطلب', desc: 'تابع حالة طلبك لحظة بلحظة من خلال قسم "طلباتي".' }
              ].map((s, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#055C33] dark:bg-[#2DD4BF] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">{s.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'privacy':
      case 'terms':
        return (
          <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col transition-colors">
            <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <button onClick={() => setNestedView(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-800 dark:text-white -mr-2">
                <ArrowRight size={20} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{nestedView === 'privacy' ? 'سياسة الخصوصية' : 'شروط الاستخدام'}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p className="font-bold text-rose-500 mb-6 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  ملاحظة: هذا النص هو نص تجريبي (Placeholder) مؤقت، سيتم استبداله لاحقاً بالنص القانوني النهائي قبل النشر.
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">1. مقدمة</h3>
                <p>نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية...</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">2. جمع البيانات</h3>
                <p>نقوم بجمع المعلومات الضرورية فقط لتقديم خدمة التوصيل بشكل صحيح، مثل الاسم ورقم الهاتف والعنوان.</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">3. استخدام البيانات</h3>
                <p>تستخدم البيانات حصرياً في معالجة الطلبات والتواصل معك بخصوص طلبك ولا يتم مشاركتها مع أطراف خارجية إلا لأغراض التوصيل.</p>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8">4. التحديثات</h3>
                <p>نحتفظ بالحق في تحديث هذه الوثيقة في أي وقت، وسيتم إعلامك بأي تغييرات جوهرية.</p>

                <p className="mt-8 text-xs text-gray-400 text-center border-t border-gray-100 dark:border-gray-800 pt-6">آخر تحديث: 2026/08/19</p>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 pb-24 relative z-0">
      {/* Header */}
      <div className="bg-[#055C33] text-white pt-10 pb-12 px-5 rounded-b-[2rem] shadow-sm relative z-0">
        <h2 className="text-2xl font-black text-center mb-1">حسابي</h2>
        <p className="text-center text-white/80 text-sm">إدارة إعداداتك وبياناتك الشخصية</p>
      </div>

      <div className="px-4 -mt-6 relative z-10 space-y-4">
        
        {/* Account Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-[#055C33] dark:text-[#2DD4BF]" />
              بيانات الحساب
            </h3>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`text-sm font-bold flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors ${
                isEditing 
                  ? 'bg-[#055C33] hover:bg-[#044727] text-white shadow-sm' 
                  : 'text-[#055C33] dark:text-[#2DD4BF] bg-[#055C33]/10 dark:bg-[#2DD4BF]/10 hover:bg-[#055C33]/20 dark:hover:bg-[#2DD4BF]/20'
              }`}
            >
              {isEditing ? (
                <>حفظ التعديلات</>
              ) : (
                <><Edit2 className="w-4 h-4" /> تعديل البيانات</>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">الاسم الكامل</label>
              <input 
                type="text" 
                name="fullName"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] dark:focus:border-[#2DD4BF] disabled:opacity-70 transition-colors disabled:bg-white dark:disabled:bg-gray-800 disabled:border-transparent disabled:px-0 disabled:py-1 font-bold"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">رقم الهاتف</label>
              <input 
                type="tel" 
                name="phone"
                disabled={!isEditing}
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] dark:focus:border-[#2DD4BF] disabled:opacity-70 transition-colors text-right disabled:bg-white dark:disabled:bg-gray-800 disabled:border-transparent disabled:px-0 disabled:py-1 font-bold"
                placeholder="07XX XXX XXXX"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">العنوان</label>
              <input 
                type="text" 
                name="address"
                disabled={!isEditing}
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] dark:focus:border-[#2DD4BF] disabled:opacity-70 transition-colors disabled:bg-white dark:disabled:bg-gray-800 disabled:border-transparent disabled:px-0 disabled:py-1 font-bold"
                placeholder="المدينة، المنطقة، الشارع"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">أقرب نقطة دالة</label>
              <input 
                type="text" 
                name="landmark"
                disabled={!isEditing}
                value={formData.landmark}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] dark:focus:border-[#2DD4BF] disabled:opacity-70 transition-colors disabled:bg-white dark:disabled:bg-gray-800 disabled:border-transparent disabled:px-0 disabled:py-1 font-bold"
                placeholder="مثال: قرب مدرسة كذا..."
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">ملاحظات إضافية (اختياري)</label>
                <textarea 
                  name="notes"
                  disabled={!isEditing}
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] dark:focus:border-[#2DD4BF] disabled:opacity-70 resize-none transition-colors"
                  placeholder="ملاحظات للتوصيل..."
                />
              </div>
            )}
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span className="font-bold text-sm">تم حفظ البيانات بنجاح</span>
          </div>
        )}

        {/* Quick Links Group */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <button onClick={() => onViewChange('favorites')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-500 dark:text-rose-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">المفضلة</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
          
          <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>
          
          <button onClick={() => setShowWalletTransactions(value => !value)} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">محفظتي — {wallet.balance?.toLocaleString('ar-IQ')} د.ع</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>

          {showWalletTransactions && (
            <div className="mx-3 mb-3 rounded-2xl bg-gray-50 dark:bg-gray-700/40 p-3 space-y-2">
              {walletTransactions.length > 0 ? walletTransactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between text-xs border-b last:border-b-0 border-gray-100 dark:border-gray-700 py-2">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{transaction.description}</p>
                    <p className="text-gray-400 mt-1">{new Date(transaction.createdAt).toLocaleDateString('ar-IQ')}</p>
                  </div>
                  <span className={`font-black ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('ar-IQ')} د.ع
                  </span>
                </div>
              )) : (
                <p className="text-center text-xs text-gray-400 py-3">لا توجد حركات محفظة بعد</p>
              )}
            </div>
          )}
          
          <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>

          <button onClick={() => onViewChange('gifts')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500 dark:text-blue-400">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">الهدايا مقابل الرصيد</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
        </div>

        {/* Preferences & Support */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">{theme === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'}</h4>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-[#055C33]' : 'bg-gray-200 dark:bg-gray-600'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${theme === 'dark' ? 'left-1' : 'left-6'}`}></span>
            </div>
          </div>

          {settings?.whatsappEnabled && (
            <>
              <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>
              <button onClick={handleWhatsAppClick} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">خدمة العملاء عبر واتساب</h4>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
              </button>
            </>
          )}
        </div>

        {/* Info Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <button onClick={() => setNestedView('about')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">من نحن</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
          <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>
          
          <button onClick={() => setNestedView('how_to_use')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">طريقة الاستخدام</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
          <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>

          <button onClick={() => setNestedView('privacy')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">سياسة الخصوصية</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
          <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>

          <button onClick={() => setNestedView('terms')} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">شروط الاستخدام</h4>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          </button>
        </div>

        {/* Danger Zone */}
        {deleteRequestMessage && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
            <CheckCircle className="h-5 w-5 shrink-0" />
            {deleteRequestMessage}
          </div>
        )}
        {deleteRequestError && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{deleteRequestError}</div>}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
          <button disabled={deletionIsPending} onClick={() => setIsDeleteModalOpen(true)} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors text-right disabled:cursor-not-allowed disabled:opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{deletionIsPending ? 'طلب حذف الحساب قيد المراجعة' : 'حذف الحساب'}</h4>
                {deletionIsPending && <p className="mt-0.5 text-xs font-medium text-gray-500">بانتظار قرار الإدارة</p>}
              </div>
            </div>
          </button>
          <div className="h-px bg-gray-50 dark:bg-gray-700/50 mx-4"></div>
          <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">تسجيل الخروج</h4>
            </div>
          </button>
        </div>

        {/* Version */}
        <div className="text-center pb-8 pt-4">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-bold">الإصدار 1.0.0</p>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm shadow-xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">حذف الحساب</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              هل تريد إرسال طلب حذف حسابك إلى الإدارة؟
              <br/>
              <span className="block mt-2 text-xs font-bold text-red-500">لن يُحذف الحساب الآن. سيتم التنفيذ فقط بعد موافقة الإدارة.</span>
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={async () => {
                  if (isSubmittingDeletion) return;
                  setIsSubmittingDeletion(true);
                  setDeleteRequestError('');
                  try {
                    await deleteAccount();
                    setIsDeleteModalOpen(false);
                    setDeleteRequestMessage('تم إرسال طلب حذف الحساب للإدارة');
                  } catch {
                    setDeleteRequestError('تعذر إرسال الطلب. تحقق من الاتصال وحاول مرة أخرى.');
                    setIsDeleteModalOpen(false);
                  } finally {
                    setIsSubmittingDeletion(false);
                  }
                }} 
                disabled={isSubmittingDeletion}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                {isSubmittingDeletion ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Sub Pages */}
      {renderNestedView()}
      
    </div>
  );
}
