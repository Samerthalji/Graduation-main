import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightPanel from '../components/RightPanel';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { useJobs } from '../context/JobContext';
import { useUser } from '../context/UserContext';

export default function JobsPage() {
  const { user } = useUser();
  const { jobs, loading, error, fetchJobs, fetchJobsBySkill, savedJobIds, toggleSaveJob } = useJobs();
  
  const [search, setSearch] = useState('');
  const [jobTypes, setJobTypes] = useState([]); // [FullTime, PartTime, Remote]
  const [experience, setExperience] = useState(''); // fresh, junior, mid, senior
  const [currentPage, setCurrentPage] = useState(1);
  const [isSkillSearch, setIsSkillSearch] = useState(false);
  const jobsPerPage = 4;

  // --- Handlers ---
  const handleSearch = async () => {
    setCurrentPage(1);
    if (search.trim()) {
      setIsSkillSearch(true);
      await fetchJobsBySkill(search.trim(), 1, 50);
    } else {
      setIsSkillSearch(false);
      await fetchJobs();
    }
  };

  const handleClearSearch = async () => {
    setSearch('');
    setIsSkillSearch(false);
    setCurrentPage(1);
    setJobTypes([]);
    setExperience('');
    await fetchJobs();
  };

  const toggleJobType = (type) => {
    // شلنا الفراغ عشان يطابق داتا الـ API (مثلاً Full Time تصير FullTime)
    const formattedType = type.replace(/\s+/g, ''); 
    setJobTypes(prev =>
      prev.includes(formattedType) ? prev.filter(t => t !== formattedType) : [...prev, formattedType]
    );
    setCurrentPage(1);
  };

  // --- 🔥 الفلترة الذكية (Filtering Logic) ---
  const filteredJobs = jobs.filter(job => {
    // 1. فلترة نوع العمل (FullTime / PartTime / Remote)
    const matchType = jobTypes.length === 0 || jobTypes.some(t => {
      const jobTypeData = (job.type || job.jobType || "").replace(/\s+/g, '').toLowerCase();
      return jobTypeData.includes(t.toLowerCase());
    });

    // 2. فلترة مستوى الخبرة (Junior / Mid / Senior)
    const matchExp = !experience || (job.experience || "").toLowerCase().includes(experience.toLowerCase());

    return matchType && matchExp;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="bg-[#F3F7FA] min-h-screen font-sans antialiased selection:bg-blue-100">
      <Navbar />

      <div className="max-w-[1400px] mx-auto pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <aside className="hidden lg:block w-[300px] shrink-0 sticky top-24 h-fit">
            <LeftSidebar user={user} />
          </aside>

          <main className="flex-1 min-w-0 space-y-6 pb-20">
            
            <div className="flex items-center justify-between px-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#1E293B]">Explore Jobs 🚀</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Find your next career move</p>
              </div>
              <div className="hidden sm:block bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 font-black text-[11px] text-blue-600 uppercase">
                {filteredJobs.length} Positions Found
              </div>
            </div>

            {/* Filter Panel */}
            <section className="bg-white rounded-[2rem] p-4 md:p-8 shadow-sm border border-slate-100 transition-all">
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search skills (React, .NET, UI/UX)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-32 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 outline-none shadow-inner"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button onClick={handleSearch} className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">Search</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                {/* Job Type Filter */}
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4">Employment Type</span>
                  <div className="flex flex-wrap gap-2">
                    {['Full Time', 'Part Time', 'Remote'].map(type => {
                      const formatted = type.replace(/\s+/g, '');
                      const isActive = jobTypes.includes(formatted);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleJobType(type)}
                          className={`px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                            isActive 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-105' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4">Experience Level</span>
                  <select 
                    value={experience}
                    onChange={(e) => { setExperience(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                  >
                    <option value="">All Experience Levels</option>
                    <option value="fresh">Fresh / Entry Level</option>
                    <option value="junior">Junior Level</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>

              {isSkillSearch && (
                <div className="mt-4 flex justify-end">
                  <button onClick={handleClearSearch} className="text-[10px] font-black text-red-400 uppercase hover:text-red-600 transition-colors">
                    Reset All Filters ×
                  </button>
                </div>
              )}
            </section>

            {/* Job List */}
            <div className="grid gap-6">
              {loading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 font-bold text-sm">Searching for matches...</p>
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {paginatedJobs.length > 0 ? (
                    paginatedJobs.map(job => (
                      <motion.div key={job.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <JobCard job={job} savedJobs={savedJobIds} onSave={() => toggleSaveJob(job)} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                      No jobs found matching these filters.
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                      currentPage === i + 1 
                      ? 'bg-[#0F172A] text-white shadow-lg' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>

          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-24 h-fit space-y-6">
            <RightPanel />
            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
               <h4 className="font-black text-xl mb-2 italic">Hiring?</h4>
               <p className="text-blue-100 text-xs mb-6 font-medium leading-relaxed">Connect with the best talent in the region now.</p>
               <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs hover:bg-[#0F172A] hover:text-white transition-all transform active:scale-95 shadow-lg">Post a Job +</button>
            </div>
           </aside>

        </div>
      </div>
    </div>
  );
}