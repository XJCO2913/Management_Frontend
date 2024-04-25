import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Admins } from '../../sections/login/admin-login-view';

import { useRouter } from 'src/routes/hooks';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const router = useRouter();
  const admins = Admins
  const [adminId, setAdminId] = useState(null)

  useEffect(()=>{
    setAdminId(sessionStorage.getItem('adminID'))
  },[])

  if (!adminId) {
    router.replace('/')
    return
  }

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={admins[adminId-1].avatarUrl} alt={admins[adminId-1].name} sx={{ width: 48, height: 48 }}>
            {admins[adminId-1].name.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {admins[adminId-1].name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {admins[adminId-1].description}
          </Typography>
        </Stack>

        <Button variant="contained" href="http://43.136.232.116/login" target="_blank" rel="noopener">
          Go to PathPals
        </Button>
      </Stack>
    </Stack>
  );
}
