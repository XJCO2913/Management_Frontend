import { lazy, Suspense } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Use lazy to load the login and registration pages
const UserListPage = lazy(() => import('src/pages/user/list'));
const UserEditPage = lazy(() => import('src/pages/user/edit'));
const OrgListPage = lazy(() => import('src/pages/user/organizer'));
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
  path: ':userId/edit',
  element: (
    <Suspense fallback={<SplashScreen />}>
       <DashboardLayout >
        <UserEditPage />
        </DashboardLayout>
    </Suspense>
  ),
};

const orgListRoute = {
  path: ':organizer',
  element: (
    <Suspense fallback={<SplashScreen />}>
       <DashboardLayout >
        <OrgListPage />
        </DashboardLayout>
    </Suspense>
  ),
};

export const userRoutes = [
  {
    path: 'user',
    children: [userListRoute, userEditRoute, orgListRoute],
  },
];