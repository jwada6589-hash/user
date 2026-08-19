import { useState } from 'react';
import { Heart, ShoppingCart, Plus, Minus, X } from 'lucide-react';

export default function ProductDetailsView({ product, onAddToCart, favorites, toggleFavorite, onBack }: any) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  
  if (!product) return null;
  
  const isFavorite = favorites.includes(product.id);

  const handleOptionSelect = (optionName: string, choice: string) => {
    setSelectedOptions((prev: any) => ({
      ...prev,
      [optionName]: choice
    }));
  };

  const handleAddToCart = () => {
    // Basic validation to ensure all options are selected
    if (product.options) {
      const missingOptions = product.options.filter((opt: any) => !selectedOptions[opt.name]);
      if (missingOptions.length > 0) {
        alert(`الرجاء اختيار: ${missingOptions.map((o: any) => o.name).join(', ')}`);
        return;
      }
    }
    
    const added = onAddToCart(product, quantity, selectedOptions);
    if (!added) return;
    alert('تمت الإضافة للسلة');
    if (onBack) onBack(); // Go back after adding to cart
  };

  // Helper to determine active price
  const getActivePrice = () => {
    if (product.isOffer && product.offerPrice && product.offerEndAt) {
      const now = new Date();
      const endDate = new Date(product.offerEndAt);
      if (endDate > now) {
        return product.offerPrice;
      }
    }
    return product.numericPrice;
  };

  const activePrice = getActivePrice();
  const hasActiveOffer = product.isOffer && activePrice === product.offerPrice;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24 transition-colors relative">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
        />
        {/* Floating Back/Close Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2.5 rounded-full z-10 transition shadow-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-6 h-6 stroke-[2]" />
        </button>

        {!hasActiveOffer && (
          <button 
            onClick={() => toggleFavorite(product.id)}
            className={`absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2.5 rounded-full z-10 transition shadow-sm ${isFavorite ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`}
          >
            <Heart className={`w-6 h-6 stroke-[2] ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">{product.name}</h1>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{product.size}</span>
          </div>
          <div className="text-left flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-[#055C33] dark:text-[#2DD4BF] text-2xl font-black block">{activePrice.toLocaleString()}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">{product.currency}</span>
            </div>
            {hasActiveOffer && (
              <span className="text-gray-400 dark:text-gray-500 text-sm line-through block font-bold">{product.price}</span>
            )}
          </div>
        </div>

        {product.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-4 mb-6">
            {product.description}
          </p>
        )}

        {/* Options */}
        {product.options && product.options.map((option: any) => (
          <div key={option.name} className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#F9B32B] rounded-full inline-block"></span>
              يرجى اختيار {option.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {option.choices.map((choice: string) => (
                <button
                  key={choice}
                  onClick={() => handleOptionSelect(option.name, choice)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                    selectedOptions[option.name] === choice 
                      ? 'bg-[#055C33] dark:bg-[#2DD4BF] text-white dark:text-gray-900 border-[#055C33] dark:border-[#2DD4BF] shadow-md shadow-[#055C33]/20 dark:shadow-[#2DD4BF]/20 scale-105' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#055C33]/50 dark:hover:border-[#2DD4BF]/50'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Quantity */}
        <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <span className="font-bold text-gray-900 dark:text-white">تحديد الكمية</span>
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-full p-1 border border-gray-200 dark:border-gray-600">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 shadow-sm hover:text-[#055C33] dark:hover:text-[#2DD4BF] rounded-full transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-xl text-gray-900 dark:text-white">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 shadow-sm hover:text-[#055C33] dark:hover:text-[#2DD4BF] rounded-full transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="mt-6 w-full bg-[#055C33] text-white font-bold text-lg py-4 rounded-2xl shadow-[0_4px_15px_rgba(5,92,51,0.3)] hover:bg-[#044727] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
        >
          <ShoppingCart className="w-6 h-6" />
          إضافة إلى السلة - {(activePrice * quantity).toLocaleString()} د.ع
        </button>
      </div>
    </div>
  );
}
