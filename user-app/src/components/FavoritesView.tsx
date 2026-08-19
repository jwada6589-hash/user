import React from 'react';
import { useAppContext } from '../shared/context/AppContext';
import { Heart, ShoppingCart } from 'lucide-react';

export default function FavoritesView({ 
  favorites, 
  onProductClick,
  onAddToCart,
  toggleFavorite
}: any) {
  const { products } = useAppContext();
  
  // Filter out products that are in the favorites array
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
          <Heart size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">المفضلة فارغة</h2>
        <p className="text-gray-500 dark:text-gray-400">لم تقم بإضافة أي منتجات إلى المفضلة بعد.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {favoriteProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col shadow-sm border border-gray-100 dark:border-gray-700 relative group transition-all hover:shadow-md">
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 transition-transform active:scale-95"
            >
              <Heart size={16} className="fill-current" />
            </button>

            <div 
              className="w-full aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl mb-3 flex items-center justify-center cursor-pointer overflow-hidden relative"
              onClick={() => onProductClick(product)}
            >
              <img src={product.image} alt={product.name} className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div className="flex-1 flex flex-col justify-between" onClick={() => onProductClick(product)}>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 mb-1">{product.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.size}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-gray-700">
                <span className="font-black text-[#055C33] dark:text-[#2DD4BF] text-sm">
                  {product.price.toLocaleString()} د.ع
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-8 h-8 bg-[#055C33] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#044727] transition-colors"
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
