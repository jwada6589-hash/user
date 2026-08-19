import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Search, MessageCircle, X } from 'lucide-react';
import { useAppContext } from '../shared/context/AppContext';

export default function Header({ onMenuClick, onProductClick }: any) {
  const { products, settings } = useAppContext();
  const { storeName = '', storeSubtitle = '', whatsappEnabled = false, whatsappNumber = '', whatsappDefaultMessage = '' } = settings ?? {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  const handleWhatsAppClick = () => {
    if (!whatsappEnabled) return;
    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    const encodedMessage = encodeURIComponent(whatsappDefaultMessage);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = products.filter(p => 
    searchQuery.trim() !== '' && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#055C33] text-white pt-5 pb-6 px-5 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
      {/* Top Bar Navigation */}
      <div className="flex justify-between items-center mb-6">
        {whatsappEnabled ? (
          <button 
            onClick={handleWhatsAppClick}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition bg-green-500/20 shadow-inner shrink-0"
            title="تواصل معنا عبر واتساب"
          >
            <MessageCircle className="w-5 h-5 stroke-[1.5]" />
          </button>
        ) : (
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition shrink-0">
            <Bell className="w-5 h-5 stroke-[1.5]" />
          </button>
        )}
        
        <div className="text-center flex flex-col items-center flex-1 mx-2 overflow-hidden">
          <span className="text-sm font-medium mb-[-4px]">أسواق</span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none mb-1 w-full text-center">{storeName}</h1>
          <div className="flex items-center justify-center gap-1 opacity-90 w-full truncate">
            <span className="text-[10px] shrink-0">🌿</span>
            <p className="text-[11px] font-medium truncate">{storeSubtitle}</p>
            <span className="text-[10px] shrink-0">🌿</span>
          </div>
        </div>

        <button onClick={onMenuClick} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition shrink-0">
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mt-2" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearching(true);
          }}
          onFocus={() => setIsSearching(true)}
          placeholder="ابحث عن منتج أو فئة..."
          className="w-full bg-[#0A6B3D] border border-[#0A6B3D] text-white placeholder-white/70 rounded-2xl py-3.5 pr-4 pl-12 focus:outline-none focus:ring-1 focus:ring-white/50 text-sm transition-all"
        />
        
        {searchQuery && (
          <button 
            onClick={() => {
              setSearchQuery('');
              setIsSearching(false);
            }} 
            className="absolute inset-y-0 right-4 flex items-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {isSearching && searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-72 overflow-y-auto z-[100] p-2">
            {searchResults.length > 0 ? (
              searchResults.map(product => (
                <div 
                  key={product.id}
                  onClick={() => {
                    onProductClick?.(product);
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl cursor-pointer transition-colors"
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{product.name}</h4>
                    <p className="text-[#055C33] dark:text-[#2DD4BF] font-black text-sm">{product.price} د.ع</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                لا توجد نتائج مطابقة لبحثك "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
