import { CSSProperties, ReactNode, RefObject, useId, useRef, useState } from "react";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import styles from "./Dropdown.module.css";
import useExternalListener from "../../hooks/useExternalListener.hook";

export type DropdownElement = {
    value: string;
    display: string;
}

type DropdownProps = {
    label: ReactNode;
    breakLine?: boolean;
    items: DropdownElement[];
    currItem: DropdownElement;
    /** Callback function that takes an item object and updates the state in the parent component */
    onChange(newItem: DropdownElement): any;
    disabled?: boolean;
    headerStyle?: CSSProperties;
    labelStyle?: CSSProperties;
};

/**
 * A Select component in the form of a Dropdown. 
 */
const Dropdown = ({ label, breakLine = true, items, currItem, onChange = (item: DropdownElement) => {}, disabled = false, headerStyle = {}, labelStyle = {} }: DropdownProps) => {
    const [expanded, setExpanded] = useState(false);
    const ref: RefObject<HTMLDivElement> = useRef(null);

    const id = useId();

    useExternalListener(() => setExpanded(false), ref);

    return (
        <div className={`${breakLine ? 'flex-column' : 'flex gap align-items-center'}`}>
            <label htmlFor={id} style={labelStyle}>{label}</label>
            <div
                ref={ref}
                className={styles.dropdown}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setExpanded(false);
                    } else if (e.key === "Enter") {
                        setExpanded(prev => !prev);
                    }
                }}
            >
                <div
                    id={id}
                    className={`${styles.header} ${expanded ? styles.active : null}`}
                    onClick={disabled ? undefined : () => setExpanded((prev) => !prev)}
                    style={headerStyle}
                    role="button"
                    aria-haspopup="listbox"
                    aria-expanded={expanded}
                    tabIndex={-1}
                >
                    <span className={styles.current}>{currItem.display}</span>
                    <span className={styles.chevron}>
                        { expanded ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                    </span>
                </div>
                {expanded && (
                    <ul
                        className={styles.list}
                        role="listbox"
                        tabIndex={-1}
                    >
                        { !items.length ? (
                            <li key={`empty-list-item`}>No options available</li>
                        ) : items.map((item, index) => (
                            <li
                                id={item.value}
                                role="option"
                                aria-selected={currItem.value === item.value}
                                key={`list-item-${index}`}
                                className={`${currItem.value === item.value ? styles.active : null}`}
                                tabIndex={0}
                                onClick={() => {
                                    setExpanded(false);
                                    // pass newly selected item to parent component
                                    onChange(item);
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        setExpanded(false);
                                        // pass newly selected item to parent component
                                        onChange(item);
                                    }
                                }}
                            >
                                {item.display}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dropdown;