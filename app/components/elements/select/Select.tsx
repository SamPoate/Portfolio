import { SelectHTMLAttributes } from 'react';
import styles from './Select.module.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; name: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
    <div className={[styles.select, className || ''].join(' ').trim()}>
        <label htmlFor='select'>{label}</label>
        <select id='select' {...props}>
            {options.map(({ value, name }) => (
                <option key={value} value={value}>
                    {name}
                </option>
            ))}
        </select>
    </div>
);

export default Select;
