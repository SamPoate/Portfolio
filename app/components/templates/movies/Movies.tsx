/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AiOutlineFileSearch } from 'react-icons/ai';
import PulseLoader from 'react-spinners/PulseLoader';
import { useOnScreen } from '@helper/hooks';
import Input from '@element/input/Input';
import Button from '@element/button/Button';
import Select from '@element/select/Select';
import Card from './Card';
import MovieDetails from './MovieDetails';
import styles from './Movies.module.scss';

type MediaTypes = 'all' | 'movie' | 'series' | 'episode';

export interface ISearch {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}

export const Movies: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<MediaTypes>('all');
    const [year, setYear] = useState<string>('');
    const [searchResults, setSearchResults] = useState<ISearch[]>([]);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [activeMovieId, setActiveMovieId] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<Record<'title' | 'year', string>>>({});

    const ref = useRef<HTMLDivElement>(null);

    const onScreen = useOnScreen(ref);

    const genres: { value: MediaTypes; name: string }[] = [
        { value: 'all', name: 'All' },
        { value: 'movie', name: 'Movie' },
        { value: 'series', name: 'Series' },
        { value: 'episode', name: 'Episode' }
    ];

    const search = async (mergeResults?: boolean) => {
        setLoading(true);

        if (title.length < 3) {
            setErrors(prev => ({ ...prev, title: 'Must be at least 3 characters' }));
            setLoading(false);
            return;
        }

        let pages = [1, 2, 3];

        if (mergeResults) {
            const totalPages = Math.ceil(totalResults / 10);
            const totalCurrentPages = Math.ceil(searchResults.length / 10);

            if (totalPages <= totalCurrentPages) {
                setLoading(false);
                return;
            }

            pages = pages.map(page => page + totalCurrentPages);
        }

        try {
            const responses = await Promise.all(
                pages.map(page =>
                    axios.get<{ Search: ISearch[]; totalResults: string } | { Error: string; Response: string }>(
                        'https://www.omdbapi.com/',
                        {
                            params: {
                                apiKey: 'ef721bfe',
                                s: title.toLowerCase(),
                                type: type === 'all' ? undefined : type,
                                y: year || undefined,
                                page
                            }
                        }
                    )
                )
            );

            const movies = responses
                .map(response => ('Search' in response.data ? response.data.Search : []))
                .flat();

            setTotalResults(
                responses[0] && 'totalResults' in responses[0]?.data ? parseInt(responses[0].data.totalResults) : 0
            );

            setSearchResults(prev =>
                [...(mergeResults ? prev : []), ...movies].sort((left, right) =>
                    left.Title.localeCompare(right.Title)
                )
            );
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    useEffect(() => {
        let titleErrorTimeout: NodeJS.Timeout;

        if (errors.title) {
            titleErrorTimeout = setTimeout(() => {
                setErrors(prev => ({ ...prev, title: undefined }));
            }, 3000);
        }

        return () => {
            clearTimeout(titleErrorTimeout);
        };
    }, [errors]);

    useEffect(() => {
        if (!loading && onScreen && searchResults.length !== totalResults) {
            search(true);
        }
    }, [onScreen]);

    return (
        <main className={styles.main}>
            <section>
                <h1>Where is the movie streaming?</h1>
                <div className={styles.search}>
                    <Input
                        label='Movie Name'
                        placeholder='Back to the future'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        onKeyDown={({ key }) => {
                            if (key === 'Enter') {
                                search();
                            }
                        }}
                        error={errors.title}
                    />
                    <Select
                        label='Type'
                        value={type}
                        onChange={({ target }) => setType(target.value as MediaTypes)}
                        options={genres}
                    />
                    <Input
                        label='Year'
                        placeholder='1985'
                        value={year}
                        onChange={({ target: { value } }) =>
                            ((/^\d+$/.test(value) && value.length <= 4) || value.length === 0) && setYear(value)
                        }
                    />
                    <Button buttonType='secondary' onClick={() => search()}>
                        Search
                    </Button>
                    <Button
                        buttonType='outline'
                        onClick={() => {
                            setTitle('');
                            setType('all');
                            setYear('');
                            setSearchResults([]);
                            setTotalResults(0);
                        }}
                    >
                        Clear
                    </Button>
                </div>
                <div className={styles.cardContainer}>
                    {searchResults.length > 0 ? (
                        searchResults.map((movie, index) => (
                            <Card
                                key={`${index}_${movie.imdbID}`}
                                movie={movie}
                                setActiveMovieId={setActiveMovieId}
                            />
                        ))
                    ) : (
                        <div className={styles.placeholder}>
                            <AiOutlineFileSearch size={100} />
                            <p>Search for a movie, series or episode to get started!</p>
                        </div>
                    )}
                    <div ref={ref} className={styles.loader}>
                        <PulseLoader
                            color='#8cb0d9'
                            css='opacity: 0.3'
                            loading={loading}
                            size={15}
                            speedMultiplier={0.6}
                        />
                    </div>
                </div>
                {activeMovieId && <MovieDetails movieId={activeMovieId} setActiveMovieId={setActiveMovieId} />}
            </section>
        </main>
    );
};

export default Movies;
