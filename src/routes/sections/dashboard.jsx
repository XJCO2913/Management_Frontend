import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// import { AuthGuard } from 'src/auth/guard';

import DashboardLayout from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';

// USER
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      // 确保 AuthGuard 已被定义或移除下面的 <AuthGuard>
      // <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      // </AuthGuard>
    ),
    children: [
      {
        path: 'user',
        children: [
          { path: 'list', element: <UserListPage /> },
        ],
      },
    ],
  },
];
