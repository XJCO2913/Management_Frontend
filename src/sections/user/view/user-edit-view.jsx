import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

const fetchEditData = async (userId) => {
  try {
    const response = await apiInstance.get(userEndpoints.fetchUserById(userId));
    return response.data; 
  } catch (error) {
    console.error('Error fetching user data:', error);
    enqueueSnackbar('Error fetching user data', { variant: 'error' });
  }
};

export default function UserEditView() {
  const { userId } = useParams();
  const settings = useSettingsContext();
  const [currentUser, setCurrentUser] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchEditData(userId);
      if (data) {
        setCurrentUser(data);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.user.list,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
}