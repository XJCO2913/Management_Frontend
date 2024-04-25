import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'src/components/snackbar';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import TourItem from './tour-item';
import { apiInstance, endpoints } from 'src/apis';

// ----------------------------------------------------------------------
const TOURS_PER_PAGE = 6;

export default function TourList({ tours }) {
  const [page, setPage] = useState(1);
  const [pagedData, setPagedData] = useState([]);
  const [data, setData] = useState(tours);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const pageCount = Math.ceil(tours.length / TOURS_PER_PAGE);

  useEffect(() => {
    setData(tours);
    setPage(1);
    setPagedData(tours.slice(0, TOURS_PER_PAGE));
  }, [tours]);

  const handleChangePage = (event, value) => {
    setPage(value);
    const start = (value - 1) * TOURS_PER_PAGE;
    const end = start + TOURS_PER_PAGE;
    setPagedData(data.slice(start, end));
  };

  // ... other functions like handleView, handleDelete, deleteById, updateDataAfterDeletion

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
        {pagedData.map((tour) => (
          <TourItem
            key={tour.activityId}
            tour={tour}
            onView={() => handleView(tour.activityId)}
            onDelete={() => handleDelete(tour.activityId)}
          />
        ))}
      </Box>

      {data.length > TOURS_PER_PAGE && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          sx={{
            mt: 8,
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      )}
    </>
  );
}

TourList.propTypes = {
  tours: PropTypes.array,
};
