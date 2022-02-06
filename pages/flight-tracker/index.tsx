import type { NextPage } from 'next';
import Default from '@layout/Default';
import FlightTracker from '@template/flight-tracker/FlightTracker';

const URLInspectorPage: NextPage = () => (
    <Default>
        <FlightTracker />
    </Default>
);

export default URLInspectorPage;
