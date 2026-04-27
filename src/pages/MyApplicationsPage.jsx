import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import Footer from '../components/Footer';
import { getMyApplications } from '../Api/applicationService';

const statusConfig = {
  Pending: { bg: 'bg-yellow-500', label: 'State : Pending' },
  Accepted: { bg: 'bg-green-600', label: 'State : Accepted' },
  Rejected: { bg: 'bg-red-600', label: 'State : Rejected' },
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await getMyApplications(1, 20);
        console.log("API Response:", response);
        console.log("Data:", response.data);
        console.log("Items:", response.data?.items);
        const items = response.data?.items;
        setApplications(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        if (err?.statusCode === 404) {
          setApplications([]);
        } else {
          setError(err?.message || "Failed to load applications");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="bg-gray-100 overflow-x-hidden pt-16">
      <Navbar />
      <div className="grid grid-cols-1 gap-5 mx-5 md:grid-cols-3 my-5 lg:grid-cols-12">
        <Sidebar />

        <div className="col-span-6 bg-white border rounded-md m-2 gap-4 p-4 shadow-lg shadow-gray-500 mx-auto w-full">
          <div className="flex flex-col justify-center items-center gap-3">

            {loading && (
              <div className="text-center py-10">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500">Loading applications...</p>
              </div>
            )}

            {error && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 font-semibold text-center">
                ⚠️ {error}
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No applications yet.</p>
              </div>
            )}

            {!loading && console.log("applications before map:", applications, Array.isArray(applications))}

            {!loading && Array.isArray(applications) && applications.map(app => {
              const status = statusConfig[app.status] || statusConfig.Pending;
              return (
                <div key={app.applicationId} className="w-full border border-gray-200 p-4 rounded-xl mx-2 max-w-2xl">
                  {/* Header */}
                  <div className="flex items-start gap-3 md:items-center justify-between w-full text-gray-500">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <img src={app.companyLogoUrl || '/googleLogo.png'} alt="" className="w-14" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-indigo-950">{app.jobTitle}</h3>
                        <span>{app.companyName}</span>
                      </div>
                    </div>
                    <span>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}</span>
                  </div>

                  {/* Info */}
                  <div className="flex justify-around items-center pt-10">
                    <div className="text-gray-600 flex justify-center items-center gap-2">
                      <i className="fa-solid fa-dollar-sign"></i>
                      <p>{app.salary}</p>
                    </div>
                    <div className="text-gray-600 flex justify-center items-center gap-2">
                      <i className="fa-solid fa-clock"></i>
                      <p>{app.type || app.typeJob}</p>
                    </div>
                    <div className="text-gray-600 flex justify-center items-center gap-2">
                      <i className="fa-solid fa-briefcase"></i>
                      <p>{app.experience || app.experienceLevel}</p>
                    </div>
                    <div className="text-gray-600 flex justify-center items-center gap-2">
                      <i className="fa-solid fa-location-dot"></i>
                      <p>{app.jobLocation}</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center items-center w-full gap-3">
                    <button
                      onClick={() => navigate(`/review-application/${app.applicationId}`)}
                      className="bg-indigo-700 rounded-lg text-white text-center text-lg font-bold w-1/2 px-2 py-2 mt-4 hover:bg-indigo-900 duration-200">
                      Review My Application
                    </button>
                    <div className={`${status.bg} rounded-lg text-white text-center text-lg font-bold w-1/2 px-2 py-2 mt-4`}>
                      {status.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <RightPanel />
      </div>
      <Footer />
    </div>
  );
}