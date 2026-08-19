import { useState } from 'react';
import { ShoppingCart, Tag, Clock } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function DailyOffersView({ onAddToCart, onProductClick }: any) {
  const { products } = useAppContext();
  const now = new Date();

  // Filter products that have active offers
  const activeOffers = products.filter(product => {
    if (!product.isOffer || !product.offerEndAt || !product.offerPrice) {
      return false;
    }
    const endDate = new Date(product.offerEndAt);
    return endDate > now;
  });

  return (
    <div className="p-4 pb-24 bg-[#F8F9FA] dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex items-center gap-2 mb-6 mt-2">
        <div className="bg-[#055C33]/10 dark:bg-[#2DD4BF]/10 p-2 rounded-xl">
          <Tag className="w-6 h-6 text-[#055C33] dark:text-[#2DD4BF]" />
        </div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white">العروض اليومية</h2>
      </div>

      <div className="flex flex-col gap-4">
        {activeOffers.length > 0 ? (
          activeOffers.map(product => {
            const endDate = new Date(product.offerEndAt!);
            const discountPercent = Math.round(((product.numericPrice - product.offerPrice!) / product.numericPrice) * 100);
            
            return (
              <div 
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer hover:border-[#055C33] dark:hover:border-[#2DD4BF] transition-all"
              >
                <div className="w-28 h-28 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl z-10">
                    خصم {discountPercent}%
                  </div>
                </div>

                <div className="flex flex-col flex-1 py-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight">{product.name}</h3>
                  <span className="text-gray-500 dark:text-gray-400 text-[10px] mb-2">{product.size}</span>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-red-500 dark:text-red-400 font-black text-lg">{product.offerPrice?.toLocaleString()}</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs line-through">{product.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-[10px] font-bold">{product.currency}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-[10px] mb-3">
                    <Clock className="w-3 h-3" />
                    <span>ينتهي في: {endDate.toLocaleDateString('ar-IQ')}</span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.options && product.options.length > 0) {
                        onProductClick(product);
                      } else {
                        onAddToCart(product);
                      }
                    }}
                    className="mt-auto w-full bg-[#055C33] dark:bg-[#2DD4BF] hover:bg-[#044727] dark:hover:bg-[#14b8a6] text-white dark:text-gray-900 py-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    أضف للسلة
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
              <Tag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mb-1">لا توجد عروض حالياً</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">ترقبوا عروضنا الجديدة قريباً</p>
          </div>
        )}
      </div>
    </div>
  );
}
