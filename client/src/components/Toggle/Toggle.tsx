import { useId } from "react";

type ToggleProps = {
    label: string;
    checked: boolean;
    [x: string]: any;
};

const Toggle = ({ label, checked, ...inputProps }: ToggleProps) => {
    const id = useId();

    return (
        <label className="flex gap align-items-center" htmlFor={id}>
            <input
                type="checkbox"
                checked={checked}
                { ...inputProps }
            />
            {label}
        </label>
    );
};

export default Toggle;