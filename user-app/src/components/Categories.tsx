import { Heart } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function Categories({ onSelectCategory, onOpenFavorites }: any) {
  const { categories, requireAuth } = useAppContext();
  return (
    <div className="mt-6 pt-2 pb-2">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">الأقسام</h3>
        <button 
          onClick={() => requireAuth(onOpenFavorites)}
          className="flex items-center gap-1.5 text-sm font-bold text-[#055C33] dark:text-[#2DD4BF] bg-[#055C33]/10 dark:bg-[#2DD4BF]/10 px-3 py-1.5 rounded-full hover:bg-[#055C33]/20 dark:hover:bg-[#2DD4BF]/20 transition-colors"
        >
          <Heart size={16} className="fill-current" />
          <span>المفضلة</span>
        </button>
      </div>
      
      {/* Grid Layout - 3 per row */}
      <div className="grid grid-cols-3 gap-y-6 gap-x-4">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => onSelectCategory(cat.id)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-24 h-24 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center relative overflow-hidden transition-all bg-white dark:bg-gray-800 group-hover:border-[#055C33] dark:group-hover:border-[#2DD4BF] mb-2 group-hover:shadow-md">
              <div className="absolute inset-0 bg-blue-50/40 dark:bg-gray-700/40 transition-colors group-hover:bg-[#055C33]/5 dark:group-hover:bg-[#2DD4BF]/10"></div>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-[5.25rem] h-[5.25rem] rounded-full object-cover z-10 shadow-sm"
              />
            </div>
            <span className="text-[13px] font-bold text-center px-1 leading-tight text-gray-800 dark:text-gray-200 group-hover:text-[#055C33] dark:group-hover:text-[#2DD4BF] transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
