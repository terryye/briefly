"use client";

import React from "react";

interface ModalProps {
    children: React.ReactNode;
    title?: string;
    open?: boolean;
    onClose?: () => void;
    buttons?: React.ReactNode[];
}

const Modal = ({ children, title, buttons, open, onClose }: ModalProps) => {
    return (
        <dialog
            className="modal"
            open={open}
            onClose={() => {
                onClose?.();
            }}
        >
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">{title ?? "Info"}</h3>
                {children}
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <div className="flex flex-row gap-2">
                            {buttons?.map((button, index) => {
                                return React.cloneElement(
                                    button as React.ReactElement,
                                    {
                                        key: index,
                                    }
                                );
                            })}
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default Modal;
