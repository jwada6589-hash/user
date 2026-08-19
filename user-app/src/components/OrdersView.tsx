import React, { useState } from 'react';
import { ArrowRight, Check, X, Clock, Package, Trash2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
  NEW: { label: 'طلب جديد', color: 'text-orange-500 bg-orange-100', icon: Clock },
  ACCEPTED: { label: 'تم قبول الطلب', color: 'text-orange-500 bg-orange-100', icon: Check },
  PREPARING: { label: 'جاري تجهيز الطلب', color: 'text-orange-500 bg-orange-100', icon: Package },
  WITH_COURIER: { label: 'الطلب بيد المندوب', color: 'text-blue-500 bg-blue-100', icon: Package },
  DELIVERED: { label: 'تم التسليم', color: 'text-green-600 bg-green-100', icon: Check },
  REJECTED: { label: 'تم رفض الطلب', color: 'text-red-600 bg-red-100', icon: X }
};

export default function OrdersView({ onViewChange }: any) {
  const { orders } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);

  const handleDelete = () => setIsDeleteModalOpen(null);

  if (selectedOrder) {
    const totalAmount = selectedOrder.items.reduce((sum: number, item: any) => sum + ((item.price || 0) * item.quantity), 0) + selectedOrder.deliveryFee;
    const currentStatus = statusMap[selectedOrder.status];
    const StatusIcon = currentStatus?.icon || Clock;
    const canDelete = false;

    return (
      <div className="bg-[#F8F9FA] dark:bg-gray-900 min-h-full pb-20 transition-colors animate-in slide-in-from-right-4 duration-300">
        <div className="bg-white dark:bg-gray-800 px-4 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-800 dark:text-white -mr-2">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">تفاصيل الطلب</h1>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center justify-center py-4">
              <div className={`p-4 rounded-full mb-3 ${currentStatus?.color.split(' ')[1]} dark:bg-opacity-20`}> 
                <StatusIcon size={32} className={currentStatus?.color.split(' ')[0]} />
              </div>
              <h2 className={`text-xl font-bold ${currentStatus?.color.split(' ')[0]}`}>{currentStatus?.label}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">رقم الطلب: {selectedOrder.id}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
               <div className="flex justify-between mb-3">
                 <span className="text-gray-500 dark:text-gray-400">التاريخ:</span> 
                 <span className="font-bold text-gray-900 dark:text-white" dir="ltr">{selectedOrder.date}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500 dark:text-gray-400 shrink-0 ml-4">التوصيل إلى:</span> 
                 <span className="font-bold text-gray-900 dark:text-white text-left">{selectedOrder.address}</span>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <h3 className="font-bold p-4 bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">المنتجات</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {selectedOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</span>
                    {item.size && <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{item.size}</span>}
                  </div>
                  <div className="text-left flex flex-col items-end">
                    <span className="font-bold text-sm text-[#055C33] dark:text-[#2DD4BF]">{item.price} د.ع</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">الكمية: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
             <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-400">
               <span>المجموع الفرعي:</span>
               <span className="text-gray-900 dark:text-white">{totalAmount - selectedOrder.deliveryFee} د.ع</span>
             </div>
             <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-400">
               <span>أجور التوصيل:</span>
               <span className="text-gray-900 dark:text-white">{selectedOrder.deliveryFee} د.ع</span>
             </div>
             <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between font-black text-lg text-[#055C33] dark:text-[#2DD4BF]">
               <span>المجموع النهائي:</span>
               <span>{totalAmount} د.ع</span>
             </div>
          </div>

          {canDelete && (
            <div className="pt-4">
              <button 
                onClick={() => setIsDeleteModalOpen(selectedOrder.id)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
              >
                <Trash2 className="w-5 h-5" />
                حذف الطلب من السجل
              </button>
            </div>
          )}
        </div>
        
        {/* Delete Modal for Detail View */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm shadow-xl p-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">حذف الطلب</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا الطلب من السجل الخاص بك؟ لن تتمكن من استعادته لاحقاً.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(null)} 
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={() => handleDelete(isDeleteModalOpen)} 
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] dark:bg-gray-900 min-h-full pb-24 transition-colors">
      <div className="bg-[#055C33] text-white pt-8 pb-10 px-5 rounded-b-[2rem] shadow-sm relative z-0">
        <h1 className="text-2xl font-black text-center mb-1">طلباتي</h1>
        <p className="text-center text-white/80 text-sm">متابعة حالة طلباتك وسجلك</p>
      </div>
      
      <div className="p-4 space-y-4 -mt-6 relative z-10">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 dark:border-gray-700 mt-4">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">لا توجد طلبات</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">لم تقم بإجراء أي طلبات حتى الآن.</p>
          </div>
        ) : (
          orders.map(order => {
            const totalAmount = order.items.reduce((sum: number, item: any) => sum + ((item.price || 0) * item.quantity), 0) + order.deliveryFee;
            const currentStatus = statusMap[order.status];
            const StatusIcon = currentStatus?.icon || Clock;
            const canDelete = false;

            return (
              <div key={order.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#055C33]/30 dark:hover:border-[#2DD4BF]/30 transition-all cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-gray-900 dark:text-white">طلب {order.id}</span>
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${currentStatus?.color} dark:bg-opacity-20`}>
                    {currentStatus?.label}
                  </span>
                </div>
                
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-1.5" dir="ltr">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {order.date}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">المنتجات: {order.items.reduce((acc: number, i: any) => acc + i.quantity, 0)}</span>
                     <span className="font-black text-[#055C33] dark:text-[#2DD4BF] text-lg">{totalAmount} <span className="text-sm">د.ع</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canDelete && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(order.id); }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      className="text-sm font-bold text-[#055C33] dark:text-[#2DD4BF] bg-[#055C33]/10 dark:bg-[#2DD4BF]/10 px-4 py-2 rounded-xl hover:bg-[#055C33] hover:text-white dark:hover:bg-[#2DD4BF] dark:hover:text-gray-900 transition-colors"
                    >
                      التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Modal for List View */}
      {isDeleteModalOpen && !selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm shadow-xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">حذف الطلب</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا الطلب من السجل الخاص بك؟ لن تتمكن من استعادته لاحقاً.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(null)} 
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={() => handleDelete(isDeleteModalOpen)} 
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
