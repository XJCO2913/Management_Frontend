
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
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
export default function UserNewEditForm({ userId, currentUser }) {
  const { enqueueSnackbar } = useSnackbar();
  const [userData, setUserData] = useState([]);

  const handleEditUser = async (userId, changes) => {
    try {
      const { url, method } = userEndpoints.editUserById(userId, changes);
      
      // console.log(`URL: ${url}, Method: ${method}`);
      const response = await apiInstance[method](url, changes);
      
      console.log('Edit user response:', response);
      enqueueSnackbar('User updated successfully!', { variant: 'success' });
  
    } catch (error) {
      console.error('Error editing user:', error);
      enqueueSnackbar('Error editing user', { variant: 'error' });
    }
  };
  const formatDate = (date) => {
    if (!(date instanceof Date)) return date; // 如果不是Date实例，直接返回原值
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  const hasChanged = (original, current) => {
    const originalData = original?.Data || {};
    const changes = {};
  
    Object.keys(current).forEach(key => {
      // 处理birthday字段的特殊情况
      let currentValue = current[key];
      if (key === 'birthday' && currentValue) {
        currentValue = formatDate(currentValue);
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
    password: Yup.string(),
    gender: Yup.number().oneOf([0, 1, 2], 'Invalid gender'),
    birthday: Yup.date().nullable().max(new Date(), 'Birthday cannot be in the future').notRequired(),
    region: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      password: '', // Password is optional and should not be pre-filled
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

  useEffect(() => {
    if (currentUser && currentUser.Data) {
      const userData = currentUser.Data;
      const formValues = {
        username: userData.username || '',
        password: '',
        gender: userData.gender || 2,
        birthday: userData.birthday || '',
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
    
    console.log("newUser: ", formData);
    console.log("oldUser: ", currentUser);
    const changes = hasChanged(currentUser, formData);
    
    if (Object.keys(changes).length > 0) {
      await handleEditUser(userId, changes);
    } else {
      enqueueSnackbar('No changes detected', { variant: 'info' });
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
                    onChange={(event, item) => {
                      field.onChange(item ? item.value : '');
                    }}
                    label="Gender"
                    placeholder="Select gender"
                    options={genderOptions}
                    getOptionLabel={(option) => option ? option.label : ''}
                    // 注意这里如何处理 value，确保它匹配当前字段的值
                    value={genderOptions.find(option => option.value === field.value) || ''}
                    // 更新isOptionEqualToValue来比较选项值和当前字段值
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
