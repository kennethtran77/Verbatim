import DeleteButton from "../DeleteButton/DeleteButton";

import style from './Modal.module.css'

type ModalProps = {
    children?: React.ReactNode;
    active: boolean;
    setActive(state: boolean): any;
};

const Modal = ({ children, active, setActive }: ModalProps) => {
    const hide = () => {
        setActive(false);
    }

    return (
        <>
            {active &&
                <div
                    className={style["modal-back"]}
                    onClick={hide}
                    onKeyPress={e => {
                        if (e.key === 'Escape') {
                            hide();
                        }
                    }}
                />
            }
            { active &&
                <div className={style.modal} >
                    <DeleteButton className={style['delete']} onClick={hide} ariaLabel="Close Modal" tooltip="Close Modal" background />
                    {children}
                </div>
            }
        </>
    );
};

export default Modal;