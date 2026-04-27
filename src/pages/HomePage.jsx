import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarArea } from 'recharts';

// Components
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightPanel from '../components/RightPanel';
import { useUser } from '../context/UserContext';

// مكوّن الرادار البصري
const SkillRadar = ({ userSkills, roadmapData }) => {
  const masteredNames = userSkills.map(s => (typeof s === 'string' ? s : (s?.skillName || s?.name || "")).toLowerCase());
  const data = (roadmapData || []).slice(0, 6).map(skill => {
    const name = skill.name || skill.skillName || "Skill";
    const isMastered = masteredNames.includes(name.toLowerCase());
    return { subject: name, score: isMastered ? 100 : 30, fullMark: 100 };
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden mb-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent animate-pulse" />
      <div className="relative z-10 text-left">
        <h3 className="text-white font-black italic uppercase tracking-tighter text-xl">Skill Precision Radar</h3>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Live AI Diagnostics</p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.length > 0 ? data : [{subject: 'No Data', score: 0}]} >
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
              <RadarArea name="Skills" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState('to-learn');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) { setIsLoadingData(false); return; }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://doroob.runasp.net/api/Dashboard/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 200) setUser(prev => ({ ...prev, ...response.data }));
      } catch (e) { console.error(e); } finally { setIsLoadingData(false); }
    };
    fetchDashboardData();
  }, [user?.id, setUser]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    setIsUploading(true);
    try {
      await axios.post(`http://doroob.runasp.net/api/Resume/upload-resume/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      const updated = await axios.post(`http://doroob.runasp.net/api/Dashboard/analyze-profile/${user.id}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (updated.status === 200) setUser(prev => ({ ...prev, ...updated.data }));
    } catch (e) { alert("Error analyzing PDF."); } finally { setIsUploading(false); }
  };

  const handleAnalyzeCurrentSkills = async () => {
    const token = localStorage.getItem('token');
    setIsAnalyzing(true);
    try {
      const response = await axios.post(`http://doroob.runasp.net/api/Dashboard/analyze-profile/${user.id}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) setUser(prev => ({ ...prev, ...response.data }));
    } catch (e) { alert("AI Analysis failed."); } finally { setIsAnalyzing(false); }
  };

  const roadmapData = user?.roadmapData ? JSON.parse(user.roadmapData) : [];
  const masteredSkills = user?.skills || [];
  const masteredNames = masteredSkills.map(s => (typeof s === 'string' ? s : (s?.skillName || s?.name || "")).toLowerCase());
  const toLearn = roadmapData.filter(s => {
    const n = s?.skillName || s?.name || "";
    return n && !masteredNames.includes(n.toLowerCase());
  });

  // --- الحل الجذري: فحص إذا كان المستخدم بحاجة للرفع ---
  const needsUpload = !user?.targetTitle || user?.targetTitle === "Not Set" || user?.targetTitle === "";

  if (isLoadingData) return <div className="h-screen flex items-center justify-center font-black italic text-slate-300">DOROOB SYSTEM...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased pb-20">
      <Navbar />
      <div className="max-w-[1440px] mx-auto pt-28 md:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
          
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit">
            <LeftSidebar user={user} />
          </aside>

          <main className="flex-1 w-full max-w-[750px] mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {needsUpload ? (
                /* واجهة الرفع الرئيسية - ستظهر لأننا أضفنا فحص "NOT SET" */
                <motion.section key="setup" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[4rem] p-16 border border-slate-100 flex flex-col items-center text-center space-y-10 shadow-2xl relative"
                >
                  <div className="absolute top-0 inset-x-0 h-2 bg-indigo-600 rounded-t-full"></div>
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner font-bold italic">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  
                  <div className="max-w-md">
                    <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-4">Start AI Analysis</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Please upload your CV to let our AI build your career roadmap.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                    <input id="cv-upload-input" type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    <label 
                      htmlFor="cv-upload-input" 
                      className={`flex-1 p-8 rounded-3xl font-black text-[11px] uppercase tracking-widest cursor-pointer transition-all shadow-2xl flex flex-col items-center gap-3 border-2 ${isUploading ? 'bg-slate-100 border-slate-200 cursor-not-allowed' : 'bg-slate-900 text-white border-transparent hover:bg-slate-800 hover:scale-105'}`}
                    >
                      {isUploading ? <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <i className="fa-solid fa-file-pdf text-2xl text-rose-500"></i>}
                      {isUploading ? 'Analyzing...' : 'Upload CV (PDF)'}
                    </label>

                    <button 
                      onClick={handleAnalyzeCurrentSkills} 
                      disabled={isUploading || isAnalyzing}
                      className="flex-1 bg-indigo-600 text-white p-8 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-2xl flex flex-col items-center gap-3"
                    >
                      {isAnalyzing ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fa-solid fa-wand-magic-sparkles text-2xl text-amber-400"></i>}
                      {isAnalyzing ? 'Scanning...' : 'Use Profile'}
                    </button>
                  </div>
                </motion.section>
              ) : (
                /* لوحة التحكم (Dashboard) - تظهر فقط بعد نجاح التحليل */
                <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <SkillRadar userSkills={masteredSkills} roadmapData={roadmapData} />
                  
                  <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-left">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-brain"></i></div>
                      <div>
                         <h3 className="font-black text-slate-900 text-lg italic tracking-tighter uppercase">Target: {user.targetTitle}</h3>
                         <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Next Move Strategy</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                      <p className="text-[13px] text-slate-600 font-bold italic leading-relaxed">"{user.aiRecommendation}"</p>
                    </div>
                  </section>

                  {/* Skill Hub */}
                  <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-black text-slate-900 text-xs uppercase italic tracking-tighter">Skill Hub</h3>
                      <div className="flex bg-white p-1 rounded-xl shadow-inner gap-1">
                        {['to-learn', 'mastered'].map(tab => (
                          <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                          >
                            {tab === 'to-learn' ? `Roadmap` : `My Stack`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 h-[400px] overflow-y-auto bg-white text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(activeTab === 'to-learn' ? toLearn : masteredSkills).map((skill, i) => {
                          const name = typeof skill === 'string' ? skill : (skill?.skillName || skill?.name || "Skill");
                          return (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs ${activeTab === 'to-learn' ? 'bg-white text-indigo-600 border border-indigo-100' : 'bg-emerald-500 text-white'}`}>
                                  <i className={`fa-solid ${activeTab === 'to-learn' ? 'fa-rocket' : 'fa-check'}`}></i>
                                </div>
                                <span className="font-black text-slate-900 text-[13px] uppercase italic">{name}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-32 h-fit">
            <RightPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}