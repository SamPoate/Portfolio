import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import logo from '@image/logo-dark.svg';
import { ISearch } from './page';
import styles from './Card.module.scss';

interface CardProps {
    movie: ISearch;
    setActiveMovieId: Dispatch<SetStateAction<string | undefined>>;
}

export const Card: React.FC<CardProps> = ({ movie, setActiveMovieId }) => (
    <div className={styles.card} onClick={() => setActiveMovieId(movie.imdbID)}>
        <div className={styles.image}>
            <Image
                src={movie.Poster.startsWith('http') ? movie.Poster : logo}
                alt={movie.Title || 'Movie Image'}
                width={300}
                height={375}
                style={{
                    objectFit: movie.Poster.startsWith('http') ? 'cover' : 'contain',
                    objectPosition: movie.Poster.startsWith('http') ? 'center top' : 'center 20%'
                }}
            />
        </div>
        <div className={styles.content}>
            <h3>
                {movie.Title} <small>({movie.Year})</small>
            </h3>
            <p>{movie.Title}</p>
        </div>
    </div>
);

export default Card;
