import { Helmet } from 'react-helmet-async';

import { OrgListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function OrgListPage() {
  return (
    <>
      <Helmet>
        <title> Origanizer List </title>
      </Helmet>

      <OrgListView />
    </>
  );
}
