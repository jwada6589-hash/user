import { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: 'عروض يومية',
    subtitle: 'خصومات تصل إلى',
    discount: '30',
    badge: <>عروض<br/>اليوم</>,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=400&h=400',
    bgColor: 'bg-[#055C33]',
    accentColor: 'text-[#F9B32B]',
    buttonBg: 'bg-[#F9B32B]',
    buttonHover: 'hover:bg-[#f0a71b]',
    glowColor: 'bg-green-400',
    leafColor: 'text-green-400',
  },
  {
    id: 2,
    title: 'خضار وفواكه',
    subtitle: 'طازجة يومياً بخصم',
    discount: '20',
    badge: <>طازج<br/>دائماً</>,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400&h=400',
    bgColor: 'bg-[#991b1b]',
    accentColor: 'text-[#fef08a]',
    buttonBg: 'bg-[#fef08a]',
    buttonHover: 'hover:bg-[#fde047]',
    glowColor: 'bg-red-400',
    leafColor: 'text-red-300',
  },
  {
    id: 3,
    title: 'عناية شخصية',
    subtitle: 'وفر أكثر مع خصم',
    discount: '50',
    badge: <>نصف<br/>السعر</>,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=400',
    bgColor: 'bg-[#1e3a8a]',
    accentColor: 'text-[#bfdbfe]',
    buttonBg: 'bg-[#bfdbfe]',
    buttonHover: 'hover:bg-[#93c5fd]',
    glowColor: 'bg-blue-400',
    leafColor: 'text-blue-300',
  },
  {
    id: 4,
    title: 'مخبوزات',
    subtitle: 'طعم لا يقاوم بخصم',
    discount: '15',
    badge: <>ساخن<br/>ولذيذ</>,
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=400&h=400',
    bgColor: 'bg-[#9a3412]',
    accentColor: 'text-[#fed7aa]',
    buttonBg: 'bg-[#fed7aa]',
    buttonHover: 'hover:bg-[#fdba74]',
    glowColor: 'bg-orange-400',
    leafColor: 'text-orange-300',
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-4 mt-5 relative rounded-[1.5rem] overflow-hidden shadow-sm aspect-[2.35/1]">
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={`min-w-full h-full relative ${slide.bgColor}`}>
            {/* Yellow Badge */}
            <div className={`absolute top-0 right-6 ${slide.buttonBg} text-gray-900 font-bold text-xs px-3 py-1.5 rounded-b-xl rounded-tl-xl transform rotate-[10deg] origin-top-right z-20 text-center leading-tight shadow-sm`}>
              {slide.badge}
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none overflow-hidden">
               <div className={`w-[300px] h-[300px] ${slide.glowColor} rounded-full blur-[80px] absolute -right-20 -top-20`}></div>
            </div>

            <div className="flex px-6 items-center relative z-10 w-full h-full">
              <div className="w-[55%] flex flex-col justify-center h-full pb-2">
                <h2 className="text-white text-[20px] font-black mb-0.5">{slide.title}</h2>
                <p className="text-white/90 text-[10px] mb-0.5">{slide.subtitle}</p>
                <div className={`flex items-start ${slide.accentColor} mb-2.5`}>
                  <span className="text-5xl font-black leading-none tracking-tighter">{slide.discount}</span>
                  <span className="text-2xl font-bold mt-1 ml-1">%</span>
                </div>
                <div>
                  <button className={`${slide.buttonBg} text-gray-900 font-bold py-1.5 px-6 rounded-full text-xs shadow-sm transition ${slide.buttonHover}`}>
                    تسوق الآن
                  </button>
                </div>
              </div>
              
              <div className="w-[45%] relative h-[85%] flex justify-end items-center pb-2">
                {/* Leaves decoration */}
                <div className={`absolute top-0 right-2 ${slide.leafColor} opacity-60 text-sm transform rotate-45`}>🍃</div>
                <div className={`absolute bottom-2 left-2 ${slide.leafColor} opacity-60 text-sm transform -rotate-12`}>🍃</div>
                
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Dots */}
      <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
        {slides.map((_, index) => (
          <div 
            key={index} 
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
