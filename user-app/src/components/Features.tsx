import { Truck, ShieldCheck, Shield } from 'lucide-react';

export default function Features() {
  return (
    <div className="mt-2 mb-8 bg-white dark:bg-gray-800 rounded-[1rem] py-3.5 px-2 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 flex justify-between items-center relative z-10 transition-colors">
      <div className="flex items-center gap-2 flex-1 justify-center relative">
        <div className="flex flex-col items-end text-right">
          <span className="text-gray-900 dark:text-white font-bold text-[11px]">توصيل سريع</span>
          <span className="text-gray-400 dark:text-gray-500 text-[9px]">خلال 24 ساعة</span>
        </div>
        <Truck className="w-[22px] h-[22px] text-[#055C33] dark:text-[#2DD4BF] stroke-[1.5]" />
      </div>
      
      <div className="w-[1px] h-8 bg-gray-100 dark:bg-gray-700"></div>
      
      <div className="flex items-center gap-2 flex-1 justify-center relative">
        <div className="flex flex-col items-end text-right">
          <span className="text-gray-900 dark:text-white font-bold text-[11px]">منتجات أصلية</span>
          <span className="text-gray-400 dark:text-gray-500 text-[9px]">100% مضمونة</span>
        </div>
        <ShieldCheck className="w-[22px] h-[22px] text-[#055C33] dark:text-[#2DD4BF] stroke-[1.5]" />
      </div>
      
      <div className="w-[1px] h-8 bg-gray-100 dark:bg-gray-700"></div>
      
      <div className="flex items-center gap-2 flex-1 justify-center relative">
        <div className="flex flex-col items-end text-right">
          <span className="text-gray-900 dark:text-white font-bold text-[11px]">دفع آمن</span>
          <span className="text-gray-400 dark:text-gray-500 text-[9px]">خيارات دفع متعددة</span>
        </div>
        <Shield className="w-[22px] h-[22px] text-[#055C33] dark:text-[#2DD4BF] stroke-[1.5]" />
      </div>
    </div>
  );
}
