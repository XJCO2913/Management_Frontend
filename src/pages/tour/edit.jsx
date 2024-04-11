import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { TourEditView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export default function TourEditPage() {
  const params = useParams();

  const { tourId } = params;

  return (
    <>
      <Helmet>
        <title> Tour Edit</title>
      </Helmet>

      <TourEditView id={`${tourId}`} />
    </>
  );
}
