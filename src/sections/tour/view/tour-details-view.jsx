import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { apiInstance, endpoints } from 'src/apis';
import TourDetailsToolbar from '../tour-details-toolbar';
import TourDetailsContent from '../tour-details-content';
import TourDetailsBookers from '../tour-details-bookers';

export default function TourDetailsView({ id }) {
  const [currentTour, setCurrentTour] = useState(null);
  const [currentTab, setCurrentTab] = useState('content');

  useEffect(() => {
    const loadTourDetails = async () => {
      try {
        const response = await apiInstance.get(endpoints.activity.getById(id));
        setCurrentTour(response.data.Data);
      } catch (error) {
        console.error('Error loading tour details:', error);
      }
    };

    loadTourDetails();
  }, [id]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      {currentTour && (
        <>
          <TourDetailsToolbar
            backLink={paths.tour.root}
            editLink={`${paths.tour.edit}/${id}`}
            publish={currentTour.finalFee ? 'published' : 'draft'}
          />
          <Tabs value={currentTab} onChange={handleChangeTab}>
            <Tab label="Content" value="content" />
            <Tab label="Bookers" value="bookers" />
          </Tabs>
          {currentTab === 'content' && <TourDetailsContent tour={currentTour} />}
          {currentTab === 'bookers' && <TourDetailsBookers bookers={currentTour.bookers || []} />}
        </>
      )}
      {!currentTour && <p>Loading...</p>}
    </Container>
  );
}

TourDetailsView.propTypes = {
  id: PropTypes.string.isRequired,
};
