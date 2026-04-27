import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapModal({ data, userSkills, onClose, onSkillClick }) {
  const [activeTab, setActiveTab] = useState('to-learn');

  // استخراج أسماء المهارات التي أتقنها المستخدم للمقارنة
  const masteredSkillNames = userSkills?.map(s => s.skillName) || [];

  // تصنيف المهارات القادمة من الـ AI
  const toLearnSkills = data.filter(item => !masteredSkillNames.includes(item.skillName));
  const masteredSkills = data.filter(item => masteredSkillNames.includes(item.skillName));

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md font-sans"
    >
      <div className="bg-white w-full max-w-5xl h-[85vh] overflow-hidden rounded-[3rem] flex flex-col relative shadow-2xl border border-white/20">
        
        {/* Header Section */}
        <div className="p-10 pb-6 border-b border-slate-50">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-all">
            <i className="fa-solid fa-circle-xmark text-3xl"></i>
          </button>
          
          <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">Skill Navigator</h2>
          
          {/* Tabs Switcher */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab('to-learn')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'to-learn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              To Learn ({toLearnSkills.length})
            </button>
            <button 
              onClick={() => setActiveTab('mastered')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mastered' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Mastered ({masteredSkills.length})
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-10 pt-8 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {(activeTab === 'to-learn' ? toLearnSkills : masteredSkills).map((item, index) => (
                <motion.div 
                  key={item.skillName}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onSkillClick(item.skillName)}
                  className={`p-6 rounded-[2.5rem] border bg-white cursor-pointer group transition-all hover:shadow-xl ${activeTab === 'to-learn' ? 'hover:border-indigo-500' : 'hover:border-emerald-500'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-colors ${activeTab === 'to-learn' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                    <i className={`fa-solid ${activeTab === 'to-learn' ? 'fa-rocket' : 'fa-check-double'} text-lg`}></i>
                  </div>
                  <h3 className="font-black text-slate-900 text-lg tracking-tighter mb-2 uppercase italic">{item.skillName}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase leading-relaxed mb-6">
                    {activeTab === 'to-learn' ? 'Required for your target role. Tap for sources.' : 'Excellent! You have added this to your stack.'}
                  </p>
                  <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${activeTab === 'to-learn' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                    {activeTab === 'to-learn' ? 'Start Journey' : 'Review Source'} <i className="fa-solid fa-arrow-right-long ml-1 group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}