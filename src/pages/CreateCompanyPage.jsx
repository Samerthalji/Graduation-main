import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [errors, setErrors] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Company name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setSubmitted(true);
  };

  const handleImageUpload = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Register Your Company</h1>
            <p className="text-gray-500 italic">Doroop - Professional Networking Platform</p>
          </div>
          <img src="/5.png" alt="Logo" className="h-14" />
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
            <i className="fa-solid fa-check-circle text-green-500 text-6xl mb-4"></i>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Company Created Successfully!</h2>
            <p className="text-green-600 mb-6">Your company profile is now live on Doroop.</p>
            <button onClick={() => navigate('/home')} className="bg-blue-800 text-white font-bold py-3 px-10 rounded-2xl hover:bg-blue-700 transition">
              Go to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left: General Info */}
            <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-800 pl-3">General Info</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" placeholder="e.g. Doroop Software"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                <input type="email" placeholder="hr@doroop.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows="6" placeholder="Describe your company mission..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all" />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Right: Images + Submit */}
            <div className="space-y-6">

              {/* Cover Image */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 border-l-4 border-blue-800 pl-3 mb-4 text-lg">Cover Image</h2>
                <div className="relative group h-44 w-full bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden hover:border-blue-800 transition-all cursor-pointer">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-cloud-upload-alt text-blue-400 text-3xl mb-2"></i>
                      <p className="text-xs text-blue-800 font-semibold uppercase tracking-wider">Upload Cover</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => handleImageUpload(e, setCoverPreview)} />
                </div>
              </div>

              {/* Logo */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 border-l-4 border-blue-800 pl-3 mb-4 text-lg">Profile Logo</h2>
                <div className="flex items-center space-x-6">
                  <div className="h-28 w-28 bg-blue-50 rounded-full border-2 border-dashed border-blue-200 flex items-center justify-center relative group overflow-hidden shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                    ) : (
                      <i className="fas fa-camera text-blue-300 text-2xl group-hover:text-blue-800 transition-colors"></i>
                    )}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => handleImageUpload(e, setLogoPreview)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700">Company Logo</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">Recommended size: 512x512px.<br />Supports PNG, JPG or WEBP.</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button type="submit"
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2">
                  <i className="fas fa-check-circle"></i> Create Company
                </button>
                <button type="button" onClick={() => navigate('/home')}
                  className="px-8 py-4 border border-gray-300 rounded-2xl text-gray-600 font-medium hover:bg-gray-100 transition-all">
                  Cancel
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
