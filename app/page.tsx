'use client';
import Link from 'next/link';
import styles from './Home.module.scss';

const HomePage: React.FC = () => (
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
                        <Link href='/movies'>Movie Finder</Link>
                        <Link href='/flight-tracker'>Flight Tracker</Link>
                        {/* <Link href='/url-inspector' passHref>
                                <button>URL Inspector</button>
                            </Link> */}
                    </div>
                </div>
            </div>
        </section>
    </main>
);

export default HomePage;
