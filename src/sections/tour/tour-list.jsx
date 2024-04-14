import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'src/components/snackbar';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import TourItem from './tour-item';
import { apiInstance, endpoints } from 'src/apis';

// ----------------------------------------------------------------------

export default function TourList({ tours }) {
  const [data, setData] = useState(tours);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    setData(tours);
  }, [tours]);

  const handleView = useCallback(
    (activityId) => {
      router.push(paths.tour.details(activityId));
    },
    [router]
  );
  
  const handleDelete = useCallback(
    async (activityId) => {
      try {
        const response = await deleteById(activityId);
        // console.log('Delete response:', response);
  
        enqueueSnackbar('Delete success!', { variant: 'success' });
  
        updateDataAfterDeletion([activityId]);
  
      } catch (error) {
        console.error('Error deleting user:', error);
        enqueueSnackbar('Error deleting user', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const deleteById = async (activityId) => {
    try {
      const response = await apiInstance.delete(endpoints.activity.deleteById(activityId));
      return response.data;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  };
  
  function updateDataAfterDeletion(deletedIds) {
    setData(prevData =>
      prevData.filter(tour => !deletedIds.includes(tour.activityId))
    );
  }  

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {data.map((tour) => (
          <TourItem
            key={tour.activityId}
            tour={tour}
            onView={() => handleView(tour.activityId)}
            onDelete={() => handleDelete(tour.activityId)}
          />
        ))}
      </Box>

      {data.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

TourList.propTypes = {
  tours: PropTypes.array,
};
