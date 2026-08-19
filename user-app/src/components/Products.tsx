import { useState, useMemo } from 'react';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function Products({ selectedSubCategory, onAddToCart, onProductClick, favorites, toggleFavorite }: any) {
  const { products: allProducts } = useAppContext();
  const [displayedCount, setDisplayedCount] = useState(20);
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    
    if (showFavorites) {
      result = result.filter(p => favorites.includes(p.id));
    }
    
    if (selectedSubCategory) {
      result = result.filter(p => p.subCategoryId === selectedSubCategory);
    }
    
    return result;
  }, [allProducts, selectedSubCategory, showFavorites, favorites]);

  const visibleProducts = filteredProducts.slice(0, displayedCount);
  const hasMore = displayedCount < filteredProducts.length;

  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 20, filteredProducts.length));
  };

  // Reset displayed count when subcategory changes
  useMemo(() => {
    setDisplayedCount(20);
  }, [selectedSubCategory]);

  return (
    <div className="mt-4">
      {selectedSubCategory !== null && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white">
            {showFavorites ? 'المفضلة' : 'المنتجات'}
          </h3>
          <div className="flex items-center gap-3">
            {!showFavorites && (
              <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{filteredProducts.length} منتج</span>
            )}
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className={`text-sm font-semibold flex items-center gap-1 transition ${showFavorites ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              المفضلة <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {visibleProducts.map((product) => {
          const isFavorite = favorites.includes(product.id);
          
          return (
          <div 
            key={product.id} 
            onClick={() => onProductClick(product)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden cursor-pointer hover:border-[#055C33] dark:hover:border-[#2DD4BF] transition-colors"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
              className={`absolute top-3 right-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-1.5 rounded-full z-10 transition shadow-sm ${isFavorite ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`}
            >
              <Heart className={`w-[16px] h-[16px] stroke-[2] ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <div className="h-32 mb-2 w-full relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center px-1">
              <h4 className="text-gray-900 dark:text-white font-bold text-xs leading-tight mb-1 line-clamp-2">{product.name}</h4>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] mb-2">{product.size}</span>
              
              <div className="mt-auto mb-2 flex items-baseline gap-1">
                <span className="text-gray-900 dark:text-white font-black text-sm">{product.price}</span>
                <span className="text-gray-600 dark:text-gray-400 text-[9px] font-bold">{product.currency}</span>
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
                className="w-full bg-[#055C33] hover:bg-[#044727] text-white py-1.5 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold transition"
              >
                <ShoppingCart className="w-[12px] h-[12px]" />
                أضف للسلة
              </button>
            </div>
          </div>
        )})}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mb-6">
          <button 
            onClick={loadMore}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#055C33] dark:text-[#2DD4BF] font-bold py-2.5 px-8 rounded-full text-sm shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            عرض المزيد ({filteredProducts.length - displayedCount})
          </button>
        </div>
      )}
      {!hasMore && filteredProducts.length === 0 && (
         <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-12 flex flex-col items-center">
           <Heart className={`w-12 h-12 mb-3 ${showFavorites ? 'text-red-200 dark:text-red-900/50' : 'text-gray-200 dark:text-gray-700'}`} />
           <p>{showFavorites ? 'لا توجد منتجات في المفضلة' : 'لا توجد منتجات في هذا القسم'}</p>
         </div>
      )}
    </div>
  );
}
