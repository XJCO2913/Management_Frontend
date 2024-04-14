import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import React, { useEffect, useState } from 'react';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { apiInstance, userEndpoints } from 'src/apis';

// ----------------------------------------------------------------------

export default function TourDetailsContent({ tour }) {
  const {
    name,
    coverUrl,
    description,
    originalFee,
    finalFee,
    numberLimit,
    startDate,
    endDate,
    creatorID,
    createdAt,
    tags
  } = tour;

  const slides = [{
    src: coverUrl,
  }];

  const ACTIVITY_TAGS = [
    { tagID: '10001', tagName: 'refresher' },
    { tagID: '10002', tagName: 'supplement' },
    { tagID: '10003', tagName: 'sports-outfit' },
    { tagID: '10004', tagName: 'medical-support' },
  ];

  const getUserName = async (userId) => {
    try {
      const response = await apiInstance.get(userEndpoints.fetchUserById(userId));
      return response.data.Data;
    } catch (error) {
      console.error('Failed to fetch user by ID:', error);
      throw error;
    }
  };
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userData = await getUserName(creatorID);
        setCreatorName(userData.username);
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };

    getUserInfo();
  }, [creatorID]);

  // 将标签字符串分割成数组
  const tagIds = tags.split('|');

  // 根据标签 ID 获取标签名
  const renderTags = tagIds.map(tagId => {
    const tag = ACTIVITY_TAGS.find(tag => tag.tagID === tagId);
    return tag ? tag.tagName : ''; // 如果找不到对应的标签名，则返回空字符串
  });
  const renderGallery = (
    <Box
      gap={1}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
      justifyContent="center" 
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      <m.div
        key={coverUrl}
        whileHover="hover"
        variants={{
          hover: { opacity: 0.8 },
        }}
        transition={varTranHover()}
      >
        <Image
          alt="Tour cover"
          src={coverUrl}
          ratio="1/1"
          onClick={() => handleOpenLightbox(coverUrl)}
          sx={{ borderRadius: 2, cursor: 'pointer' }}
        />
      </m.div>
    </Box>
  );
  
  const renderHead = (
    <Stack direction="row" sx={{ mb: 3 }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        {name}
      </Typography>

      <IconButton>
        <Iconify icon="solar:share-bold" />
      </IconButton>

      <Checkbox
        defaultChecked
        color="error"
        icon={<Iconify icon="solar:heart-outline" />}
        checkedIcon={<Iconify icon="solar:heart-bold" />}
      />
    </Stack>
  );

  const renderOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      <Stack spacing={1.5} direction="row">
        <Iconify icon="solar:calendar-date-bold" />
        <ListItemText
          primary="Activity Dates"
          secondary={`${fDate(startDate)} - ${fDate(endDate)}`}
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
      </Stack>

      <Stack spacing={1.5} direction="row">
        <Iconify icon="solar:user-rounded-bold" />
        <ListItemText
          primary="Creator Name"
          secondary={creatorName || 'Loading...'}
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
      </Stack>

      <Stack spacing={1.5} direction="row">
        <Iconify icon="solar:clock-circle-bold" />
        <ListItemText
          primary="Creation Date"
          secondary={createdAt}
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
      </Stack>

      <Stack spacing={1.5} direction="row">
        <Iconify icon="mdi:tag-multiple" />
        <ListItemText
          primary="Tags"
          secondary={renderTags.join(', ')} // 将标签名数组连接为字符串
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
      </Stack>

    </Box>
  );

  const renderAdditionalInfo = (
    <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
        <Iconify icon="mdi:account-group-outline" sx={{ color: 'warning.main' }} />
        <Box component="span" sx={{ typography: 'subtitle2' }}>
          {numberLimit}
        </Box>
        <Link sx={{ color: 'text.secondary' }}>(Number Limit)</Link>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
        <Iconify icon="mdi:cash-multiple" sx={{ color: 'info.main' }} />
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
          Original Fee: {originalFee}
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
        <Iconify icon="bx:bx-dollar-circle" sx={{ color: 'info.main' }} />
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
          Final Fee: {finalFee}
        </Box>
      </Stack>

    </Stack>
  );

  const renderContent = (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>Description</Typography>
      <Markdown children={description} />
    </>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        {renderAdditionalInfo}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderContent}
      </Stack>
    </>
  );
}

TourDetailsContent.propTypes = {
  tour: PropTypes.object,
};
