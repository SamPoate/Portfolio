import { InputHTMLAttributes } from 'react';
import { GoAlert } from 'react-icons/go';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, error, ...props }) => (
    <div className={[styles.input, error ? styles.error : '', className || ''].filter(cn => cn).join(' ')}>
        <label htmlFor='input'>{label}</label>
        <input id='input' type='text' {...props} />
        {error && (
            <p className={styles.errorText}>
                <GoAlert />
                {error}
            </p>
        )}
    </div>
);
export default Input;
