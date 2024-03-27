
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { apiInstance, userEndpoints } from 'src/apis';

import { fData } from 'src/utils/format-number';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------
export default function UserNewEditForm({ currentUser }) {
  const { enqueueSnackbar } = useSnackbar();
  const [userData, setUserData] = useState([]);

  const handleEditUser = async (userId, userData) => {
    try {
      const response = await apiInstance(userEndpoints.editUserById(userId, userData));
      console.log('Edit user response:', response);

      enqueueSnackbar('User updated successfully!', { variant: 'success' });
      setUserData((currentUsers) =>
        currentUsers.map((user) => (user.userId === userId ? { ...user, ...userData } : user))
      );
    } catch (error) {
      console.error('Error editing user:', error);
      enqueueSnackbar('Error editing user', { variant: 'error' });
    }
  };

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().notRequired(),
    password: Yup.string().notRequired(),
    gender: Yup.number().oneOf([0, 1, 2], 'Invalid gender').notRequired(),
    birthday: Yup.date().nullable().max(new Date(), 'Birthday cannot be in the future').notRequired(),
    region: Yup.string().matches(/^[A-Za-z]+-[A-Za-z]+$/, 'Region must be in the format: Province-City').notRequired(),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      password: '', // Password is optional and should not be pre-filled
      gender: currentUser?.gender || 2, // Default to 'prefer-not-to-say' if not provided
      birthday: currentUser?.birthday || null, // Use null for optional date fields
      region: currentUser?.region || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // gender option
  const genderOptions = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
    { label: "Prefer not to say", value: 2 },
  ];

  const onSubmit = handleSubmit(async (data) => {
    try {
      await handleEditUser(currentUser.id, data);
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Username" />
              <RHFTextField name="password" label="Password" type="password" />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RHFAutocomplete
                    {...field}
                    type="number"
                    label="Gender"
                    placeholder="Select gender"
                    options={genderOptions}
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        {option.label}
                      </Box>
                    )}
                  />
                )}
              />

              {/* Birthday */}
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    type="date"
                    label="Birthday"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />

              {/* Region */}
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <RHFTextField {...field} label="Region" placeholder="Province-City" />
                )}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
