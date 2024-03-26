import { Helmet } from 'react-helmet-async';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Edit User </title>
      </Helmet>

      <UserEditView />
    </>
  );
}
