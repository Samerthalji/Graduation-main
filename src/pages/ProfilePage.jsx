import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getUserProfile, updateUserProfile, updateUserInfo } from '../Api/userService';
import { deleteSkill, addSkill as addSkillAPI } from '../Api/skillService';
import ProfileSkeleton from '../components/ProfileSkeleton';

// مكون المودال الفخم (Glassmorphism)
const EditModal = ({ title, isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-2xl font-black text-slate-900">{title}</h3>
            <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-circle-xmark text-2xl"></i></button>
          </div>
          <div className="p-10 max-h-[60vh] overflow-y-auto">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  
  // الحالة الخاصة بتعديل البيانات (Headline, About, Names)
  const [editData, setEditData] = useState({ fName: '', lName: '', headline: '', about: '' });
  
  const fileInputRef = useRef(null);

  // 1. جلب البيانات عند البداية
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setSkills(data.skills || []);
        // تعبئة بيانات التعديل فور وصولها
        setEditData({
          fName: data.fName || '',
          lName: data.lName || '',
          headline: data.headline || '',
          about: data.about || ''
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 2. تحديث المعلومات الأساسية (Headline / About / Name)
  const handleUpdateInfo = async () => {
    try {
      setLoading(true);
      await updateUserInfo(editData); // منادات الـ API
      setUser(prev => ({ ...prev, ...editData })); // تحديث الواجهة فوراً
      setActiveModal(null);
    } catch (err) {
      console.error("Failed to update info:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. إضافة مهارة
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      setLoading(true);
      const response = await addSkillAPI({ addSkillRequest: newSkill.trim() });
      const addedSkill = response.data || response;
      setSkills(prev => [...prev, {
        skillId: addedSkill.id || addedSkill.skillId, 
        skillName: addedSkill.name || addedSkill.skillName || newSkill.trim()
      }]);
      setNewSkill("");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // 4. حذف مهارة
  const handleRemoveSkill = async (id) => {
    try {
      setLoading(true);
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.skillId !== id));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // 5. رفع الصورة
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('File', file);
    try {
      setLoading(true);
      await updateUserProfile(formData);
      const updatedData = await getUserProfile();
      setUser(updatedData);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  if (loading && !user) return <ProfileSkeleton />;

  return (
    <div className="bg-[#F9FAFC] min-h-screen pt-24 pb-12 font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4">
        
        <div className="bg-white rounded-[4rem] shadow-xl border border-white overflow-hidden mb-12 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[60] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="h-44 bg-slate-900 relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          <div className="px-10 pb-12 relative flex flex-col items-center -mt-20">
            {/* الصورة الشخصية */}
            <div className="relative mb-6">
              <img 
                src={`${user?.profileImageUrl || '/Abood.png'}?t=${Date.now()}`} 
                className="w-40 h-40 rounded-[3.5rem] border-8 border-white shadow-2xl object-cover cursor-pointer hover:scale-105 transition-transform" 
                onClick={() => fileInputRef.current.click()} 
              />
              <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 bg-indigo-600 text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white hover:scale-110 transition-all">
                <i className="fa-solid fa-camera"></i>
              </button>
            </div>

            {/* الهيد لاين والاسم (قابل للنقر للتعديل) */}
            <div className="text-center group cursor-pointer" onClick={() => setActiveModal('identity')}>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center justify-center gap-3">
                {user?.fName} {user?.lName}
                <i className="fa-solid fa-pen text-[10px] text-slate-200 group-hover:text-indigo-600"></i>
              </h1>
              <p className="text-indigo-600 font-bold text-xl mt-1">{user?.headline || "Software Engineer"}</p>
            </div>

            {/* الأباوت (قابل للنقر للتعديل) */}
            <div className="mt-10 pt-8 border-t border-slate-50 w-full text-center group cursor-pointer" onClick={() => setActiveModal('about')}>
              <p className="text-slate-600 leading-relaxed italic px-6 font-medium">
                "{user?.about || "Add a bio..."}"
                <i className="fa-solid fa-pen text-[10px] text-slate-200 ml-2 group-hover:text-indigo-600"></i>
              </p>
            </div>

            {/* المهارات */}
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              <AnimatePresence>
                {skills.map((s) => (
                  <motion.span key={s.skillId} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-500 flex items-center gap-2"
                  >
                    {s.skillName}
                    <button onClick={() => handleRemoveSkill(s.skillId)} className="hover:text-rose-500"><i className="fa-solid fa-xmark"></i></button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <button onClick={() => setActiveModal('skills')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg hover:bg-indigo-700">+ Add Skills</button>
            </div>
          </div>
        </div>
      </main>

      {/* مودال تعديل الاسم والهيدلاين */}
      <EditModal title="Edit Identity" isOpen={activeModal === 'identity'} onClose={() => setActiveModal(null)}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" type="text" value={editData.fName} onChange={e => setEditData({...editData, fName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" />
            <input placeholder="Last Name" type="text" value={editData.lName} onChange={e => setEditData({...editData, lName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" />
          </div>
          <input placeholder="Headline (Ex: Full Stack Developer)" type="text" value={editData.headline} onChange={e => setEditData({...editData, headline: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold text-indigo-600" />
          <button onClick={handleUpdateInfo} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm shadow-lg">Save Changes</button>
        </div>
      </EditModal>

      {/* مودال تعديل الأباوت */}
      <EditModal title="Edit About" isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)}>
        <textarea rows="5" value={editData.about} onChange={e => setEditData({...editData, about: e.target.value})} className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-none outline-none font-medium text-slate-600 leading-relaxed" placeholder="Tell us about yourself..." />
        <button onClick={handleUpdateInfo} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm shadow-lg mt-4">Save Bio</button>
      </EditModal>

      {/* مودال المهارات */}
      <EditModal title="Skills" isOpen={activeModal === 'skills'} onClose={() => setActiveModal(null)}>
        <div className="space-y-6">
          <div className="flex gap-3">
            <input placeholder="Ex: React, .NET..." type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddSkill()} className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" />
            <button onClick={handleAddSkill} className="px-6 bg-indigo-600 text-white rounded-2xl font-black">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s.skillId} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2">
                {s.skillName} <button onClick={() => handleRemoveSkill(s.skillId)}><i className="fa-solid fa-xmark"></i></button>
              </span>
            ))}
          </div>
        </div>
      </EditModal>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
    </div>
  );
}