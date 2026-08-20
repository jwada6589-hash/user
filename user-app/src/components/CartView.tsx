import { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Plus, Minus, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function CartView({ items, updateQuantity, onViewChange, clearCart }: any) {
  const { userProfile, updateUserProfile } = useAppContext();
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Checkout Form State (pre-filled from profile)
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || '',
    phone: userProfile.phone || '',
    address: userProfile.address || '',
    landmark: userProfile.landmark || '',
    notes: userProfile.notes || '',
  });

  // Keep form sync if profile changes (though rare in this flow)
  useEffect(() => {
    setFormData({
      fullName: userProfile.fullName || '',
      phone: userProfile.phone || '',
      address: userProfile.address || '',
      landmark: userProfile.landmark || '',
      notes: userProfile.notes || '',
    });
  }, [userProfile]);

  // Helper to determine active price
  const getActivePrice = (item: any) => {
    if (item.isOffer && item.offerPrice && item.offerEndAt) {
      const now = new Date();
      const endDate = new Date(item.offerEndAt);
      if (endDate > now) {
        return item.offerPrice;
      }
    }
    return item.numericPrice;
  };

  const subtotal = items.reduce((acc: number, item: any) => acc + (getActivePrice(item) * item.quantity), 0);
  const { deliveryFee, placeOrder } = useAppContext();
  const appliedDeliveryFee = subtotal > 0 ? deliveryFee : 0;
  const total = subtotal + appliedDeliveryFee;

  const handleCheckoutClick = () => {
    setCheckoutStep(true);
  };

  const handleConfirmOrder = async () => {
    // Validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.landmark) {
      alert('الرجاء إكمال جميع الحقول الأساسية (الاسم، الهاتف، العنوان، أقرب نقطة) لتأكيد الطلب.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserProfile(formData);
      await placeOrder({
        customer: { fullName: formData.fullName, phone: formData.phone, address: formData.address, landmark: formData.landmark, notes: formData.notes },
        items,
      });
      setOrderSuccess(true);
    } catch {
      alert('تعذر إنشاء الطلب. تأكد من توفر المنتجات وحاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-[#F8F9FA] dark:bg-gray-900 pb-24 px-6 text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          سنقوم بتجهيز طلبك وتوصيله إلى العنوان المحدد بأقرب وقت ممكن.
        </p>
        <button 
          onClick={() => {
            if (clearCart) clearCart();
            onViewChange('orders');
          }} 
          className="w-full bg-[#055C33] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#044727] transition"
        >
          عرض طلباتي
        </button>
      </div>
    );
  }

  if (checkoutStep) {
    return (
      <div className="min-h-full flex flex-col bg-[#F8F9FA] dark:bg-gray-900 pb-6 transition-colors">
        <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm border-b border-gray-100 dark:border-gray-700">
          <button onClick={() => setCheckoutStep(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-800 dark:text-white">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">تفاصيل التوصيل</h2>
          <div className="w-9"></div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#055C33] dark:text-[#2DD4BF]" />
              المعلومات الشخصية
            </h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="الاسم الكامل" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33]"
              />
              <input 
                type="tel" 
                placeholder="رقم الهاتف" 
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] text-right"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#055C33] dark:text-[#2DD4BF]" />
              عنوان التوصيل
            </h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="العنوان (المدينة، المنطقة، الشارع)" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33]"
              />
              <input 
                type="text" 
                placeholder="أقرب نقطة دالة" 
                value={formData.landmark}
                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33]"
              />
              <textarea 
                placeholder="ملاحظات إضافية للتوصيل (اختياري)" 
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#055C33] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mx-2 border border-gray-100 dark:border-gray-700 mb-2">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-900 dark:text-white text-lg">الإجمالي المطلوب</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#055C33] dark:text-[#2DD4BF]">{total.toLocaleString()}</span>
              <span className="text-[#055C33] dark:text-[#2DD4BF] text-xs font-bold">د.ع</span>
            </div>
          </div>
          <button 
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="w-full bg-[#055C33] text-white font-bold py-3.5 rounded-2xl shadow-[0_4px_12px_rgba(5,92,51,0.3)] hover:bg-[#044727] transition flex justify-center items-center"
          >
            {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-[#F8F9FA] dark:bg-gray-900 pb-6 transition-colors">
      <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm border-b border-gray-100 dark:border-gray-700">
        <button onClick={() => onViewChange('home')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition text-gray-800 dark:text-white">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">سلة المشتريات</h2>
        <div className="w-9"></div> {/* spacer */}
      </div>

      <div className="flex-1 px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-32 h-32 mb-4 opacity-50 grayscale" />
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">السلة فارغة</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
            <button onClick={() => onViewChange('home')} className="bg-[#055C33] text-white font-bold py-3 px-8 rounded-full shadow-sm hover:bg-[#044727] transition">
              تصفح المنتجات
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item: any, index: number) => {
              const id = item.cartItemId || item.id;
              return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 items-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-xl p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-0.5 leading-tight">{item.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{item.size}</p>
                  
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {Object.entries(item.selectedOptions).map(([key, value]) => (
                        <span key={key} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                          {key}: {value as string}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-baseline gap-1">
                    <span className="text-[#055C33] dark:text-[#2DD4BF] font-black">{(getActivePrice(item) * item.quantity).toLocaleString()}</span>
                    <span className="text-[#055C33] dark:text-[#2DD4BF] text-[10px] font-bold">د.ع</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between h-full py-1">
                  <button onClick={() => updateQuantity(id, -item.quantity)} className="text-gray-400 hover:text-red-500 p-1 mb-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center p-1">
                    <button onClick={() => updateQuantity(id, 1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white font-bold hover:text-[#055C33] dark:hover:text-[#2DD4BF]">
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(id, -1)} className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white font-bold hover:text-[#055C33] dark:hover:text-[#2DD4BF]">
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mx-2 border border-gray-100 dark:border-gray-700 mb-2 transition-colors">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">ملخص الطلب</h3>
          
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>المجموع الفرعي</span>
              <span className="font-bold text-gray-900 dark:text-white">{subtotal.toLocaleString()} د.ع</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>رسوم التوصيل</span>
              <span className="font-bold text-gray-900 dark:text-white">{appliedDeliveryFee.toLocaleString()} د.ع</span>
            </div>
          </div>
          
          <div className="border-t border-dashed border-gray-200 dark:border-gray-600 pt-3 mb-5 flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">الإجمالي</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#055C33] dark:text-[#2DD4BF]">{total.toLocaleString()}</span>
              <span className="text-[#055C33] dark:text-[#2DD4BF] text-xs font-bold">د.ع</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckoutClick}
            className="w-full bg-[#055C33] text-white font-bold py-3.5 rounded-2xl shadow-[0_4px_12px_rgba(5,92,51,0.3)] hover:bg-[#044727] transition flex justify-center items-center gap-2"
          >
            إتمام الطلب
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
