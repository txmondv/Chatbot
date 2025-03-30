import { useEffect } from "react";
import { CgClose } from "react-icons/cg";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg z-50" 
            onClick={onClose}
        >
            <div 
                className="bg-zinc-900 p-5 rounded-lg shadow-lg w-[90%] max-w-md relative" 
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <CgClose />
                </button>
                {children}
            </div>
        </div>
    );
};
