import { useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
// import UserListPage from 'src/pages/dashboard/user/list'; 
import { userRoutes } from './userlist';
import { tourRoutes } from './tour';
import { DashboardPage } from './dashboard'
import Login from '../../pages/login';

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
    ...tourRoutes,
  ]);
}
