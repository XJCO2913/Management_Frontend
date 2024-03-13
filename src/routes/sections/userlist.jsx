import { lazy, Suspense } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Use lazy to load the login and registration pages
const UserListPage = lazy(() => import('src/pages/user/list'));
const UserEditPage = lazy(() => import('src/pages/user/edit'));

// ----------------------------------------------------------------------
const userListRoute = {
  path: 'list',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <DashboardLayout >
        <UserListPage />
      </DashboardLayout>
    </Suspense>
  ),
};

const userEditRoute = {
  path: 'edit',
  element: (
    <Suspense fallback={<SplashScreen />}>
       <DashboardLayout >
        <UserEditPage />
        </DashboardLayout>
    </Suspense>
  ),
};

export const userRoutes = [
  {
    path: 'user',
    children: [userListRoute, userEditRoute],
  },
];
