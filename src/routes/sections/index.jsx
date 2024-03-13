import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
// import UserListPage from 'src/pages/dashboard/user/list'; 
import { userRoutes } from './userlist';
import { DashboardPage } from './dashboard'

// import { authRoutes } from './auth';
// import { HeroPage } from './hero-page';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      ),
    },

    ...userRoutes,

    // 无匹配路由时跳转到 404 页面
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
