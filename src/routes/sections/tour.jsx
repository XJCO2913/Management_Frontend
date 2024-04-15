import { lazy, Suspense } from 'react';
import DashboardLayout from 'src/layouts/dashboard';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// 使用 lazy 加载旅游相关页面
const TourListPage = lazy(() => import('src/pages/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/tour/new'));
// const TourDetailsPage = lazy(() => import('src/pages/tour/details'));
// const TourEditPage = lazy(() => import('src/pages/tour/edit'));

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

const tourCreateRoute = {
  path: 'new',
  element: (
    <Suspense fallback={<SplashScreen />}>
      <DashboardLayout>
        <TourCreatePage />
      </DashboardLayout>
    </Suspense>
  ),
};

// const tourDetailsRoute = {
//   path: ':tourId',
//   element: (
//     <Suspense fallback={<SplashScreen />}>
//       <DashboardLayout>
//         <TourDetailsPage />
//       </DashboardLayout>
//     </Suspense>
//   ),
// };

// const tourEditRoute = {
//   path: ':tourId/edit',
//   element: (
//     <Suspense fallback={<SplashScreen />}>
//       <DashboardLayout>
//         <TourEditPage />
//       </DashboardLayout>
//     </Suspense>
//   ),
// };

export const tourRoutes = [
  {
    path: 'tour',
    children: [tourListRoute, tourCreateRoute],
  },
];
