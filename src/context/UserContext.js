import { createContext, useContext, useState, useEffect } from "react"; // 1. أضفنا useEffect و useContext هنا
import { getUserProfile } from "../Api/userService"; // 2. تأكد أن هذا المسار صحيح

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 3. يفضل تبدأ بـ true لتجنب الـ Flicker

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (error) {
        console.error("فشل في جلب بيانات المستخدم:", error);
        logout();
      }
    }
    setLoading(false); // خاوة لازم تتنفذ عشان تظهر الشاشة
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    fetchUser(); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);