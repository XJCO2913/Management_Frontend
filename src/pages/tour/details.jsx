import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { TourDetailsView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export default function TourDetailsPage() {
  const params = useParams();

  const { tourId } = params;
  

  return (
    <>
      <Helmet>
        <title>Acrivity details</title>
      </Helmet>

      <TourDetailsView id={`${tourId}`} />
    </>
  );
}
