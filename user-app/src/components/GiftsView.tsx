import React, { useState } from 'react';
import { ArrowRight, Gift, Clock, Check, X, AlertCircle } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: 'قيد المراجعة', color: 'text-orange-500 bg-orange-100', icon: Clock },
  APPROVED: { label: 'تمت الموافقة', color: 'text-blue-500 bg-blue-100', icon: Check },
  RECEIVED: { label: 'تم استلام الهدية', color: 'text-green-600 bg-green-100', icon: Gift },
  CANCELLED: { label: 'ملغي', color: 'text-red-600 bg-red-100', icon: X }
};

export default function GiftsView({ onViewChange }: { onViewChange: (view: string) => void }) {
  const { wallet, gifts, giftRedemptions, redeemGift } = useAppContext();
  const [activeTab, setActiveTab] = useState<'browse' | 'history'>('browse');
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeemClick = (gift: any) => {
    setSelectedGift(gift);
  };

  const confirmRedeem = async () => {
    if (!selectedGift) return;
    setIsRedeeming(true);

    try {
      const result = await redeemGift(selectedGift.id);
      setIsRedeeming(false);
      setSelectedGift(null);

      if (result.success) {
        alert('تم طلب استبدال الهدية بنجاح!');
        setActiveTab('history');
      } else {
        alert(result.message || 'حدث خطأ غير معروف.');
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] dark:bg-gray-900 min-h-full pb-24 transition-colors relative">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <button onClick={() => onViewChange('profile')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-800 dark:text-white">
          <ArrowRight size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">الهدايا مقابل الرصيد</h2>
      </div>

      {/* Balance Summary */}
      <div className="bg-[#055C33] text-white p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-8 -mb-8 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[#E8F3ED] text-sm font-bold mb-1">الرصيد المتاح للاستبدال</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black">{wallet.balance.toLocaleString()}</span>
            <span className="text-sm font-bold">د.ع</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'browse' ? 'border-[#055C33] text-[#055C33] dark:border-[#2DD4BF] dark:text-[#2DD4BF]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          الهدايا المتوفرة
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#055C33] text-[#055C33] dark:border-[#2DD4BF] dark:text-[#2DD4BF]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          سجل الهدايا
        </button>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'browse' ? (
          // Browse Gifts
          gifts.length > 0 ? (
            gifts.map(gift => {
              const canAfford = wallet.balance >= gift.requiredBalance;
              const hasStock = gift.stock > 0;
              const isAvailable = gift.isActive && hasStock;
              
              return (
                <div key={gift.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                      <img src={gift.image} alt={gift.name} className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 leading-tight">{gift.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{gift.description}</p>
                      
                      <div className="flex items-center gap-1 font-bold">
                        <Gift className="w-4 h-4 text-[#F9B32B]" />
                        <span className={canAfford ? 'text-[#055C33] dark:text-[#2DD4BF]' : 'text-red-500'}>
                          {gift.requiredBalance.toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRedeemClick(gift)}
                    disabled={!isAvailable || !canAfford}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      !isAvailable 
                        ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                        : !canAfford 
                          ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 cursor-not-allowed border border-red-100 dark:border-red-900/30'
                          : 'bg-[#055C33] text-white hover:bg-[#044727]'
                    }`}
                  >
                    {!isAvailable ? 'غير متوفر حالياً' : !canAfford ? 'رصيدك غير كافٍ' : 'استبدال الآن'}
                  </button>
                </div>
              );
            })
          ) : (
             <div className="flex flex-col items-center justify-center h-64 text-center">
                <Gift className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">لا توجد هدايا</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">الهدايا غير متوفرة في الوقت الحالي.</p>
             </div>
          )
        ) : (
          // History
          giftRedemptions.length > 0 ? (
            giftRedemptions.map(redemption => {
              const statusData = statusMap[redemption.status];
              const StatusIcon = statusData?.icon || Clock;
              
              return (
                <div key={redemption.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{redemption.giftName}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(redemption.createdAt).toLocaleDateString('ar-IQ')} {new Date(redemption.createdAt).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="text-[#055C33] dark:text-[#2DD4BF] font-black text-sm block">{redemption.pointsUsed.toLocaleString()} د.ع</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${statusData.color} dark:bg-opacity-20`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusData.label}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">لا توجد استبدالات</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">لم تقم باستبدال أي هدية حتى الآن.</p>
            </div>
          )
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedGift && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">تأكيد الاستبدال</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              هل تريد استبدال <span className="font-bold text-gray-900 dark:text-white">{selectedGift.requiredBalance.toLocaleString()} د.ع</span> من رصيدك مقابل الحصول على <span className="font-bold text-[#055C33] dark:text-[#2DD4BF]">{selectedGift.name}</span>؟
            </p>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => setSelectedGift(null)}
                disabled={isRedeeming}
                className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button 
                onClick={confirmRedeem}
                disabled={isRedeeming}
                className="flex-1 py-3.5 bg-[#055C33] text-white font-bold rounded-xl shadow-md transition hover:bg-[#044727] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isRedeeming ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'تأكيد الاستبدال'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
