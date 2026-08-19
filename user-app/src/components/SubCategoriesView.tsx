import { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function SubCategoriesView({ categoryId, onSelectSubCategory }: any) {
  const { subCategories } = useAppContext();
  const filteredSubs = useMemo(() => {
    return subCategories.filter(sub => sub.categoryId === categoryId);
  }, [categoryId]);

  return (
    <div className="p-4 bg-[#F8F9FA] dark:bg-gray-900 min-h-screen transition-colors">
      <div className="grid grid-cols-2 gap-4">
        {filteredSubs.length > 0 ? (
          filteredSubs.map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => onSelectSubCategory(sub.id)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center cursor-pointer hover:border-[#055C33] dark:hover:border-[#2DD4BF] group transition-all"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50 dark:bg-gray-700 relative">
                <img 
                  src={sub.image} 
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-sm mb-1 text-center group-hover:text-[#055C33] dark:group-hover:text-[#2DD4BF] transition-colors">{sub.name}</span>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-gray-400 dark:text-gray-500">
            لا توجد فروع في هذا القسم حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
