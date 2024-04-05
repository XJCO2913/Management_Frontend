import { useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
// import UserListPage from 'src/pages/dashboard/user/list'; 
import { userRoutes } from './userlist';
import { DashboardPage } from './dashboard'
import Login from '../../pages/login';

// import { authRoutes } from './auth';
// import { HeroPage } from './hero-page';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/dashboard',
      element: (
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      ),
    },
    ...userRoutes,
  ]);
}
