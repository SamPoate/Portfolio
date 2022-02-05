import type { NextPage } from 'next';
import Default from '@layout/Default';
import Movies from '@template/movies/Movies';

const MoviesPage: NextPage = () => (
    <Default>
        <Movies />
    </Default>
);

export default MoviesPage;
