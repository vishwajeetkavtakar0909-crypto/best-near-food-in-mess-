
import React, { useState } from 'react';
import { Mess, User, MealType, MenuItem } from '../types';
import { extractMenuFromImage, getSmartSuggestions } from '../services/geminiService';

interface OwnerDashboardProps {
  user: User;
  mess: Mess;
  allMesses: Mess[];
  onUpdateMess: (mess: Mess) => void;
  onSwitchMess: (id: string) => void;
  onAddAnotherBranch: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, mess, allMesses, onUpdateMess, onSwitchMess, onAddAnotherBranch }) => {
  const [editingTab, setEditingTab] = useState<MealType>('lunch');
  const [isScanning, setIsScanning] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handlePriceChange = (price: number) => {
    const updated = { ...mess };
    updated.menus[editingTab].price = price;
    onUpdateMess(updated);
  };

  const addItem = () => {
    const updated = { ...mess };
    updated.menus[editingTab].items.push({ name: '', category: 'bhaji' });
    onUpdateMess(updated);
  };

  const updateItem = (idx: number, field: keyof MenuItem, value: string | number) => {
    const updated = { ...mess };
    const items = [...updated.menus[editingTab].items];
    items[idx] = { ...items[idx], [field]: value };
    updated.menus[editingTab].items = items;
    onUpdateMess(updated);
  };

  const removeItem = (idx: number) => {
    const updated = { ...mess };
    updated.menus[editingTab].items.splice(idx, 1);
    onUpdateMess(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const extracted = await extractMenuFromImage(base64);
      if (extracted) {
        const updated = { ...mess, menus: extracted };
        onUpdateMess(updated);
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const fetchAiSuggestions = async () => {
    if (mess.comments.length === 0) return;
    setIsSuggesting(true);
    const commentsText = mess.comments.map(c => c.text);
    const suggestions = await getSmartSuggestions(commentsText);
    setAiSuggestions(suggestions);
    setIsSuggesting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-72 space-y-4">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-50">
            <h3 className="font-black text-gray-900 mb-6 px-2 text-lg">My Establishments</h3>
            <div className="space-y-3">
              {allMesses.map(m => (
                <button
                  key={m.id}
                  onClick={() => onSwitchMess(m.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all text-sm border-2 ${
                    mess.id === m.id 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-100' 
                    : 'text-gray-400 border-transparent hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {m.name}
                </button>
              ))}
              <button 
                onClick={onAddAnotherBranch}
                className="w-full text-left px-5 py-4 rounded-2xl font-black text-orange-500 border-2 border-dashed border-orange-200 hover:bg-orange-50 flex items-center justify-center space-x-2 transition-all mt-4"
              >
                <span>+ Add Location</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-orange-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-4xl font-outfit font-black text-gray-900 leading-tight mb-2">{mess.name}</h1>
              <p className="text-orange-400 font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {mess.location.address}
              </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <label className="flex-1 bg-orange-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 cursor-pointer shadow-xl shadow-orange-100 flex items-center justify-center transition-all active:scale-95">
                {isScanning ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI Parsing...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    OCR Scan Menu
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isScanning} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-orange-50">
              <div className="flex bg-orange-50/50 p-1.5 rounded-3xl w-fit mb-10 border border-orange-50">
                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEditingTab(tab)}
                    className={`px-10 py-3 rounded-[1.25rem] font-black transition-all capitalize text-sm ${
                      editingTab === tab 
                      ? 'bg-white text-orange-600 shadow-md scale-105' 
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between bg-orange-50/30 p-8 rounded-[2rem] border border-orange-50 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black">₹</div>
                    <div>
                      <p className="text-xs font-black text-orange-600/50 uppercase tracking-widest">Base Price</p>
                      <h4 className="text-xl font-black text-gray-800">Fixed Thali Rate</h4>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    value={mess.menus[editingTab].price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-32 px-6 py-4 bg-white border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 font-black text-2xl text-orange-600 text-center shadow-lg"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-black text-gray-900 text-2xl">Menu Editor</h3>
                    <button 
                      onClick={addItem}
                      className="bg-orange-50 text-orange-600 font-black hover:bg-orange-100 px-6 py-3 rounded-2xl border border-orange-200 transition-all flex items-center"
                    >
                      <span className="mr-2">+</span> Add Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mess.menus[editingTab].items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-orange-50/50">
                        <select 
                          value={item.category}
                          onChange={(e) => updateItem(idx, 'category', e.target.value as any)}
                          className="w-full sm:w-auto px-5 py-3 bg-white border-none rounded-2xl text-sm font-black text-orange-600 shadow-sm focus:ring-4 focus:ring-orange-100"
                        >
                          <option value="bhaji">Bhaji</option>
                          <option value="chapati">Chapati</option>
                          <option value="rice">Rice</option>
                          <option value="dal">Dal</option>
                          <option value="sweet">Sweet</option>
                          <option value="other">Other</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="What's for today?" 
                          className="flex-grow w-full px-6 py-3 bg-white border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 shadow-sm font-bold text-gray-700"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        />
                        <button 
                          onClick={() => removeItem(idx)}
                          className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-orange-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100%] opacity-50 -mr-8 -mt-8"></div>
                <h3 className="font-black text-2xl mb-8 flex items-center relative z-10">
                  <span className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-sm">💡</span>
                  Smart Analysis
                </h3>
                {mess.comments.length > 0 ? (
                  <div className="space-y-6 relative z-10">
                    <button 
                      onClick={fetchAiSuggestions}
                      disabled={isSuggesting}
                      className="w-full bg-gray-900 text-white py-4 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all mb-4 disabled:opacity-50 shadow-xl shadow-gray-200"
                    >
                      {isSuggesting ? "Processing Feedback..." : "Analyze Demand"}
                    </button>
                    <div className="space-y-4">
                      {aiSuggestions.map((s, idx) => (
                        <div key={idx} className="p-6 bg-orange-50/80 text-orange-800 rounded-3xl border border-orange-100 text-sm font-bold leading-relaxed shadow-sm">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 relative z-10">
                    <p className="text-gray-300 text-sm font-bold italic">No feedback data available for analysis yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
