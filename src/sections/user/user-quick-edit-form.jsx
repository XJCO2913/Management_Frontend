import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';
import { apiInstance, userEndpoints } from 'src/apis';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserQuickEditForm({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const EditUserSchema = Yup.object().shape({
    username: Yup.string(),
    password: Yup.string(),
    gender: Yup.mixed().oneOf([0, 1, 2]),
    birthday: Yup.date(),
    region: Yup.string(),
  });

  const defaultValues = useMemo(() => ({
    username: currentUser?.username || '',
    password: '',
    gender: currentUser?.gender,
    birthday: currentUser?.birthday || '',
    region: currentUser?.region || '',
  }), [currentUser]);

  const methods = useForm({
    resolver: yupResolver(EditUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await apiInstance(userEndpoints.editUserById(currentUser.id, data));
      reset(); // Reset the form
      onClose(); // Close the form dialog
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error updating user', { variant: 'error' });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
            sx={{
              '& .MuiTextField-root': { m: 1 },
              '& .MuiFormControl-root': { m: 1 },
            }}
          >
            <RHFTextField
              name="username"
              label="Username"
              fullWidth
              variant="outlined"
            />
            <RHFTextField
              name="password"
              label="Password"
              fullWidth
              type="password"
              variant="outlined"
              autoComplete="new-password"
              helperText={{
                message: "Leave blank if you do not wish to change the password",
                error: false // Assuming this is how your custom RHFTextField expects it
              }}
            />
            <RHFSelect name="gender" label="Gender" fullWidth>
              <MenuItem value={0}>Male</MenuItem>
              <MenuItem value={1}>Female</MenuItem>
              <MenuItem value={2}>Prefer not to say</MenuItem>
            </RHFSelect>
            <RHFTextField
              name="birthday"
              label="Birthday"
              fullWidth
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
            <RHFTextField
              name="region"
              label="Region"
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};