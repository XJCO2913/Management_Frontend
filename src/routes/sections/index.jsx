import { Navigate, useRoutes } from 'react-router-dom';
import MainLayout from 'src/layouts/main'; 
// import UserListPage from 'src/pages/dashboard/user/list'; 
import { dashboardRoutes } from './dashboard';

// import { authRoutes } from './auth';
// import { HeroPage } from './hero-page';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '', element: <Navigate to="/dashboard/user/list" replace /> },
        // Dashboard路由作为子路由集成
        ...dashboardRoutes,
      ],
    },
    
    // ...authRoutes,

    // 无匹配路由时跳转到 404 页面
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
