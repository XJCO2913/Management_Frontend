import { Helmet } from 'react-helmet-async';
import { OverviewAppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> OverviewPage</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}