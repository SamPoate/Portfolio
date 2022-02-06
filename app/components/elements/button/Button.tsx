import { ButtonHTMLAttributes } from 'react';
import { GoAlert } from 'react-icons/go';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType?: 'primary' | 'secondary' | 'tertiary' | 'outline';
    error?: string;
}

export const Button: React.FC<ButtonProps> = ({ buttonType, className, error, children, ...props }) => (
    <button
        type='button'
        className={[styles.button, styles[buttonType || 'primary'], className || ''].join(' ').trim()}
        {...props}
    >
        {children}
        {error && (
            <div className={styles.errorMessage}>
                <GoAlert />
                <p>{error}</p>
            </div>
        )}
    </button>
);

export default Button;
