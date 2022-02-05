import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType?: 'primary' | 'secondary' | 'tertiary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ buttonType, className, children, ...props }) => (
    <button
        type='button'
        className={[styles.button, styles[buttonType || 'primary'], className || ''].join(' ').trim()}
        {...props}
    >
        {children}
    </button>
);

export default Button;
