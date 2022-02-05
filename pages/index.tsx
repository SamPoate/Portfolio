import type { NextPage } from 'next';
import Default from '@layout/Default';
import Home from '@template/home/Home';

const HomePage: NextPage = () => (
    <Default>
        <Home />
    </Default>
);

export default HomePage;
