import { lazy, Suspense } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const TourListPage = lazy(() => import('src/pages/tour/list'));
// const TourEditPage = lazy(() => import('src/pages/tour/edit'));
const TourDetailsPage = lazy(() => import('src/pages/tour/details'));

// ----------------------------------------------------------------------

const tourListRoute = {
  path: 'list',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <DashboardLayout>
        <TourListPage />
      </DashboardLayout>
    </Suspense>
  ),
};

const tourDetailsRoute = {
  path: ':tourId',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <DashboardLayout>
        <TourDetailsPage />
      </DashboardLayout>
    </Suspense>
  ),
};

export const tourRoutes = [
  {
    path: 'tour',
    children: [tourListRoute, tourDetailsRoute],
  },
];
