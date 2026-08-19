import { Home, ShoppingCart, ClipboardList, User, Tag } from 'lucide-react';

export default function BottomNav({ currentView, onViewChange, cartCount }: any) {
  const activeColor = '#F9B32B'; // أصفر برتقالي جميل
  const activeFill = '#F9B32B';
  
  const NavItem = ({ id, icon: Icon, label, badge }: any) => {
    const isActive = currentView === id;
    
    return (
      <button 
        onClick={() => onViewChange(id)}
        className="flex flex-col items-center gap-1 transition-all relative group min-w-[3.8rem]"
      >
        {/* Icon Container */}
        <div className={`relative p-2 rounded-full transition-all duration-300 ${isActive ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
          {isActive && (
            <div className="absolute inset-0 bg-[#F9B32B]/10 rounded-full scale-110 transition-transform"></div>
          )}
          <Icon 
            className={`w-[24px] h-[24px] stroke-[2] relative z-10 transition-colors duration-300 ${!isActive ? 'text-gray-400 dark:text-gray-500' : ''}`} 
            color={isActive ? activeColor : 'currentColor'}
            fill={isActive ? activeFill : 'none'} 
            fillOpacity={isActive ? 0.2 : 0} 
          />
          {badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 border-2 border-white dark:border-gray-800 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-20 shadow-sm">
              {badge}
            </span>
          )}
        </div>
        
        {/* Label */}
        {isActive ? (
          <span className="text-[10px] font-extrabold whitespace-nowrap bg-gradient-to-r from-[#F9B32B] via-[#38BDF8] to-[#F9B32B] text-transparent bg-clip-text animate-shimmer">
            {label}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 transition-colors duration-300 group-hover:text-gray-500 dark:group-hover:text-gray-400">
            {label}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
      
      {/* Floating Pill Navigation */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-max bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-4 py-2 flex justify-center items-center gap-1 z-50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 rounded-full transition-colors">
        <NavItem id="cart" icon={ShoppingCart} label="السلة" badge={cartCount} />
        <NavItem id="offers" icon={Tag} label="العروض" />
        <NavItem id="home" icon={Home} label="الرئيسية" />
        <NavItem id="orders" icon={ClipboardList} label="طلباتي" />
        <NavItem id="profile" icon={User} label="حسابي" />
      </div>
    </>
  );
}
