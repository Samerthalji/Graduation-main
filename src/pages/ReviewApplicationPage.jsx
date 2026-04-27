import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteApplication, getApplicationDetails } from '../Api/applicationService';

const statusConfig = {
  Pending: { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Under Review', pulse: true },
  Accepted: { dot: 'bg-green-500', text: 'text-green-500', label: 'Accepted', pulse: false },
  Rejected: { dot: 'bg-red-500', text: 'text-red-500', label: 'Rejected', pulse: false },
};

export default function ReviewApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawn, setWithdrawn] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleWithdraw = async () => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteApplication(id);
      setWithdrawn(true);
    } catch (err) {
      console.error("Error deleting application:", err);
      setDeleteError(err?.message || "Failed to withdraw application.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getApplicationDetails(id);
        setApp(response.data);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError(err?.message || "Failed to load application details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <p className="text-red-600 font-bold text-lg mb-2">Failed to load</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button onClick={() => navigate('/applications')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[app.status] || statusConfig.Pending;

  return (
    <div className="bg-gray-50 antialiased font-sans">
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans" dir="ltr">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/applications')}
            className="flex items-center text-blue-800 font-bold hover:text-indigo-700 transition-all">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Applications
          </button>
        </div>

        {withdrawn && (
          <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl px-6 py-4 font-semibold">
            ⚠️ Your application has been withdrawn.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Info */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    <img src={app.logo || '/googleLogo.png'} alt={app.company || app.companyName} className="w-16 h-16 rounded-md object-contain" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 leading-tight">{app.title || app.jobTitle}</h1>
                    <p className="text-indigo-600 font-bold text-lg">{app.company || app.companyName}</p>
                  </div>
                </div>
                <span className="bg-indigo-50 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">{app.jobType || app.typeJob}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-sack-dollar text-blue-800"></i>
                  <div>
                    <p className="text-xs text-gray-400">Salary</p>
                    <p className="text-sm font-bold text-blue-800">${app.salary || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-location-dot text-blue-800"></i>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-bold text-blue-800">{app.location || 'Unknown'} ({app.type || app.typeJob || 'N/A'})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-briefcase text-blue-800"></i>
                  <div>
                    <p className="text-xs text-gray-400">Experience</p>
                    <p className="text-sm font-bold text-blue-800">{app.experience || app.experienceLevel || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-calendar text-blue-800"></i>
                  <div>
                    <p className="text-xs text-gray-400">Posted</p>
                    <p className="text-sm font-bold text-blue-800">{app.date || (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Job Description</h3>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>{app.description || 'No description provided.'}</p>
                {(app.responsibilities && app.responsibilities.length > 0) && (
                  <>
                    <h4 className="font-bold text-blue-800 pt-2">Key Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {app.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <aside className="sticky top-24 h-fit space-y-6">

            {/* Application Status */}
            <div className="bg-blue-800 text-white p-6 rounded-2xl shadow-xl border border-indigo-800 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-800 rounded-full opacity-20"></div>
              <h3 className="text-md font-black mb-6 text-white uppercase tracking-[0.2em] relative z-10">Application Details</h3>
              <div className="space-y-5 relative z-10">
                <div className="flex flex-col space-y-1">
                  <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Submission Date</span>
                  <div className="flex items-center text-sm font-bold">
                    <span>{app.submittedDate || (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A')}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 pt-4 border-t border-indigo-900">
                  <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Current Status</span>
                  <div className="flex items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${status.dot} mr-3 ${status.pulse ? 'animate-pulse' : ''}`}></div>
                    <span className={`text-sm font-black ${status.text} uppercase tracking-wide`}>{status.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download CV */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-3">
                <button className="w-full py-3 bg-indigo-50 text-blue-800 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-all">
                  Download Submitted CV
                </button>
              </div>
            </div>

            {/* Withdraw */}
            {!withdrawn && app.status === 'Pending' && (
              <div className="p-6 my-10 bg-red-50 border border-red-100 rounded-2xl">
                <h4 className="text-red-800 font-black text-sm mb-2">Need to cancel?</h4>
                <p className="text-red-600 text-xs mb-4 leading-relaxed">
                  Slightly reconsidering? You can withdraw your application before it enters the interview stage.
                </p>
                {deleteError && (
                  <p className="text-red-700 text-xs mb-2 font-bold">⚠️ {deleteError}</p>
                )}
                <button
                  onClick={handleWithdraw}
                  disabled={deleting}
                  className={`w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {deleting ? 'Withdrawing...' : 'Withdraw Application'}
                </button>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
}
