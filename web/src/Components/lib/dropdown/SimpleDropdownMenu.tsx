import React, { useState, useRef, useEffect, ReactNode } from "react";
import { SlOptionsVertical } from "react-icons/sl";

export interface SimpleDropdownMenuOption {
    icon?: ReactNode;
    title: string;
    onClick: (close: () => void) => void;
}

interface SimpleDropdownMenuProps {
    options: SimpleDropdownMenuOption[];
    className?: string;
    buttonClassName?: string;
}

const SimpleDropdownMenu: React.FC<SimpleDropdownMenuProps> = ({ options, className = "", buttonClassName = "" }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    function close() {
        setOpen(false);
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className={`px-2 py-3 rounded-md transition-colors duration-200 ${buttonClassName}`}
            >
                <SlOptionsVertical />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-fit text-white bg-zinc-800 rounded-md shadow-md">
                    {options.map((option, index) => {
                        return (
                            <button
                                key={index}
                                className="block text-left px-4 py-2 text-gray-300 hover:bg-zinc-600 hover:text-white transition-colors duration-200 w-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    option.onClick(close);
                                }}
                            >
                                <div className="flex flex-row items-center">
                                    {option?.icon && <span className="mr-3">{option.icon}</span>} <span className="whitespace-nowrap">{option.title}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default SimpleDropdownMenu;
