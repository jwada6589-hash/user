import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import SubCategoriesView from './components/SubCategoriesView';
import Products from './components/Products';
import ProductDetailsView from './components/ProductDetailsView';
import Features from './components/Features';
import BottomNav from './components/BottomNav';
import CartView from './components/CartView';
import OrdersView from './components/OrdersView';
import ProfileView from './components/ProfileView';
import DailyOffersView from './components/DailyOffersView';
import GiftsView from './components/GiftsView';
import AuthView from './components/AuthView';
import AuthModal from './components/AuthModal';
import FavoritesView from './components/FavoritesView';
import { useAppContext } from './shared/context/AppContext';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [previousView, setPreviousView] = useState('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const { products: allProducts, categories, authState, requireAuth, setShowAuthModal, favorites, toggleFavorite: toggleFavoriteRemote } = useAppContext();

  if (authState === 'logged_out') {
    return (
      <div className="max-w-md mx-auto bg-[#F8F9FA] dark:bg-gray-900 min-h-screen relative font-cairo shadow-2xl overflow-hidden flex flex-col transition-colors" dir="rtl">
        <AuthView onSuccess={() => {}} />
      </div>
    );
  }

  const toggleFavorite = (id: string) => {
    requireAuth(() => {
      void toggleFavoriteRemote(id);
    });
  };

  const addToCart = (product: any, quantity: number = 1, selectedOptions: any = {}) => {
    if (authState !== 'authenticated') {
      setShowAuthModal(true);
      return false;
    }
    setCartItems(prev => {
        // Find if same product with same options exists
        const existingIndex = prev.findIndex(item => 
          item.id === product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
        );
        
        if (existingIndex >= 0) {
          const newItems = [...prev];
          newItems[existingIndex].quantity += quantity;
          return newItems;
        }
        return [...prev, { ...product, quantity, selectedOptions, cartItemId: Date.now() + Math.random() }];
    });
    return true;
  };

  const updateQuantity = (cartItemId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId || item.id === cartItemId) { // support old and new
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCartItems([]);

  const handleNavChange = (view: string) => {
    const restrictedViews = ['cart', 'orders', 'profile', 'gifts', 'favorites'];
    if (restrictedViews.includes(view)) {
      requireAuth(() => {
        setPreviousView(currentView);
        setCurrentView(view);
      });
      return;
    }

    setPreviousView(currentView);
    setCurrentView(view);
    if (view === 'home') {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedProduct(null);
    }
  };

  const openCategory = (id: any) => {
    setPreviousView(currentView);
    setSelectedCategory(id);
    setCurrentView('subcategories');
  };

  const openSubCategory = (id: any) => {
    setPreviousView(currentView);
    setSelectedSubCategory(id);
    setCurrentView('products');
  };

  const openProduct = (product: any) => {
    setPreviousView(currentView);
    setSelectedProduct(product);
    setCurrentView('productDetails');
  };

  const goBack = () => {
    if (currentView === 'productDetails') {
      setCurrentView(previousView);
    } else if (currentView === 'products') {
      setCurrentView('subcategories');
    } else if (currentView === 'subcategories') {
      setCurrentView('home');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] dark:bg-gray-900 min-h-screen relative pb-24 font-cairo shadow-2xl overflow-hidden flex flex-col transition-colors" dir="rtl">
      {(currentView === 'home' || currentView === 'subcategories' || currentView === 'products') && 
        <Header 
          onMenuClick={() => handleNavChange('profile')} 
          onProductClick={openProduct}
        />
      }
      
      {currentView !== 'home' && currentView !== 'cart' && currentView !== 'orders' && currentView !== 'profile' && currentView !== 'productDetails' && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center border-b border-gray-100 dark:border-gray-700 shadow-sm z-20 transition-colors">
          <button onClick={goBack} className="p-2 -mr-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mr-2">
            {currentView === 'subcategories' && categories.find(c => c.id === selectedCategory)?.name}
            {currentView === 'products' && "المنتجات"}
          </h2>
        </div>
      )}

      <main className="px-0 flex-1 overflow-y-auto hide-scrollbar relative">
         {currentView === 'home' ? (
           <>
             <Hero />
             <div className="px-4">
               <Categories onSelectCategory={openCategory} onOpenFavorites={() => handleNavChange('favorites')} />
               <Features />
             </div>
           </>
         ) : currentView === 'subcategories' ? (
           <SubCategoriesView categoryId={selectedCategory} onSelectSubCategory={openSubCategory} />
         ) : currentView === 'products' ? (
           <div className="px-4">
             <Products 
               selectedSubCategory={selectedSubCategory} 
               onProductClick={openProduct}
               onAddToCart={addToCart} 
               favorites={favorites}
               toggleFavorite={toggleFavorite}
             />
           </div>
         ) : currentView === 'productDetails' ? (
           <ProductDetailsView 
             product={selectedProduct} 
             onBack={goBack}
             onAddToCart={addToCart}
             favorites={favorites}
             toggleFavorite={toggleFavorite}
           />
         ) : currentView === 'cart' ? (
           <CartView items={cartItems} updateQuantity={updateQuantity} onViewChange={handleNavChange} clearCart={clearCart} />
         ) : currentView === 'orders' ? (
           <OrdersView onViewChange={handleNavChange} />
         ) : currentView === 'profile' ? (
           <ProfileView onViewChange={handleNavChange} />
          ) : currentView === 'gifts' ? (
            <GiftsView onViewChange={handleNavChange} />
         ) : currentView === 'favorites' ? (
            <FavoritesView 
              favorites={favorites} 
              onProductClick={openProduct}
              onAddToCart={addToCart}
              toggleFavorite={toggleFavorite}
            />
          ) : currentView === 'offers' ? (
           <DailyOffersView onAddToCart={addToCart} onProductClick={openProduct} />
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-gray-400 py-32">
             <div className="text-4xl mb-4 opacity-50">🚧</div>
             <p className="font-bold">قريباً...</p>
             <p className="text-sm mt-2">هذه الصفحة قيد التطوير</p>
           </div>
         )}
      </main>
      <BottomNav currentView={currentView} onViewChange={handleNavChange} cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
      <AuthModal />
    </div>
  )
}
