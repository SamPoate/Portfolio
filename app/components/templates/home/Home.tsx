import Link from 'next/link';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
    return (
        <main className={styles.main}>
            <section className={styles.intro}>
                <div>
                    <div>
                        <h1>Sam Poate</h1>
                        <p>Self-taught Front End Engineer,</p>
                    </div>
                </div>
                <div>
                    <div>
                        <p>School-taught Mechanical Engineer</p>
                        <div className={styles.projectLinks}>
                            <Link href='/movies' passHref>
                                <button>Movie Finder</button>
                            </Link>
                            <Link href='/flight-tracker' passHref>
                                <button>Flight Tracker</button>
                            </Link>
                            <Link href='/mystery' passHref>
                                <button>Mystery Box</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
