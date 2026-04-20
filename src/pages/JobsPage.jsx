import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import { useJobs } from '../context/JobContext';

export default function JobsPage() {
  const { jobs, loading, error, fetchJobs, fetchJobsBySkill, savedJobIds, toggleSaveJob } = useJobs();
  const [search, setSearch] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [experience, setExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSkillSearch, setIsSkillSearch] = useState(false);
  const jobsPerPage = 4;

  const toggleJobType = (type) => {
    setJobTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // البحث بالمهارة عن طريق الـ API
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

  // إعادة تحميل كل الوظائف
  const handleClearSearch = async () => {
    setSearch('');
    setIsSkillSearch(false);
    setCurrentPage(1);
    await fetchJobs();
  };

  // تحويل بيانات الـ API — هسا بيجي mapped من الـ Context
  const mappedJobs = jobs;

  const filtered = mappedJobs.filter(job => {
    const matchType = jobTypes.length === 0 || jobTypes.some(t =>
      job.type.toLowerCase().includes(t.toLowerCase()) ||
      job.jobType.toLowerCase().includes(t.toLowerCase())
    );
    const matchExp = !experience || job.experience.toLowerCase() === experience.toLowerCase();
    return matchType && matchExp;
  });

  const totalPages = Math.ceil(filtered.length / jobsPerPage);
  const paginated = filtered.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handleSave = (id) => {
    const job = jobs.find(j => j.id === id);
    if (job) toggleSaveJob(job);
  };

  return (
    <div className="bg-gray-100 overflow-x-hidden pt-16">
      <Navbar />
      <div className="grid grid-cols-1 gap-5 mx-5 md:grid-cols-3 my-5 lg:grid-cols-12">
        <Sidebar />

        {/* Middle Column */}
        <div className="col-span-6 bg-white border rounded-md m-2 gap-4 p-4 shadow-lg shadow-gray-500 mx-auto w-full">
          <div className="flex flex-col justify-center items-center gap-3">

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100 w-full" dir="ltr">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px] relative">
                  <input
                    type="text"
                    placeholder="Search by skill (e.g. React, .NET)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                    className="w-full pr-4 pl-10 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-800 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
                >
                  Search
                </button>
                {isSkillSearch && (
                  <button
                    onClick={handleClearSearch}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              <hr className="mb-6 border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-600 font-semibold mb-3 text-sm uppercase tracking-wider">Job Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['Full Time', 'Part Time', 'Remote'].map(type => (
                      <label key={type} className="cursor-pointer" onClick={() => { toggleJobType(type); setCurrentPage(1); }}>
                        <span className={`px-4 py-2 rounded-full border text-sm transition-all inline-block ${jobTypes.includes(type) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200'}`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-3 text-sm uppercase tracking-wider">Required Experience</label>
                  <select
                    value={experience}
                    onChange={e => { setExperience(e.target.value); setCurrentPage(1); }}
                    className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Experience Level...</option>
                    <option value="fresh">Fresh Graduate (0-1 Years)</option>
                    <option value="junior">Junior (1-3 Years)</option>
                    <option value="mid">Mid-Level (3-5 Years)</option>
                    <option value="senior">Senior (5+ Years)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-10">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500">Loading jobs...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-red-600 text-center py-10 bg-red-50 rounded-xl px-4 w-full">
                <p className="font-semibold">Failed to load jobs</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Job Cards */}
            {!loading && !error && (
              <>
                {isSkillSearch && (
                  <div className="w-full mb-2 text-sm text-gray-500">
                    Showing results for skill: <span className="font-bold text-indigo-600">"{search}"</span> ({filtered.length} jobs found)
                  </div>
                )}
                {paginated.length === 0 ? (
                  <div className="text-gray-500 text-center py-10">No jobs found matching your criteria.</div>
                ) : (
                  paginated.map(job => (
                    <JobCard key={job.id} job={job} savedJobs={savedJobIds} onSave={handleSave} />
                  ))
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between border border-gray-400 bg-white px-2 py-4 sm:px-6 rounded-xl shadow-sm mt-8 w-full" dir="ltr">
                <div className="hidden sm:flex sm:flex-1 px-5 sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{(currentPage - 1) * jobsPerPage + 1}</span> to{' '}
                    <span className="font-semibold">{Math.min(currentPage * jobsPerPage, filtered.length)}</span> of{' '}
                    <span className="font-semibold">{filtered.length}</span> results
                  </p>
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    className="relative inline-flex items-center rounded-lg px-3 py-2 text-gray-400 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-900 border border-gray-200 hover:bg-gray-50'}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className="relative inline-flex items-center rounded-lg px-3 py-2 text-gray-400 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        <RightPanel />
      </div>
      <Footer />
    </div>
  );
}
