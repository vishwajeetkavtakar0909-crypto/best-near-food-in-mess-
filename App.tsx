
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { INITIAL_MESSES } from './constants';
import { Mess, User, MealType } from './types';
import Header from './components/Header';
import MessCard from './components/MessCard';
import MessDetails from './components/MessDetails';
import OwnerDashboard from './components/OwnerDashboard';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
  const [messes, setMesses] = useState<Mess[]>(() => {
    const saved = localStorage.getItem('messes_v7');
    return saved ? JSON.parse(saved) : INITIAL_MESSES;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialRegisterMode, setInitialRegisterMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [view, setView] = useState<'home' | 'dashboard'>('home');

  const messesSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    localStorage.setItem('messes_v7', JSON.stringify(messes));
  }, [messes]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    setInitialRegisterMode(false);
    if (user.role === 'owner') setView('dashboard');
  };

  const handleRegisterMess = (newMess: Mess, ownerName: string) => {
    setMesses(prev => [newMess, ...prev]);
    
    if (currentUser && currentUser.role === 'owner') {
      setCurrentUser({
        ...currentUser,
        messIds: [...(currentUser.messIds || []), newMess.id],
        activeMessId: newMess.id
      });
    } else {
      setCurrentUser({
        id: Date.now().toString(),
        name: ownerName,
        role: 'owner',
        messIds: [newMess.id],
        activeMessId: newMess.id
      });
    }
    
    setIsLoginOpen(false);
    setInitialRegisterMode(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
    setSelectedMess(null);
  };

  const updateMess = (updatedMess: Mess) => {
    setMesses(prev => prev.map(m => m.id === updatedMess.id ? updatedMess : m));
  };

  const openRegisterModal = () => {
    setInitialRegisterMode(true);
    setIsLoginOpen(true);
  };

  const handleGetLiveLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
        setSearchQuery(''); 
        messesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      },
      (err) => {
        console.error("Location error:", err);
        setIsLocating(false);
        alert("Could not access live location. Please check your permissions.");
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredAndSortedMesses = useMemo(() => {
    let result = messes.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (userLocation) {
      result = [...result].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
        return distA - distB;
      });
    }

    return result;
  }, [messes, searchQuery, userLocation]);

  const activeMess = messes.find(m => m.id === currentUser?.activeMessId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        currentUser={currentUser} 
        onLogin={() => { setInitialRegisterMode(false); setIsLoginOpen(true); }}
        onLogout={handleLogout}
        onDashboard={() => setView('dashboard')}
        onHome={() => { setView('home'); setSelectedMess(null); }}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'home' ? (
          <>
            {!selectedMess ? (
              <motion.div 
                className="animate-in fade-in duration-700 relative"
              >
                {/* 3D Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                  <motion.div 
                    animate={{ rotate: 360, y: [0, -20, 0] }} 
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute top-10 -left-20 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl"
                  />
                  <motion.div 
                    animate={{ rotate: -360, y: [0, 30, 0] }} 
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="absolute top-40 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
                  />
                </div>

                {/* Hero Section */}
                <motion.div 
                  style={{ y: heroY, opacity: heroOpacity }}
                  className="mb-12 text-center pt-10"
                >
                  <motion.h1 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-4xl md:text-7xl font-outfit font-black text-gray-900 mb-6 tracking-tight"
                  >
                    Your Daily <span className="text-orange-500">Thali</span>, Simplified.
                  </motion.h1>
                  <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg">
                    Discover local messes and hotels offering healthy homemade meals. 
                    Check today's menu, fixed thali prices, and find the nearest options in seconds.
                  </p>
                  
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input 
                        type="text"
                        placeholder="Search by mess name or area..."
                        className="w-full pl-16 pr-32 py-5 rounded-3xl shadow-2xl border-none focus:outline-none focus:ring-4 focus:ring-orange-100 text-lg transition-all bg-orange-50/50"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (e.target.value) setUserLocation(null);
                        }}
                      />
                      <button 
                        onClick={handleGetLiveLocation}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95 ${isLocating ? 'animate-pulse' : ''}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLocating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="hidden sm:inline">Near Me</span>
                      </button>
                    </div>
                    {userLocation && (
                      <div className="flex items-center justify-center space-x-2 text-orange-600 font-bold animate-in fade-in slide-in-from-top-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                        <span>Showing nearest messes within your reach</span>
                        <button onClick={() => setUserLocation(null)} className="text-gray-400 hover:text-red-500 ml-2">✕</button>
                      </div>
                    )}
                  </div>
                </motion.div>

                <div ref={messesSectionRef} className="scroll-mt-24">
                  {filteredAndSortedMesses.length > 0 ? (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                    >
                      {filteredAndSortedMesses.map((mess) => (
                        <motion.div 
                          key={mess.id}
                          variants={{
                            hidden: { opacity: 0, y: 50 },
                            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                          }}
                        >
                          <MessCard 
                            mess={mess} 
                            onClick={() => setSelectedMess(mess)} 
                            distance={userLocation ? calculateDistance(userLocation.lat, userLocation.lng, mess.location.lat, mess.location.lng) : undefined}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
                      <div className="text-6xl mb-4 text-orange-200">🍽️</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">No Messes Found</h2>
                      <p className="text-gray-500 mb-6">We couldn't find any mess matching your search.</p>
                      <button 
                        onClick={openRegisterModal}
                        className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
                      >
                        Are you a Mess Owner? Join Us!
                      </button>
                    </div>
                  )}
                </div>

                {/* Partner Growth Section */}
                <div className="mt-24 mb-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-outfit font-black mb-6">Grow Your Food Business</h2>
                    <p className="text-orange-50 mb-8 text-lg">
                      Reach thousands of local customers, manage your daily menu effortlessly with AI, 
                      and build a loyal community around your food.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={openRegisterModal}
                        className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl"
                      >
                        Register Your Mess Now
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-10 opacity-20 hidden md:block">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ) : (
              <MessDetails 
                mess={selectedMess} 
                onBack={() => setSelectedMess(null)}
                onAddComment={(comment) => {
                  const updated = { ...selectedMess, comments: [comment, ...selectedMess.comments] };
                  updateMess(updated);
                  setSelectedMess(updated);
                }}
              />
            )}
          </>
        ) : (
          <OwnerDashboard 
            user={currentUser!} 
            mess={activeMess!}
            allMesses={messes.filter(m => currentUser?.messIds?.includes(m.id))}
            onUpdateMess={updateMess}
            onSwitchMess={(id) => setCurrentUser({ ...currentUser!, activeMessId: id })}
            onAddAnotherBranch={openRegisterModal}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center space-x-2 mb-4 justify-center md:justify-start">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold shadow-lg">B</div>
              <span className="text-xl font-outfit font-black text-orange-600">BEST_J1</span>
            </div>
            <p className="text-gray-400 text-sm">Serving local happiness through fresh food. Trusted by thousands of users.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-bold text-gray-800">For Customers</h4>
            <button onClick={handleGetLiveLocation} className="text-gray-500 hover:text-orange-600 text-sm text-left transition-colors">Find Near Me</button>
            <a href="#" className="text-gray-500 hover:text-orange-600 text-sm transition-colors">Browse All Messes</a>
            <a href="#" className="text-gray-500 hover:text-orange-600 text-sm transition-colors">Community Guidelines</a>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-bold text-gray-800">For Owners</h4>
            <button onClick={openRegisterModal} className="text-gray-500 hover:text-orange-600 text-sm text-left transition-colors">Add My Hotel</button>
            <a href="#" className="text-gray-500 hover:text-orange-600 text-sm transition-colors">Business Dashboard</a>
            <a href="#" className="text-gray-500 hover:text-orange-600 text-sm transition-colors">AI Features Guide</a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 text-center text-gray-300 text-xs">
          <p>© 2024 BEST_J1 Inc. Handcrafted for local communities.</p>
        </div>
      </footer>

      {isLoginOpen && (
        <LoginModal 
          onClose={() => { setIsLoginOpen(false); setInitialRegisterMode(false); }} 
          onLogin={handleLogin}
          onRegisterMess={handleRegisterMess}
          messes={messes}
          initialRegisterMode={initialRegisterMode}
        />
      )}
    </div>
  );
};

export default App;
