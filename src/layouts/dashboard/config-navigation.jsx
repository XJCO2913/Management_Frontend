import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------
export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // OVERVIEW
          {
            title: t('overview'),
            path: paths.overview,
            icon: <Iconify icon="mdi:chart-line" />,
          },
          // USER
          {
            title: t('user'),
            path: paths.user.list,
            icon: <Iconify icon="lucide:user-search" />, 
            children: [
              { title: t('list'), path: paths.user.list },
              { title: t('organizer'), path: paths.user.organizer },
              // { title: t('edit'), path: paths.user.edit },
            ],
          },

          // TOUR
          {
            title: t('activity'),
            path: paths.tour.root,
            icon: <Iconify icon="ic:outline-event-available" />, 
            children: [
              { title: t('list'), path: paths.tour.root },
            ],
          },

          // MONITOR
          {
            title: t('monitor'),
            path: 'http://43.136.232.116:3001/d/rYdddlPWk/node-exporter?orgId=1&refresh=1m&from=now-15m&to=now',
            icon: <Iconify icon='solar:monitor-camera-bold' />,
          }
        ],
      },

    ],
    [t]
  );

  return data;
}
