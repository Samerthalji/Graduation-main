import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

// --- مكون القائمة الجانبية (Sidebar) ---
const Sidebar = ({ user }) => {
  const menuItems = [
    { name: 'Home', icon: 'fa-house', active: true },
    { name: 'Jobs', icon: 'fa-briefcase', active: false },
    { name: 'My Applications', icon: 'fa-file-lines', active: false },
    { name: 'Saved Jobs', icon: 'fa-bookmark', active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center group transition-all hover:shadow-md hover:shadow-blue-100/20">
        <div className="relative mb-4">
          <img className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-50 group-hover:scale-105 transition-transform duration-500" src={user?.profileImageUrl || "/Abood.png"} alt="" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>
        <h3 className="text-lg font-black text-slate-900 leading-tight">{user?.fName} {user?.lName}</h3>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 px-4 py-1.5 bg-blue-50/50 rounded-xl">Full-Stack Developer</p>
        <Link to="/profile" className="w-full mt-6 py-3 border-2 border-slate-50 rounded-2xl text-[10px] font-black text-slate-400 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all uppercase tracking-widest">
          View Profile
        </Link>
      </div>

      {/* Nav Links */}
      <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 space-y-2">
        {menuItems.map((item) => (
          <button key={item.name} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
            <i className={`fa-solid ${item.icon} text-lg ${item.active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}></i>
            <span className="text-sm font-bold">{item.name}</span>
          </button>
        ))}
        <hr className="my-4 border-slate-50" />
        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>

      <button className="w-full py-4 bg-slate-900 text-white rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-950 transition-all flex items-center justify-center gap-2">
        <i className="fa-solid fa-plus-circle text-xs"></i> Create Company
      </button>
    </div>
  );
};

// --- مكون الجانب الأيمن (RightPanel) ---
const RightPanel = () => {
  const suggestions = [
    { name: 'Abdalrahman Baker', role: '.NET Developer', avatar: '/Abood.png' },
    { name: 'Suhaib Al-Khalidy', role: 'Frontend Developer', avatar: '/Abood.png' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Suggestions
        </h3>
        <div className="space-y-6">
          {suggestions.map((person, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <img src={person.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-50 group-hover:ring-blue-100 transition-all" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-800 truncate">{person.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">{person.role}</p>
              </div>
              <button className="bg-blue-50 text-blue-600 w-9 h-9 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                <i className="fa-solid fa-plus text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-7 shadow-lg shadow-blue-200 text-white relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-80">Featured Company</h3>
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <img src="googleLogo.png" className="w-7" alt="" />
            </div>
            <div>
                <h4 className="text-base font-black">Google</h4>
                <p className="text-xs opacity-70">Tech Industry</p>
            </div>
        </div>
        <button className="w-full mt-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all">
            Follow Company
        </button>
      </div>
    </div>
  );
};

// --- الصفحة الرئيسية (HomePage) ---
export default function HomePage() {
  const { user } = useUser();
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Abdalrahman Baker',
      date: '1/4/2026',
      text: 'Software Engineering is not just about coding, it is about solving problems and creating value. 🚀',
      image: '/pexels-benjamin-adjei-abayie-2158492422-36659831.jpg',
      likes: 124,
      comments: 18,
      liked: false,
    }
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPostImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!postText.trim() && !postImagePreview) return;
    const newPost = {
      id: Date.now(),
      user: user?.fName + ' ' + user?.lName || 'User',
      date: 'Today',
      text: postText,
      image: postImagePreview,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts([newPost, ...posts]);
    setPostText('');
    setPostImagePreview(null);
    setShowPostModal(false);
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen pt-24 pb-12 selection:bg-blue-100">
      <Navbar />
      
      <div className="max-w-[1350px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
            <Sidebar user={user} />
          </aside>

          {/* Middle Column */}
          <div className="col-span-12 lg:col-span-6 space-y-8">
            
            {/* Create Post Bar */}
            <div className="bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <img className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50" src={user?.profileImageUrl || '/Abood.png'} alt="" />
              <button 
                onClick={() => setShowPostModal(true)}
                className="flex-1 text-left py-3.5 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 font-bold text-sm transition-all"
              >
                What's on your mind, {user?.fName || 'Abood'}?
              </button>
              <button onClick={() => setShowPostModal(true)} className="w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center">
                <i className="fa-solid fa-plus text-sm"></i>
              </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-8">
              {posts.map(post => (
                <article key={post.id} className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img className="w-14 h-14 rounded-2xl object-cover border-4 border-slate-50" src="/Abood.png" alt="" />
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">{post.user}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-lg">Active Now</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{post.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-[16px] leading-relaxed font-semibold mb-6 px-2">{post.text}</p>
                  
                  {post.image && (
                    <div className="rounded-[2.5rem] overflow-hidden border border-slate-50 mb-6">
                      <img className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" src={post.image} alt="" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 px-2">
                    <div className="flex gap-4">
                      <button className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${post.liked ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
                        <i className="fa-regular fa-heart text-base"></i> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest transition-all">
                        <i className="fa-regular fa-comment text-base"></i> {post.comments}
                      </button>
                    </div>
                    <button className="w-10 h-10 rounded-xl text-slate-300 hover:text-blue-600 transition-colors">
                        <i className="fa-regular fa-bookmark text-xl"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
            <RightPanel />
          </aside>

        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Create Post</h2>
              <button onClick={() => setShowPostModal(false)} className="text-slate-300 hover:text-rose-500 transition-all">
                <i className="fa-solid fa-circle-xmark text-3xl"></i>
              </button>
            </div>
            <form onSubmit={handlePost} className="p-10 space-y-6">
              <textarea
                placeholder="What's happening?"
                value={postText}
                onChange={e => setPostText(e.target.value)}
                className="w-full h-32 text-xl font-bold border-none focus:ring-0 resize-none outline-none placeholder-slate-200 text-slate-800"
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95">
                Broadcast Post
              </button>
            </form>
          </div>
        </div>
      )}

     </div>
  );
}