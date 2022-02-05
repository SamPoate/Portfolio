import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import logo from '@image/logo.svg';
import styles from './Default.module.scss';

interface DefaultProps {}

export const Default: React.FC<DefaultProps> = ({ children }) => (
    <>
        <Head>
            <title>Sam Poate</title>
            <meta
                name='description'
                content='Sam Poate is a self-taught front end engineer with a passion to keep learning and strong team player and believer in people.'
            />
            <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <Link href='/' passHref>
                        <div>
                            <Image
                                src={logo}
                                alt='Sam Poate'
                                width={40}
                                height={40}
                            />
                        </div>
                    </Link>
                </div>
            </header>
            {children}
            <footer className={styles.footer}>
                <div>
                    <div className={styles.socials}>
                        <a
                            href='https://github.com/sampoate'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <FaGithub />
                        </a>
                    </div>
                    <div>
                        <p>Sam Poate &copy; 2022</p>
                    </div>
                </div>
            </footer>
        </div>
    </>
);

export default Default;
