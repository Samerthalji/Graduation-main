import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { updateUserProfile } from '../Api/userService';
import { useUser } from '../context/UserContext';
import ProfileSkeleton from '../components/ProfileSkeleton';

// --- مكون الـ Modal الأنيق ---
const EditModal = ({ title, isOpen, onClose, onSave, children }) => (
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
          <div className="px-10 py-8 border-t border-gray-50 flex justify-end gap-4 bg-slate-50/30">
            <button onClick={onClose} className="text-sm font-bold text-slate-400">Cancel</button>
            <button onClick={onSave} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">Save Changes</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ProfilePage() {
  const { user, fetchUser, loading: contextLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); 
  const [editData, setEditData] = useState({ fName: '', lName: '', headline: '', about: '' });
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // البوستات (رجعت زي ما كانت)
  const [posts] = useState([
    { id: 1, user: 'عبد الرحمن بكر', date: '30 MAR 2026', text: 'سعيد جداً بمشاركتكم تطورات مشروعي الأخير! تم بناء هذه الواجهة باستخدام #TailwindCSS.', image: null, likes: 124, comments: 18, avatar: '/Abood.png' },
    { id: 2, user: 'عبد الرحمن بكر', date: '28 MAR 2026', text: 'تجربة بناء API باستخدام .NET Core كانت مذهلة. 🚀', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop', likes: 89, comments: 7, avatar: '/Abood.png' }
  ]);

  useEffect(() => {
    if (user) {
      setEditData({ fName: user.fName || '', lName: user.lName || '', headline: user.headline || '', about: user.about || '' });
      setSkills(user.skills || []);
    }
  }, [user]);

  // تحديث البيانات (بما فيها المهارات)
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(editData).forEach(key => formData.append(key, editData[key]));
      
      // نرسل المهارات كـ JSON أو حسب ما يتوقع الـ API (عدلها لو الـ Backend بطلب فورمات مختلف)
      // formData.append('skills', JSON.stringify(skills)); 

      await updateUserProfile(formData);
      await fetchUser();
      setActiveModal(null);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('File', file);
    try {
      setLoading(true);
      await updateUserProfile(formData);
      await fetchUser();
    } catch (err) { console.error(err); }
    finally { setLoading(false); setShowImageOptions(false); }
  }, [fetchUser]);

  // إدارة المهارات
  const addSkill = () => {
    if (newSkill.trim() && !skills.find(s => s.skillName === newSkill)) {
      setSkills([...skills, { skillName: newSkill }]);
      setNewSkill("");
    }
  };

  const removeSkill = (name) => {
    setSkills(skills.filter(s => s.skillName !== name));
  };

  if (contextLoading) return <ProfileSkeleton />;

  return (
    <div className="bg-[#F9FAFC] min-h-screen pt-24 pb-12">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[4rem] shadow-xl shadow-indigo-100/20 border border-white overflow-hidden mb-12 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[60] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="h-44 bg-slate-900 relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          <div className="px-10 pb-12 relative flex flex-col items-center -mt-20">
            <div className="relative mb-6">
              <img src={user?.profileImageUrl || '/Abood.png'} className="w-40 h-40 rounded-[3.5rem] border-8 border-white shadow-2xl object-cover cursor-pointer" onClick={() => setIsModalOpen(true)} />
              <button onClick={() => setShowImageOptions(!showImageOptions)} className="absolute bottom-2 right-2 bg-indigo-600 text-white w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white hover:scale-110 transition-all"><i className="fa-solid fa-camera"></i></button>
              
              <AnimatePresence>
                {showImageOptions && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white rounded-2xl shadow-2xl z-50 py-2 border border-gray-50">
                    <button onClick={() => {setIsModalOpen(true); setShowImageOptions(false);}} className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-indigo-50 flex items-center gap-3"><i className="fa-regular fa-eye text-indigo-500"></i> View Photo</button>
                    <button onClick={() => fileInputRef.current.click()} className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-indigo-50 flex items-center gap-3 border-t border-gray-50"><i className="fa-solid fa-cloud-arrow-up text-indigo-500"></i> Upload New</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center group cursor-pointer" onClick={() => setActiveModal('info')}>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {user?.fName} {user?.lName}
                <i className="fa-solid fa-pen text-xs text-slate-200 group-hover:text-indigo-600 transition-colors"></i>
              </h1>
              <p className="text-indigo-600 font-bold text-xl mt-1 tracking-tight">{user?.headline || "Software Engineer"}</p>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 w-full text-center group cursor-pointer" onClick={() => setActiveModal('about')}>
              <p className="text-slate-600 leading-relaxed max-w-xl mx-auto italic font-medium relative px-6 group-hover:text-slate-900 transition-colors">
                "{user?.about || "Add a bio about yourself..."}"
                <i className="fa-solid fa-pen text-[10px] text-slate-200 absolute -right-2 top-0 group-hover:text-indigo-600 transition-all"></i>
              </p>
            </div>

            {/* Skills Section - Editable */}
            <div className="flex flex-wrap justify-center gap-2 mt-10 relative group">
              <AnimatePresence>
                {skills.map((s, i) => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    key={s.skillName} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-500 flex items-center gap-2 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                  >
                    {s.skillName}
                    <button onClick={() => removeSkill(s.skillName)} className="hover:text-rose-500"><i className="fa-solid fa-xmark"></i></button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <button onClick={() => setActiveModal('skills')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">+ Add Skills</button>
            </div>
          </div>
        </div>

        {/* Posts Feed - رجعناها كاملة */}
        <div className="space-y-12 mb-20">
          <h2 className="text-2xl font-black text-slate-900 px-4 flex items-center gap-4">
            <span className="w-12 h-1.5 bg-indigo-600 rounded-full"></span>
            My Activity
          </h2>
          {posts.map(post => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={post.id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-5 mb-8">
                  <img src={post.avatar} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-indigo-50" alt="" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{post.user}</h4>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{post.date}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{post.text}</p>
                {post.image && <img src={post.image} className="w-full rounded-[2.5rem] mb-8 shadow-inner border border-slate-50" alt="" />}
                <div className="flex gap-8 pt-6 border-t border-slate-50">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors"><i className="fa-regular fa-heart text-xl"></i> <span className="text-sm font-bold">{post.likes}</span></button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors"><i className="fa-regular fa-comment text-xl"></i> <span className="text-sm font-bold">{post.comments}</span></button>
                </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- Modals --- */}
      
      {/* Modal الاسم والمعلومات */}
      <EditModal title="Identity" isOpen={activeModal === 'info'} onClose={() => setActiveModal(null)} onSave={handleUpdateProfile}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" type="text" value={editData.fName} onChange={e => setEditData({...editData, fName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" />
            <input placeholder="Last Name" type="text" value={editData.lName} onChange={e => setEditData({...editData, lName: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" />
          </div>
          <input placeholder="Headline" type="text" value={editData.headline} onChange={e => setEditData({...editData, headline: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold text-indigo-600" />
        </div>
      </EditModal>

      {/* Modal المهارات */}
      <EditModal title="Manage Skills" isOpen={activeModal === 'skills'} onClose={() => setActiveModal(null)} onSave={handleUpdateProfile}>
        <div className="space-y-6">
          <div className="flex gap-3">
            <input placeholder="Ex: .NET Core, React..." type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold" />
            <button onClick={addSkill} className="px-6 bg-indigo-600 text-white rounded-2xl font-bold">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s.skillName} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2">
                {s.skillName}
                <button onClick={() => removeSkill(s.skillName)} className="text-rose-400 hover:text-rose-600"><i className="fa-solid fa-circle-xmark"></i></button>
              </span>
            ))}
          </div>
        </div>
      </EditModal>

      {/* Modal الـ About */}
      <EditModal title="About" isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} onSave={handleUpdateProfile}>
        <textarea rows="5" value={editData.about} onChange={e => setEditData({...editData, about: e.target.value})} className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-none outline-none font-medium text-slate-600 leading-relaxed" />
      </EditModal>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      {/* Photo View Modal - التعديل هون */}
{isModalOpen && (
  <div 
    className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-in fade-in cursor-zoom-out" 
    onClick={() => setIsModalOpen(false)}
  >
    <motion.img 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      // إضافة الـ Date.now() هون بضمن إن الصورة دايمًا فريش وما بياخد النسخة القديمة من الكاش
      src={`${user?.profileImageUrl || '/Abood.png'}?t=${Date.now()}`} 
      className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl object-contain border-4 border-white/10" 
      alt="Full Profile" 
    />
    
    {/* زر إغلاق إضافي للراحة */}
    <button className="absolute top-10 right-10 text-white text-4xl hover:text-indigo-400 transition-colors">
      <i className="fa-solid fa-xmark"></i>
    </button>
  </div>
)}
    </div>
  );
}