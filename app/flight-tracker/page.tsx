'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import PulseLoader from 'react-spinners/PulseLoader';
import { FaPlaneDeparture, FaPlaneArrival, FaPlane } from 'react-icons/fa';
import Input from '@element/input/Input';
import Button from '@element/button/Button';
import Select from '@element/select/Select';
import styles from './FlightTracker.module.scss';

type FlightStatusTypes = 'all' | 'scheduled' | 'active' | 'landed' | 'cancelled' | 'incident' | 'diverted';

interface IAirline {
    airline_name: string;
    iata_code: string;
    iata_prefix_accounting: string;
    icao_code: string;
    callsign: string;
    type: string;
    status: string;
    fleet_size: string;
    fleet_average_age: string;
    date_founded: string;
    hub_code: string;
    country_name: string;
    country_iso2: string;
}

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
    aircraft?: { registration: string; iata: string; icao: string; icao24: string };
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

interface IAircraft {
    registration_number: string;
    production_line: string;
    iata_type: string;
    model_name: string;
    model_code: string;
    icao_code_hex: string;
    iata_code_short: string;
    construction_number: string;
    test_registration_number?: string;
    rollout_date?: string;
    first_flight_date: string;
    delivery_date: string;
    registration_date: string;
    line_number: string;
    plane_series: string;
    airline_iata_code: string;
    airline_icao_code?: string;
    plane_owner: string;
    engines_count: string;
    engines_type: string;
    plane_age: string;
    plane_status: string;
    plane_class?: string;
}

const useInterval = (callback: Function, delay: number) => {
    const savedCallback = useRef<Function>();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current();
            }
        };

        const id = setInterval(tick, delay);

        return () => clearInterval(id);
    }, [delay]);
};

const instance = axios.create({
    baseURL: 'https://api.aviationstack.com/v1/'
});

const AircraftMarker: React.FC<{ lat: number; lng: number; direction: number }> = ({ direction }) => (
    <div style={{ transform: `rotate(${direction - 90}deg)` }} className={styles.aircraftMarker}>
        <FaPlane size={30} color='#264a73' />
    </div>
);

const FlightTracker: React.FC = () => {
    const [flightIATA, setFlightIATA] = useState<string>('');
    const [flightStatus, setFlightStatus] = useState<FlightStatusTypes>('all');
    const [airline, setAirline] = useState<string>('all');
    const [liveOnly, setLiveOnly] = useState<boolean>(false);
    const [airlines, setAirlines] = useState<IAirline[]>([]);
    const [flights, setFlights] = useState<IFlight[]>([]);
    const [selectedFlight, setSelectedFlight] = useState<IFlight>();
    const [aircrafts, setAircrafts] = useState<Record<string, IAircraft>>();
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

    useInterval(async () => {
        if (selectedFlight) {
            try {
                const response = await instance.get<{ data: IFlight[] }>('/flights', {
                    params: {
                        access_key: 'f20705f40df6b39e0f4d993f5248e22e',
                        flight_date: moment().format('YYYY-MM-DD'),
                        flight_iata: selectedFlight.flight.iata
                    }
                });

                setSelectedFlight(response.data.data[0] || undefined);
            } catch (error) {}
        }
    }, 20000);

    useEffect(() => {
        const getAirlines = async () => {
            try {
                const response = await instance.get<{ data: IAirline[] }>('/airlines', {
                    params: {
                        access_key: 'f20705f40df6b39e0f4d993f5248e22e'
                    }
                });

                setAirlines(
                    [...response.data.data].sort((left, right) =>
                        left.airline_name.localeCompare(right.airline_name)
                    )
                );
            } catch (error) {}
        };

        getAirlines();
    }, []);

    useEffect(() => {
        const getAircrafts = async () => {
            if (selectedFlight) {
                try {
                    const response = await instance.get<{ data: IAircraft[] }>('/airplanes', {
                        params: {
                            access_key: 'f20705f40df6b39e0f4d993f5248e22e',
                            search: selectedFlight?.aircraft?.registration
                        }
                    });

                    setAircrafts(
                        Object.fromEntries(
                            response.data.data.map(airplane => [airplane.registration_number, airplane])
                        )
                    );
                } catch (error) {}
            }
        };

        getAircrafts();
    }, [selectedFlight]);

    const submit = async () => {
        setLoading(true);

        try {
            const response = await instance.get<{ data: IFlight[] }>('/flights', {
                params: {
                    access_key: 'f20705f40df6b39e0f4d993f5248e22e',
                    flight_date: moment().format('YYYY-MM-DD'),
                    flight_iata: flightIATA ? flightIATA.trim() : undefined,
                    flight_status: flightStatus === 'all' ? undefined : flightStatus,
                    airline_iata: airline === 'all' ? undefined : airline
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
                        label={
                            <>
                                Flight IATA <small>(Optional)</small>
                            </>
                        }
                        placeholder='BA502'
                        value={flightIATA}
                        onChange={({ target }) => setFlightIATA(target.value?.toLocaleUpperCase())}
                    />
                    <Select
                        label='Flight Status'
                        value={flightStatus}
                        onChange={({ target }) => setFlightStatus(target.value as FlightStatusTypes)}
                        options={flightStatusOptions}
                    />
                    <Select
                        label='Airline'
                        value={airline}
                        onChange={({ target }) => setAirline(target.value as FlightStatusTypes)}
                        options={[
                            { value: 'all', name: 'All' },
                            ...airlines.map(({ iata_code, airline_name }) => ({
                                value: iata_code,
                                name: airline_name
                            }))
                        ]}
                    />
                    <div className={styles.checkbox}>
                        <input
                            id='live'
                            type='checkbox'
                            checked={liveOnly}
                            onChange={() => setLiveOnly(!liveOnly)}
                        />
                        <label htmlFor='live'>Live flights only</label>
                    </div>
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
                                    cssOverride={{
                                        opacity: 0.75
                                    }}
                                    loading
                                    size={15}
                                    speedMultiplier={0.6}
                                />
                            </div>
                        ) : (
                            flights
                                .filter(flight => (liveOnly ? flight.live : true))
                                .map((flight, index) => (
                                    <div
                                        key={`${index}_${flight.flight.iata}`}
                                        className={[styles.row, flight.live ? styles.active : ''].join(' ')}
                                        onClick={() => setSelectedFlight(flight)}
                                    >
                                        <div className={styles.content}>
                                            <h2>{flight.flight.iata}</h2>
                                            <p>{flight.airline.name}</p>
                                            <div className={styles.airportInfo}>
                                                <div>
                                                    <FaPlaneDeparture />
                                                    <p>
                                                        {flight.departure.airport} ({flight.departure.iata}) -{' '}
                                                        {moment(flight.departure.estimated).format('HH:mm')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <FaPlaneArrival />
                                                    <p>
                                                        {flight.arrival.airport} ({flight.arrival.iata})-{' '}
                                                        {moment(flight.arrival.estimated).format('HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            {flight.live && <FaPlane size={20} />}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
                <div className={styles.flightDetails}>
                    <div className={styles.map}>
                        {/* @ts-ignore */}
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
                            zoom={selectedFlight?.live ? 8 : undefined}
                        >
                            {selectedFlight?.live && (
                                <AircraftMarker
                                    lat={selectedFlight.live.latitude}
                                    lng={selectedFlight.live.longitude}
                                    direction={selectedFlight.live.direction}
                                />
                            )}
                        </GoogleMapReact>
                    </div>
                    {selectedFlight && (
                        <div className={styles.flight}>
                            <div>
                                <h3>
                                    {selectedFlight.flight.iata} - <span>{selectedFlight.flight_status}</span>
                                </h3>
                                <p>
                                    <strong>{selectedFlight.airline.name}</strong>
                                </p>
                                <div className={styles.airportInfo}>
                                    <FaPlaneDeparture />
                                    <p>
                                        {selectedFlight.departure.airport}
                                        {selectedFlight.departure.terminal
                                            ? ` T${selectedFlight.departure.terminal}`
                                            : ''}{' '}
                                        ({selectedFlight.departure.iata}) -{' '}
                                        {moment(selectedFlight.departure.estimated).format('Do MMM HH:mm')}
                                    </p>
                                </div>
                                <div className={styles.airportInfo}>
                                    <FaPlaneArrival />
                                    <p>
                                        {selectedFlight.arrival.airport}
                                        {selectedFlight.arrival.terminal
                                            ? ` T${selectedFlight.arrival.terminal}`
                                            : ''}{' '}
                                        ({selectedFlight.arrival.iata}) -{' '}
                                        {moment(selectedFlight.arrival.estimated).format('Do MMM HH:mm')}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <button type='button' onClick={() => setSelectedFlight(undefined)}>
                                    clear
                                </button>
                                <p>
                                    <strong>Plane Details</strong>
                                </p>
                                {selectedFlight.aircraft && aircrafts?.[selectedFlight.aircraft.registration] ? (
                                    <>
                                        <p>
                                            <strong>Model</strong>
                                            <br />
                                            {aircrafts?.[selectedFlight.aircraft.registration]?.model_code}
                                        </p>
                                        <p>
                                            <strong>Age</strong>
                                            <br />
                                            {aircrafts?.[selectedFlight.aircraft.registration]?.plane_age} years
                                        </p>
                                        {aircrafts?.[selectedFlight.aircraft.registration]?.plane_owner && (
                                            <p>
                                                <strong>Owner</strong>
                                                <br />
                                                {aircrafts?.[selectedFlight.aircraft.registration]?.plane_owner}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p>No details</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default FlightTracker;
