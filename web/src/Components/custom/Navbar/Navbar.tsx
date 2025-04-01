import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGetUsername } from "../../../hooks/Profile.hooks";
import { ProfileImage } from "../Profile/ProfileImage";
import { useChats } from "../../../hooks/Chat.hooks";
import SearchBar from "./Searchbar";

interface NavbarProps {
    links: {
        icon: React.ReactNode;
        displayName: string;
        target: string;
    }[];
    className?: string;
    sidebarExpanded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ links, className = "", sidebarExpanded }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { data: userName } = useGetUsername();
    const { data: chats } = useChats();
    const searchDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-transparent backdrop-blur-md shadow-md z-10 ${className}`}>
            <div className="flex-grow flex">
                <SearchBar
                    chats={chats}
                    searchDropdownRef={searchDropdownRef}
                />
            </div>
            {userName && (
                <div className="relative" ref={dropdownRef}>
                    <ProfileImage
                        userName={userName}
                        className={`transition-all duration-300 ${sidebarExpanded ? "mr-72" : "mr-16"}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div className={`absolute right-0 mt-2 w-48 bg-zinc-800 shadow-lg rounded-lg p-2 ${sidebarExpanded ? "mr-72" : "mr-16"}`}>
                            {links.map((link) => (
                                <div
                                    key={link.target}
                                    className="px-4 py-3 text-white hover:bg-zinc-700 cursor-pointer rounded"
                                    onClick={() => navigate("/" + link.target)}
                                >
                                    <div className="flex flex-row items-center">
                                        <span className="text-gray-400">{link.icon}</span>
                                        <span className="ml-2">{link.displayName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;