import React from 'react';
import { motion } from 'framer-motion';

const RightSidebar = () => {
  // بيانات مقترحة بناءً على اهتماماتك التقنية في الأردن
  const trendingSkills = [
    { name: 'Docker & K8s', level: 'High Demand', icon: 'fa-container-storage', color: 'text-blue-500' },
    { name: 'TypeScript', level: 'Essential', icon: 'fa-code', color: 'text-indigo-500' },
    { name: 'Cloud (Azure)', level: 'Growing', icon: 'fa-cloud', color: 'text-sky-500' }
  ];

  const goals = [
    { title: 'Solve 2 LeetCode', done: true },
    { title: 'Update Portfolio', done: false },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[320px]">
      
      {/* قسم المهارات الرائجة - Market Insights */}
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-xl shadow-blue-900/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Market Insights</h3>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </div>
        
        <div className="space-y-4">
          {trendingSkills.map((skill, i) => (
            <motion.div 
              key={i} 
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${skill.color} shadow-sm group-hover:shadow-md transition-all`}>
                <i className={`fa-solid ${skill.icon} text-xs`}></i>
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-slate-800">{skill.name}</h4>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{skill.level}</span>
              </div>
              <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 group-hover:text-blue-500"></i>
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:bg-blue-50 rounded-xl transition-colors">
          View All Skills
        </button>
      </div>

      {/* قسم الأهداف الأسبوعية - Weekly Goals */}
      <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-[50px]"></div>
        
        <h3 className="font-black text-sm mb-4 relative z-10">Weekly Goals</h3>
        
        <div className="space-y-3 relative z-10">
          {goals.map((goal, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${goal.done ? 'bg-blue-500 border-blue-500' : 'border-white/20'}`}>
                {goal.done && <i className="fa-solid fa-check text-[10px]"></i>}
              </div>
              <span className={`text-[10px] font-bold ${goal.done ? 'text-white/40 line-through' : 'text-white'}`}>
                {goal.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[9px] font-bold text-white/50 uppercase">Progress</span>
          <span className="text-[9px] font-black text-blue-400">50%</span>
        </div>
      </div>

    </div>
  );
};

export default RightSidebar;