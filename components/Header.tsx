
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onDashboard: () => void;
  onHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onLogout, onDashboard, onHome }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={onHome}
        >
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            B
          </div>
          <span className="text-2xl font-outfit font-extrabold text-orange-600 tracking-tight">BEST_J1</span>
        </div>

        <nav className="flex items-center space-x-6">
          <button onClick={onHome} className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Explorer</button>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              {currentUser.role === 'owner' && (
                <button 
                  onClick={onDashboard}
                  className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full font-medium hover:bg-orange-100 transition-colors border border-orange-100"
                >
                  My Mess
                </button>
              )}
              <div className="flex items-center space-x-3 border-l pl-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-orange-600 hover:shadow-lg transform transition active:scale-95 shadow-orange-100"
            >
              Owner Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
