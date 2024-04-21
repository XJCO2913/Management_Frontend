import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appFeatured } from 'src/_mock';
import { Admins } from 'src/sections/login/admin-login-view';

import { useRouter } from 'src/routes/hooks';
import { useEffect, useState } from 'react';

import { useSettingsContext } from 'src/components/settings';

import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';

import { apiInstance, endpoints } from 'src/apis';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const theme = useTheme();
  const settings = useSettingsContext();

  const router = useRouter();
  const admins = Admins;
  const [adminId, setAdminId] = useState(null);

  useEffect(()=>{
    setAdminId(sessionStorage.getItem('adminID'))
  },[])

  const [currentDownloadData, setCurrentDownloadData] = useState({
    series: [],
    colors: []
  });

  const [profitData, setProfitData] = useState({
    dates: [],
    profits: [],
    option: 'year'
  });

  const [counts, setCounts] = useState({
    activityCount: 0,
    membershipCount: 0,
    participantCount: 0,
  });  

  const ACTIVITY_TAGS = [
    { tagID: '10001', tagName: 'refresher' },
    { tagID: '10002', tagName: 'supplement' },
    { tagID: '10003', tagName: 'sports-outfit' },
    { tagID: '10004', tagName: 'medical-support' },
  ];

  const tagIdToNameMap = ACTIVITY_TAGS.reduce((acc, tag) => {
    acc[tag.tagID] = tag.tagName;
    return acc;
  }, {});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiInstance.get(endpoints.overview.tag);
        const tagsData = response.data.Data.eachCount;

        const formattedSeries = Object.entries(tagsData).map(([label, value]) => ({
          label: tagIdToNameMap[label] || label,
          value
        }));
        setCurrentDownloadData(prevData => ({
          ...prevData,
          series: formattedSeries
        }));
      } catch (error) {
        console.error('Error fetching tag data:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await apiInstance.get(endpoints.overview.count);
        const { activityCount, membershipCount, participantCount } = response.data.Data;
        setCounts({ activityCount, membershipCount, participantCount });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
  
    fetchCounts();
  }, []);

  const fetchProfitData = async (option) => {
    try {
      const response = await apiInstance.get(endpoints.overview.profit(option));
      const { dates, profits } = response.data.Data;
      setProfitData({ dates, profits, option });
    } catch (error) {
      console.error('Error fetching profit data:', error);
    }
  };
  
  useEffect(() => {
    fetchProfitData(profitData.option);
  }, [profitData.option]);

  if (!adminId) {
    router.replace('/')
    return
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${admins[adminId-1].name}`}
            description="If you need to experience user functions, you should use the client interface."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" href="http://43.136.232.116/login" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Activities"
            total={counts.activityCount}
            percent={0.1}
            chart={{
              series: [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Memberships"
            total={counts.membershipCount}
            percent={0.1}
            chart={{
              series: [],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Participants"
            total={counts.participantCount}
            percent={0.1}
            chart={{
              series: [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Number of activity tags"
            chart={currentDownloadData}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Profit Over Time"
            subheader={`Selected period: ${profitData.option}`}
            chart={{
              categories: profitData.dates,
              series: [
                {
                  name: 'Profit',
                  data: profitData.profits,
                },
              ],
            }}
            profitData={profitData}
            fetchProfitData={fetchProfitData}
          />
        </Grid>

      </Grid>
    </Container>
  );
}
