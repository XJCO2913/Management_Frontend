import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import TourItem from './tour-item';

// ----------------------------------------------------------------------

export default function TourList({ tours }) {
  // console.log(tours);
  const router = useRouter();

  const handleView = useCallback(
    async (activityId) => {
      router.push(paths.tour.details(activityId));
    },
    [router]
  );
  
  const handleEdit = useCallback(
    async (activityId) => {
      const path = paths.tour.edit(activityId); 
      console.log('Path to navigate:', path); 
      router.push(path);
    },
    [router]
  );
  
  const handleDelete = useCallback(
    async (activityId) => {
      console.info('DELETE', activityId);
    }, 
  []);

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
        {tours.map((tour) => (
          <TourItem
            key={tour.activityId}
            tour={tour}
            onView={() => handleView(tour.activityId)}
            onEdit={() => handleEdit(tour.activityId)}
            onDelete={() => handleDelete(tour.activityId)}
          />
        ))}
      </Box>

      {tours.length > 8 && (
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
