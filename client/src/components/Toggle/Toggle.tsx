import { MouseEventHandler, useId } from "react";
import styles from './Toggle.module.css';

type ToggleProps = {
    label: string;
    checked: boolean;
    [x: string]: any;
};

export type ToggleChangeEvent = {
    title: string
}

const Toggle = ({ title, label, checked, onChange, ...inputProps }: ToggleProps) => {
    const id = useId();

    const handleClick: MouseEventHandler<HTMLSpanElement> = (e) => {
        const event: ToggleChangeEvent = {
            title
        }
        onChange(event);
    }

    return (
        <span className="flex gap align-items-center">
            <label className={styles.switch} htmlFor={id}>
                <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                />
                <span className={styles.slider} onClick={handleClick} />
            </label>
            {label}
        </span>
    );
};

export default Toggle;