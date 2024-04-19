
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { apiInstance, userEndpoints } from 'src/apis';

import { paths } from 'src/routes/paths';
import { fData } from 'src/utils/format-number';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------
export default function UserNewEditForm({ userId, currentUser }) {
  const { enqueueSnackbar } = useSnackbar();
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  
  const handleEditUser = async (userId, changes) => {
    try {
      const { url, method } = userEndpoints.editUserById(userId, changes);
      const response = await apiInstance[method](url, changes);
      console.log('Edit user response:', response);
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
      
    } catch (error) {
      console.error('Error editing user:', error);
      if (error.response.data.status_msg)
        enqueueSnackbar(error.response.data.status_msg, { variant: 'warning' });
      else
        enqueueSnackbar('Error editing user', { variant: 'error' });
    }
  };

  const handleUploadAvatar = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userId);

      try {
        const response = await apiInstance.post(userEndpoints.uploadAvatar, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          enqueueSnackbar('Profile picture uploaded successfully', { variant: 'success' });
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        enqueueSnackbar('Failed to upload profile picture', { variant: 'error' });
      }
    }
  };
      
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return date;
    
    return format(date, 'dd MMM yy HH:mm XX');
  };
  
  const hasChanged = (original, current) => {
    const originalData = original?.Data || {};
    const changes = {};
  
    Object.keys(current).forEach(key => {
      let currentValue = current[key];
      // Handling birthday field specifically
      if (key === 'birthday' && currentValue) {
        currentValue = formatDate(currentValue);
      } else if (key === 'birthday' && !currentValue) {
        // If currentValue is an empty string or null, set it to an empty string
        currentValue = '';
      }
  
      if (currentValue !== undefined && originalData[key] !== currentValue) {
        changes[key] = currentValue;
      }
    });
  
    console.log("Changes detected: ", changes);
    return changes;
  };
  
  const NewUserSchema = Yup.object().shape({
    username: Yup.string(),
    gender: Yup.number().oneOf([0, 1, 2], 'Invalid gender'),
    // Modify birthday validation
    birthday: Yup.date().nullable(true).transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }).max(new Date(), 'Birthday cannot be in the future').notRequired(),
    region: Yup.string(),
  });
  

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      gender: currentUser?.gender || 2, // Default to 'prefer-not-to-say' if not provided
      birthday: currentUser?.birthday || '', // Use null for optional date fields
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

  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.Data) {
      const userData = currentUser.Data;
      const formValues = {
        username: userData.username || '',
        gender: userData.gender || 2,
        birthday: userData.birthday ? format(new Date(userData.birthday), 'yyyy-MM-dd') : '',
        region: userData.region || '',
      };
      reset(formValues);
    }
  }, [currentUser, reset]);
  
  const values = watch();

  // gender option
  const genderOptions = [
    { label: "Male", value: 0 },
    { label: "Female", value: 1 },
    { label: "Prefer not to say", value: 2 },
  ];

  const onSubmit = handleSubmit(async (formData) => {
    const file = formData.avatarUrl;
    const avatarUrl = await handleUploadAvatar(file);
    delete formData.avatarUrl;
    const changes = hasChanged(currentUser, formData);
    const response = await apiInstance.get(userEndpoints.checkUserStatusById(userId));
    const statusChanged = isBanned !== response.data.Data.isBanned;
    const infoChanged = Object.keys(changes).length > 0;

    if (!infoChanged && !statusChanged && !file) {
      enqueueSnackbar('No changes to user information', { variant: 'warning' });
      return;
    }

    if (infoChanged)
      await handleEditUser(userId, changes);
    
    if (statusChanged) {
      if (isBanned) {
          await apiInstance.post(userEndpoints.banUserById(userId));
          enqueueSnackbar('User banned successfully', { variant: 'success' });
      } else {
          await apiInstance.post(userEndpoints.unbanUserById(userId));
          enqueueSnackbar('User unbanned successfully', { variant: 'success' });
      }
    }

    navigate(paths.user.list);  
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

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await apiInstance.get(userEndpoints.checkUserStatusById(userId));
        // console.log('isban?:', response.Data.isBanned);
        setIsBanned(response.data.Data.isBanned);
      } catch (error) {
        console.error('Error fetching user status:', error);
        enqueueSnackbar('Error fetching user status', { variant: 'error' });
      }
    };

    checkUserStatus();
  }, [userId, enqueueSnackbar]);

  const today = new Date().toISOString().split('T')[0];

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
                control={
                  <Switch
                    checked={isBanned ?? false} 
                    onChange={(e) => setIsBanned(e.target.checked)}
                  />
                }
                
                label={isBanned ? "Unban User" : "Ban User"}
                labelPlacement="start"
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

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RHFAutocomplete
                    {...field}
                    onChange={(event, item) => {
                      field.onChange(item ? item.value : '');
                    }}
                    label="Gender"
                    placeholder="Select gender"
                    options={genderOptions}
                    getOptionLabel={(option) => option ? option.label : ''}
                    value={genderOptions.find(option => option.value === field.value) || ''}
                    isOptionEqualToValue={(option, value) => option.value === value}
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
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      max: today,
                    }}
                    onChange={(e) => field.onChange(e.target.value || null)}
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
