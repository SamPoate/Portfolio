'use client';
import Link from 'next/link';
import styles from './Home.module.scss';

const HomePage: React.FC = () => (
    <main className={styles.main}>
        <section className={styles.intro}>
            <div>
                <div>
                    <h1>Sam Poate</h1>
                    <p>Self-taught Software Engineer,</p>
                </div>
            </div>
            <div>
                <div>
                    <p>School-taught Mechanical Engineer</p>
                    <div className={styles.projectLinks}>
                        <Link href='/movies'>Movie Finder</Link>
                        <Link href='/flight-tracker'>Flight Tracker</Link>
                        <a href='//crewletics.com' target='_blank'>
                            Crewletics
                        </a>
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
