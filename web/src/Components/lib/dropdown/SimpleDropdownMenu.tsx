import React, { useState, useRef, useEffect } from "react";
import { SlOptionsVertical } from "react-icons/sl";

export interface SimpleDropdownMenuOption {
    title: string;
    onClick: () => void;
}

interface SimpleDropdownMenuProps {
    options: SimpleDropdownMenuOption[];
}

const SimpleDropdownMenu: React.FC<SimpleDropdownMenuProps> = ({ options }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)} className="p-3 hover:bg-zinc-700 rounded-md">
                <SlOptionsVertical />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-zinc-700 text-white rounded-md shadow-md">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className="block w-full text-left px-4 py-2 hover:bg-zinc-600"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent closing when clicking inside
                                option.onClick();
                            }}
                        >
                            {option.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimpleDropdownMenu;
