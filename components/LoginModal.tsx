
import React, { useState, useEffect } from 'react';
import { User, Mess, DailyMenu } from '../types';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegisterMess: (mess: Mess, ownerName: string) => void;
  messes: Mess[];
  initialRegisterMode?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, onRegisterMess, messes, initialRegisterMode = false }) => {
  const [role, setRole] = useState<'customer' | 'owner'>(initialRegisterMode ? 'owner' : 'owner');
  const [isRegistering, setIsRegistering] = useState(initialRegisterMode);
  const [name, setName] = useState('');
  
  const [messName, setMessName] = useState('');
  const [messAddress, setMessAddress] = useState('');
  const [messContact, setMessContact] = useState('');
  const [selectedMessId, setSelectedMessId] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (initialRegisterMode) {
      setRole('owner');
      setIsRegistering(true);
    }
  }, [initialRegisterMode]);

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setMessAddress(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
      },
      () => setIsLocating(false)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (role === 'owner' && isRegistering) {
      const emptyMenu: DailyMenu = { items: [], price: 0 };
      const newMess: Mess = {
        id: `mess_${Date.now()}`,
        ownerId: `owner_${Date.now()}`,
        name: messName,
        location: {
          address: messAddress,
          lat: 0,
          lng: 0
        },
        contact: messContact,
        rating: 5,
        menus: {
          breakfast: { ...emptyMenu, price: 40 },
          lunch: { ...emptyMenu, price: 80 },
          dinner: { ...emptyMenu, price: 80 }
        },
        comments: []
      };
      onRegisterMess(newMess, name);
    } else {
      const foundMess = messes.find(m => m.id === selectedMessId) || messes[0];
      onLogin({
        id: Date.now().toString(),
        name,
        role,
        messIds: role === 'owner' ? [foundMess.id] : undefined,
        activeMessId: role === 'owner' ? foundMess.id : undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto border border-orange-100">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-orange-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-100">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <h2 className="text-4xl font-outfit font-black text-gray-900 leading-tight">
            {isRegistering ? 'Register Mess' : 'Sign In'}
          </h2>
          <p className="text-orange-500/60 mt-2 font-bold uppercase tracking-widest text-[10px]">Welcome to BEST_J1</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex p-1.5 bg-orange-50/50 rounded-2xl border border-orange-100">
            <button 
              type="button"
              onClick={() => { setRole('owner'); setIsRegistering(false); }}
              className={`flex-1 py-3.5 rounded-[1.25rem] font-black transition-all text-sm ${role === 'owner' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Owner
            </button>
            <button 
              type="button"
              onClick={() => { setRole('customer'); setIsRegistering(false); }}
              className={`flex-1 py-3.5 rounded-[1.25rem] font-black transition-all text-sm ${role === 'customer' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Customer
            </button>
          </div>

          <div>
            <label className="block text-xs font-black text-orange-600/60 uppercase tracking-widest mb-2 px-1">Your Full Name</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-orange-50/30 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all font-medium"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {role === 'owner' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              {!isRegistering ? (
                <>
                  <label className="block text-xs font-black text-orange-600/60 uppercase tracking-widest mb-2 px-1">Select Branch</label>
                  <select 
                    className="w-full px-6 py-4 bg-orange-50/30 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 mb-5 appearance-none font-bold text-gray-700"
                    value={selectedMessId}
                    onChange={(e) => setSelectedMessId(e.target.value)}
                  >
                    <option value="">Select your establishment</option>
                    {messes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setIsRegistering(true)}
                      className="text-sm text-orange-600 font-black hover:text-orange-700 underline underline-offset-8"
                    >
                      Establishment not listed? Register now
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5 pt-6 mt-6 border-t border-orange-50">
                  <div>
                    <label className="block text-xs font-black text-orange-600/60 uppercase tracking-widest mb-2 px-1">Business Name</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-orange-50/30 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 font-medium"
                      placeholder="e.g. Swad Mess"
                      value={messName}
                      onChange={(e) => setMessName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-orange-600/60 uppercase tracking-widest mb-2 px-1">Address / GPS</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-orange-50/30 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 pr-16 font-medium"
                        placeholder="Street or city"
                        value={messAddress}
                        onChange={(e) => setMessAddress(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        onClick={handleGetLocation}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-700 ${isLocating ? 'animate-pulse' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-orange-600/60 uppercase tracking-widest mb-2 px-1">Contact Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-6 py-4 bg-orange-50/30 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 font-medium"
                      placeholder="Mobile number"
                      value={messContact}
                      onChange={(e) => setMessContact(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setIsRegistering(false)}
                      className="text-sm text-orange-400 font-bold hover:text-orange-600 underline underline-offset-8"
                    >
                      Go back to branch selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-orange-100 hover:bg-orange-600 transform transition active:scale-95 mt-6"
          >
            {isRegistering ? 'Start My Journey' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
