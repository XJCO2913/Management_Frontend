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
        ],
      },

    ],
    [t]
  );

  return data;
}
