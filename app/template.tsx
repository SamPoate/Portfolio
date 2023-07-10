import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import logo from '@image/logo.png';
import './scss/globals.scss';
import styles from './Layout.module.scss';

interface TemplateProps {
    children: React.ReactNode;
}

export const Template: React.FC<TemplateProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <Link href='/' passHref>
                        <Image src={logo} alt='Sam Poate' width={40} height={40} />
                    </Link>
                </div>
            </header>
            {children}
            <footer className={styles.footer}>
                <div>
                    <div className={styles.socials}>
                        <a href='https://github.com/sampoate' target='_blank' rel='noopener noreferrer'>
                            <FaGithub />
                        </a>
                        <a href='https://www.linkedin.com/in/sampoate' target='_blank' rel='noopener noreferrer'>
                            <FaLinkedin />
                        </a>
                    </div>
                    <div>
                        <p>Sam Poate &copy; 2022</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Template;
