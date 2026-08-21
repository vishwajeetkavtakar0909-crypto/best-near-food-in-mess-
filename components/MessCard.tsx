
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Mess, MealType, DailyMenu } from '../types';

interface MessCardProps {
  mess: Mess;
  onClick: () => void;
  distance?: number;
}

const MessCard: React.FC<MessCardProps> = ({ mess, onClick, distance }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const shadow = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [
      "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "0 5px 15px -3px rgba(0, 0, 0, 0.1)"
    ]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate values from -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        boxShadow: shadow,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer flex flex-col h-full relative z-10"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div 
        className="relative h-56 overflow-hidden bg-gray-900" 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        <motion.img 
          src={mess.imageUrl || `https://picsum.photos/seed/${mess.id}/800/600`} 
          alt={mess.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        <div 
          className="absolute top-4 right-4 flex flex-col gap-2 items-end"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl shadow-md flex items-center space-x-1">
            <span className="text-yellow-400 font-bold">★</span>
            <span className="text-sm font-bold text-gray-800">{mess.rating}</span>
          </div>
          {distance !== undefined && (
            <div className="bg-orange-500/90 backdrop-blur text-white px-2.5 py-1 rounded-xl shadow-md flex items-center space-x-1 text-xs font-bold">
              <span>{distance.toFixed(1)} km away</span>
            </div>
          )}
        </div>
        
        <div 
          className="absolute bottom-4 left-4 right-4"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-end gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-xl overflow-hidden bg-white shrink-0">
              <img src={mess.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mess.name)}&backgroundColor=f97316`} alt={mess.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start gap-1 pb-0.5">
              <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-md">
                Today's Special
              </span>
              <h3 className="text-xl font-outfit font-black text-white leading-tight drop-shadow-xl group-hover:text-orange-400 transition-colors line-clamp-1">
                {mess.name}
              </h3>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="p-6 flex flex-col flex-grow bg-white group-hover:bg-orange-50/50 transition-colors"
        style={{ transform: "translateZ(20px)" }}
      >
        <p className="text-gray-500 text-sm flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{mess.location.address}</span>
        </p>

        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-3">
          {(Object.entries(mess.menus) as [MealType, DailyMenu][]).map(([type, menu]) => (
            <div key={type} className="text-center group-hover:bg-white p-2 rounded-2xl transition-all shadow-sm group-hover:shadow-md">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter mb-0.5">{type}</p>
              <p className="text-sm font-bold text-orange-600">₹{menu.price}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MessCard;
