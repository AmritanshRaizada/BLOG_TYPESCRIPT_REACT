import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import Auth from './Auth';

const DashboardPage = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <Auth />;
};

export default DashboardPage;
