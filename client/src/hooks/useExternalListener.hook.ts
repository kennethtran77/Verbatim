import { RefObject, useLayoutEffect } from "react";

/**
 * A hook that calls a function when outside of the element is clicked.
 */
const useExternalListener = (onClick: Function, ref: RefObject<HTMLElement>, active: boolean = true)=> {
    useLayoutEffect(() => {
        if (!active) {
            return;
        }

        const handleClick = (e: MouseEvent) => {
            if (ref.current) {
                /**
                 * Returns whether `target` is an element contained by any descendant of `element` 
                 * @returns a boolean
                 */
                const elementInDescendants = (element: any, target: any): boolean => {
                    for (const child of element.childNodes) {
                        if (element.contains(target)) {
                            return true;
                        }

                        return elementInDescendants(child, target);
                    }

                    return false;
                }

                // execute the onClick function when an element besides ref and all its descendants is clicked
                if (!elementInDescendants(ref.current, e.target)) {
                    onClick();
                }
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, onClick, active]);
}

export default useExternalListener;