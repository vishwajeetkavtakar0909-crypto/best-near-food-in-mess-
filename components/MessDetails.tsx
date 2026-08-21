
import React, { useState } from 'react';
import { Mess, Comment, MealType } from '../types';

interface MessDetailsProps {
  mess: Mess;
  onBack: () => void;
  onAddComment: (comment: Comment) => void;
}

const MessDetails: React.FC<MessDetailsProps> = ({ mess, onBack, onAddComment }) => {
  const [activeTab, setActiveTab] = useState<MealType>('lunch');
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const menu = mess.menus[activeTab];

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    
    onAddComment({
      id: Date.now().toString(),
      userName,
      text: newComment,
      date: new Date().toLocaleDateString()
    });
    setNewComment('');
  };

  const getShareText = () => {
    const items = menu.items.map(i => i.name).join(', ');
    return `Check out ${mess.name}! Today's ${activeTab} menu is: ${items}. Price: ₹${menu.price}. Located at ${mess.location.address}. Found via BEST_J1!`;
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const quote = encodeURIComponent(getShareText());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-orange-600 font-bold hover:underline transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to search
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="relative h-64 md:h-96">
          <img 
            src={mess.imageUrl || `https://picsum.photos/seed/${mess.id}/1200/800`} 
            alt={mess.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white flex items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white shrink-0 hidden sm:block">
              <img src={mess.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mess.name)}&backgroundColor=f97316`} alt={mess.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-outfit font-black mb-2 leading-tight drop-shadow-xl">{mess.name}</h1>
              <p className="flex items-center text-orange-200 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {mess.location.address}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="flex bg-gray-100 p-1.5 rounded-3xl w-fit">
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-[1.25rem] font-black transition-all capitalize text-sm ${
                    activeTab === tab 
                    ? 'bg-white text-orange-600 shadow-md scale-105' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-orange-50 px-8 py-4 rounded-3xl border border-orange-100 flex items-center shadow-sm">
              <span className="text-orange-700 font-bold mr-6">Fixed Thali:</span>
              <span className="text-4xl font-outfit font-black text-orange-600">₹{menu.price}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-xl shadow-orange-50/50">
              <h3 className="text-2xl font-black mb-6 flex items-center text-gray-800">
                <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mr-4">🥣</span>
                Today's Menu
              </h3>
              <div className="space-y-4">
                {menu.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-orange-50/30 p-4 rounded-2xl border border-orange-50 transition-colors hover:bg-orange-50">
                    <div className="flex items-center">
                      <span className="capitalize text-[10px] font-black tracking-widest text-orange-500 bg-white px-3 py-1.5 rounded-lg shadow-sm mr-4 border border-orange-100">{item.category}</span>
                      <span className="font-bold text-gray-700 text-lg">{item.name}</span>
                    </div>
                  </div>
                ))}
                {menu.items.length === 0 && <p className="text-gray-400 italic text-center py-4">Menu items are yet to be updated.</p>}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200">
                <h3 className="text-2xl font-black mb-4 flex items-center">
                  <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-4">📱</span>
                  Get Tiffin
                </h3>
                <p className="text-orange-100 mb-6 font-medium">Call or WhatsApp to pre-order or book monthly tiffin service.</p>
                <a href={`tel:${mess.contact}`} className="flex items-center justify-center space-x-3 bg-white text-orange-600 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-transform active:scale-95 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 22.622l-8-1.142c-2.086-.298-4.149-1.394-5.833-3.078-1.684-1.684-2.78-3.747-3.078-5.833l-1.142-8c-.144-1.006.513-1.921 1.503-2.126l4-1.001c.961-.24 1.944.316 2.215 1.258l1 3.5c.189.66-.013 1.36-.516 1.822l-1.541 1.413c.892 2.1 2.614 3.822 4.713 4.713l1.413-1.541c.462-.503 1.162-.705 1.822-.516l3.5 1c.942.271 1.498 1.254 1.258 2.215l-1.001 4c-.205.991-1.121 1.648-2.127 1.503z"/></svg>
                  <span>{mess.contact}</span>
                </a>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                <h3 className="text-xl font-black mb-6 flex items-center text-gray-800">
                  <span className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mr-3">📢</span>
                  Spread the Word
                </h3>
                <div className="flex gap-4">
                  <button 
                    onClick={shareOnWhatsApp}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#25D366] text-white py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-md"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.133 1.415 4.765 1.415 5.421 0 9.835-4.414 9.836-9.835 0-2.628-1.023-5.097-2.88-6.953-1.857-1.857-4.327-2.88-6.955-2.88-5.421 0-9.834 4.413-9.835 9.835 0 1.768.476 3.493 1.376 5.005l-.944 3.454 3.637-.954zm12.115-6.173c-.084-.14-.308-.225-.644-.393-.335-.168-1.987-.981-2.295-1.092-.308-.113-.532-.168-.755.168-.223.335-.861 1.091-1.057 1.315-.194.223-.391.252-.726.084-.335-.168-1.413-.521-2.69-1.662-.994-.888-1.664-1.984-1.86-2.319-.195-.335-.02-.516.147-.683.151-.151.335-.393.503-.588.168-.196.223-.336.335-.561.112-.224.056-.42-.028-.588-.084-.168-.755-1.821-1.035-2.493-.273-.655-.547-.56-.755-.57l-.644-.007c-.223 0-.587.084-.894.42-.308.335-1.174 1.148-1.174 2.8s1.203 3.248 1.37 3.472c.167.224 2.368 3.615 5.736 5.068.802.345 1.427.551 1.914.706.804.256 1.536.219 2.113.135.644-.093 1.987-.812 2.267-1.596.28-.784.28-1.456.196-1.596z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                  <button 
                    onClick={shareOnFacebook}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#1877F2] text-white py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-md"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-12">
            <h3 className="text-3xl font-outfit font-black mb-8 text-gray-900">Community Feedback</h3>
            
            <form onSubmit={handleSubmitComment} className="mb-12 bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="px-6 py-4 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 shadow-sm bg-white"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Suggest a dish or leave a review..." 
                    className="px-6 py-4 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-200 shadow-sm bg-white"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-100">
                  Post Suggestion
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {mess.comments.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm animate-in fade-in slide-in-from-left-2 transition-all hover:shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-gray-800 text-lg">{c.userName}</span>
                    <span className="text-xs font-bold text-orange-400 bg-orange-50 px-3 py-1 rounded-full">{c.date}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed font-medium">{c.text}</p>
                </div>
              ))}
              {mess.comments.length === 0 && (
                <div className="text-center py-12 text-gray-300">
                  <p className="text-4xl mb-4">💬</p>
                  <p className="font-bold">No suggestions yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessDetails;
