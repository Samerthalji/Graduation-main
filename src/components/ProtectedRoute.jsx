import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProfileSkeleton from './ProfileSkeleton';

const ProtectedRoute = ({loadingComponent}) => {
  const { user, loading } = useUser();  
   if (loading) return loadingComponent || null;

  // إذا لم يكن هناك مستخدم، وجهه لصفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان المستخدم موجوداً، اسمح له بالدخول للمسارات الفرعية
  return <Outlet />;
};

export default ProtectedRoute;