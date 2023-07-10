import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import PuffLoader from 'react-spinners/PuffLoader';
import logo from '@image/logo-dark.svg';
import imdb from '@image/imdb-logo.svg';
import disney from '@image/disney-logo.svg';
import netflix from '@image/netflix-logo.svg';
import prime from '@image/prime-logo.svg';
import apple from '@image/apple-logo.svg';
import now from '@image/now-logo.svg';
import rottenTomatoes from '@image/rotten-tomatoes-logo.svg';
import metacritic from '@image/metacritic-logo.svg';
import styles from './MovieDetails.module.scss';

interface MovieDetailsProps {
    movieId: string;
    setActiveMovieId: Dispatch<SetStateAction<string | undefined>>;
}

interface IMovie {
    age: number;
    backdropPath: string;
    backdropURLs: Record<string, string>;
    cast: string[];
    countries: string[];
    genres: number[];
    imdbID: string;
    imdbRating: number;
    imdbVoteCount: number;
    originalLanguage: string;
    originalTitle: string;
    overview: string;
    posterPath: string;
    posterURLs: Record<string, string>;
    runtime: number;
    significants: string[];
    streamingInfo: Record<string, Record<'gb', { added: number; leaving: number; link: string }>>;
    tagline: string;
    title: string;
    tmdbID: string;
    tmdbRating: number;
    video: string;
    year: number;
}

interface IMovieDetails {
    Actors: string;
    Awards: string;
    BoxOffice: string;
    Country: string;
    DVD: string;
    Director: string;
    Genre: string;
    Language: string;
    Metascore: string;
    Plot: string;
    Poster: string;
    Production: string;
    Rated: string;
    Ratings: { Source: string; Value: string }[];
    Released: string;
    Response: string;
    Runtime: string;
    Title: string;
    Type: string;
    Website: string;
    Writer: string;
    Year: string;
    imdbID: string;
    imdbRating: string;
    imdbVotes: string;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, setActiveMovieId }) => {
    const [movie, setMovie] = useState<IMovie>();
    const [details, setDetails] = useState<IMovieDetails>();
    const [deltaY, setDeltaY] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            setActiveMovieId(undefined);
            setDeltaY(0);
        },
        onSwiping: event => setDeltaY(event.deltaY),
        touchEventOptions: { passive: true }
    });

    useEffect(() => {
        const getMovieDetails = async () => {
            if (movie) return;

            try {
                const response = await axios.get<IMovie>(
                    'https://streaming-availability.p.rapidapi.com/get/basic',
                    {
                        params: { country: 'gb', imdb_id: movieId, output_language: 'en' },
                        headers: {
                            'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
                            'x-rapidapi-key': '6954dbed00mshe2e59a5bd0eeb22p143d3cjsn41afdeab0bac'
                        }
                    }
                );

                setMovie(response.data);
            } catch (error) {
                setError(true);
            }

            try {
                const response = await axios.get<IMovieDetails>('https://www.omdbapi.com/', {
                    params: {
                        apiKey: 'ef721bfe',
                        i: movieId
                    }
                });

                setDetails(response.data);
            } catch (error) {
                setError(true);
            }
        };

        getMovieDetails();
    }, [movieId, movie]);

    if (error) {
        return (
            <div className={styles.movieDetails} onClick={() => setActiveMovieId(undefined)}>
                <p>
                    Oh no! We can&apos;t get the get the details right now.
                    <br /> Please try again later.
                    <br />
                    <small>We&apos;ve probably run out of free API calls for today</small>
                </p>
            </div>
        );
    }

    if (!movie || !details) {
        return (
            <div className={styles.movieDetails} onClick={() => setActiveMovieId(undefined)}>
                <PuffLoader color='#fff' loading size={150} />
            </div>
        );
    }

    return (
        <div className={styles.movieDetails} onClick={() => setActiveMovieId(undefined)}>
            <div {...swipeHandlers} onClick={event => event.stopPropagation()}>
                <div className={styles.image}>
                    <Image
                        src={details.Poster || logo}
                        alt={movie.title || 'Movie Image'}
                        width={400}
                        height={600}
                        style={{
                            objectFit: details.Poster ? 'cover' : 'contain',
                            objectPosition: details.Poster ? 'center top' : 'center 20%'
                        }}
                    />
                </div>
                <div style={{ marginBottom: -deltaY }} className={styles.content}>
                    <h3>
                        {movie.title} <small>({movie.year})</small>
                    </h3>
                    <p>{details.Plot}</p>
                    <p>
                        <strong>Director&nbsp;&nbsp;</strong>
                        {details.Director}
                    </p>
                    <p>
                        <strong>Writers&nbsp;&nbsp;</strong>
                        {details.Writer}
                    </p>
                    <p>
                        <strong>Stars&nbsp;&nbsp;</strong>
                        {movie.cast.slice(0, 4).join(', ')}
                    </p>
                    <div className={styles.ratings}>
                        {details.Ratings.map(({ Source, Value }) => {
                            let logo;

                            switch (Source) {
                                case 'Internet Movie Database':
                                    logo = imdb;
                                    break;

                                case 'Rotten Tomatoes':
                                    logo = rottenTomatoes;
                                    break;

                                case 'Metacritic':
                                    logo = metacritic;
                                    break;
                            }

                            return (
                                <div key={Source}>
                                    {logo && (
                                        <Image
                                            src={logo}
                                            alt={Source}
                                            width={40}
                                            height={20}
                                            // objectFit='contain'
                                        />
                                    )}
                                    <p>- {Value}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.whereWatch}>
                        <p>
                            Where can I watch it? <small>(click to visit)</small>
                        </p>
                        <div>
                            {Object.keys(movie.streamingInfo).length > 0 ? (
                                Object.keys(movie.streamingInfo).map(platform => {
                                    if (['disney', 'netflix', 'prime', 'apple', 'now'].includes(platform)) {
                                        let logo;

                                        switch (platform) {
                                            case 'disney':
                                                logo = disney;
                                                break;

                                            case 'netflix':
                                                logo = netflix;
                                                break;

                                            case 'prime':
                                                logo = prime;
                                                break;

                                            case 'apple':
                                                logo = apple;
                                                break;

                                            case 'now':
                                                logo = now;
                                                break;
                                        }

                                        return (
                                            <a
                                                key={platform}
                                                className={styles.streamingPlatform}
                                                href={movie.streamingInfo[platform].gb.link}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                {logo ? (
                                                    <div className={styles.logo}>
                                                        <Image
                                                            src={logo}
                                                            alt={platform}
                                                            //  objectFit='contain'
                                                        />
                                                    </div>
                                                ) : (
                                                    <p>{platform}</p>
                                                )}
                                            </a>
                                        );
                                    }

                                    return null;
                                })
                            ) : (
                                <p>
                                    <strong>Currently not streaming</strong>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
