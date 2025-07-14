"use client";
import { signIn } from "next-auth/react";
import ReactDOM from "react-dom";
import Modal from "./Modal";
interface LoginProps {
    onClose: () => void;
}

const Login = ({ onClose }: LoginProps) => {
    return ReactDOM.createPortal(
        <Modal
            title="Warning"
            open={true}
            onClose={onClose}
            buttons={[
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                        signIn();
                    }}
                >
                    Login
                </button>,
                <button className="btn btn-sm">Close</button>,
            ]}
        >
            <p className="py-4">Please login to continue...</p>
        </Modal>,
        document.body
    );
};

export default Login;
