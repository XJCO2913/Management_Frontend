import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

export default function TourDetailsToolbar({
  backLink,
  editLink,
  publish,
  sx,
  ...other
}) {
  return (
    <Stack
      spacing={1.5}
      direction="row"
      sx={{
        mb: 3,
        ...sx,
      }}
      {...other}
    >
      <Button
        component={RouterLink}
        to={backLink}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={20} />}
      >
        Back
      </Button>
      <IconButton component={RouterLink} to={`${editLink}/${publish === 'published' ? 'edit' : 'draft'}`}>
        <Iconify icon="solar:pen-bold" />
      </IconButton>
    </Stack>
  );
}

TourDetailsToolbar.propTypes = {
  backLink: PropTypes.string.isRequired,
  editLink: PropTypes.string.isRequired,
  publish: PropTypes.string,
  sx: PropTypes.object,
};
