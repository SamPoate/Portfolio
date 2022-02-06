import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import PulseLoader from 'react-spinners/PulseLoader';
import { FaPlaneDeparture, FaPlaneArrival, FaPlane } from 'react-icons/fa';
import Input from '@element/input/Input';
import Button from '@element/button/Button';
import Select from '@element/select/Select';
import styles from './FlightTracker.module.scss';

interface FlightTrackerProps {}

type FlightStatusTypes = 'all' | 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted';

interface IArrivalLandingInfo {
    actual?: string;
    actual_runway?: string;
    airport: string;
    baggage?: string;
    delay?: string;
    estimated: string;
    estimated_runway?: string;
    gate: string;
    iata: string;
    icao: string;
    scheduled: string;
    terminal: string;
    timezone: string;
}

interface IFlight {
    aircraft?: string;
    airline: { iata: string; icao: string; name: string };
    arrival: IArrivalLandingInfo;
    departure: IArrivalLandingInfo;
    flight: { codeshared?: string; iata: string; icao: string; number: string };
    flight_date: string;
    flight_status: Exclude<FlightStatusTypes, 'all'>;
    live?: {
        altitude: number;
        direction: number;
        is_ground: boolean;
        latitude: number;
        longitude: number;
        speed_horizontal: number;
        speed_vertical: number;
        updated: string;
    };
}

const instance = axios.create({
    baseURL: 'http://api.aviationstack.com/v1/'
});

const AircraftMarker: React.FC<{ lat: number; lng: number }> = () => (
    <div className={styles.aircraftMarker}>
        <FaPlane size={30} color='#264a73' />
    </div>
);

export const FlightTracker: React.FC<FlightTrackerProps> = ({}) => {
    const [flightIATA, setFlightIATA] = useState<string>('');
    const [flightStatus, setFlightStatus] = useState<FlightStatusTypes>('all');
    const [flights, setFlights] = useState<IFlight[]>([]);
    const [selectedFlight, setSelectedFlight] = useState<IFlight>();
    const [loading, setLoading] = useState<boolean>(false);

    const flightStatusOptions: { value: FlightStatusTypes; name: string }[] = [
        { value: 'all', name: 'All' },
        { value: 'active', name: 'Active' },
        { value: 'cancelled', name: 'Cancelled' },
        { value: 'diverted', name: 'Diverted' },
        { value: 'incident', name: 'Incident' },
        { value: 'landed', name: 'Landed' },
        { value: 'scheduled', name: 'Scheduled' }
    ];

    const submit = async () => {
        setLoading(true);

        try {
            const response = await instance.get<{ data: IFlight[] }>('/flights', {
                params: {
                    access_key: 'f20705f40df6b39e0f4d993f5248e22e',
                    flight_iata: flightIATA ? flightIATA : undefined,
                    flight_status: flightStatus === 'all' ? undefined : flightStatus
                }
            });

            setFlights(response.data.data);
        } catch (error) {}

        setLoading(false);
    };

    return (
        <main className={styles.main}>
            <h1>Flight Tracker</h1>
            <section>
                <div className={styles.search}>
                    <Input
                        label='Flight IATA'
                        placeholder='MU2557'
                        value={flightIATA}
                        onChange={({ target }) => setFlightIATA(target.value)}
                    />
                    <Select
                        label='Flight Status'
                        value={flightStatus}
                        onChange={({ target }) => setFlightStatus(target.value as FlightStatusTypes)}
                        options={flightStatusOptions}
                    />
                    <Button buttonType='secondary' onClick={submit}>
                        Search
                    </Button>
                    <Button buttonType='outline' onClick={() => setFlights([])}>
                        Clear
                    </Button>
                    <div className={styles.results}>
                        {loading ? (
                            <div className={styles.loader}>
                                <PulseLoader
                                    color='#8cb0d9'
                                    css='opacity: 0.75'
                                    loading
                                    size={15}
                                    speedMultiplier={0.6}
                                />
                            </div>
                        ) : (
                            flights.map((flight, index) => (
                                <div key={`${index}_${flight.flight.iata}`} className={styles.row}>
                                    <div className={styles.content}>
                                        <h2>{flight.flight.iata}</h2>
                                        <p>{flight.airline.name}</p>
                                        <div className={styles.airportInfo}>
                                            <div>
                                                <FaPlaneDeparture />
                                                <p>
                                                    {flight.departure.airport} -{' '}
                                                    {moment(flight.departure.estimated).format('HH:mm')}
                                                </p>
                                            </div>
                                            <div>
                                                <FaPlaneArrival />
                                                <p>
                                                    {flight.arrival.airport} -{' '}
                                                    {moment(flight.arrival.estimated).format('HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.actions}>
                                        {flight.live && (
                                            <button type='button' onClick={() => setSelectedFlight(flight)}>
                                                <FaPlane size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className={styles.map}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyAsXIRjs7Ujl1gUQWmxHk_T8-g6Xzb1i5E' }}
                        defaultCenter={{
                            lat: 51.47002,
                            lng: -0.454295
                        }}
                        defaultZoom={11}
                        center={
                            selectedFlight?.live
                                ? { lat: selectedFlight.live.latitude, lng: selectedFlight.live.longitude }
                                : undefined
                        }
                        zoom={selectedFlight?.live ? 1 : undefined}
                    >
                        {selectedFlight?.live && (
                            <AircraftMarker
                                lat={selectedFlight.live.latitude}
                                lng={selectedFlight.live.longitude}
                            />
                        )}
                    </GoogleMapReact>
                </div>
            </section>
        </main>
    );
};

export default FlightTracker;
