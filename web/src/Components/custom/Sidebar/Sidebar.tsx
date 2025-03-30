import React, { useEffect, useState, } from "react";
import { BsChat, BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { useNavigate } from "react-router";
import logo from "../../../assets/sidebar-icon.png";
import { getStorageValue, setStorageValue } from "../../../storage/StorageProvider.ts";
import { SidebarItem } from "./SidebarItem.tsx";
 
interface SidebarProps {
    handleSidebarLock: (expanded: boolean) => void;
}
 

const Sidebar: React.FC<SidebarProps> = ({handleSidebarLock}) => {
    const navigate = useNavigate();
    
    const getStorageLock = (): boolean => getStorageValue("sidebarLocked") as boolean;   
    const setStorageLock = (lock: boolean) => setStorageValue("sidebarLocked", lock);
 
    const [isLocked, setIsLocked] = useState(getStorageLock());
    const [isHovered, setIsHovered] = useState(false);
 
    const expanded = isLocked || isHovered;
 
    useEffect(() => {
        if(getStorageLock() != isLocked) setStorageLock(isLocked);
        handleSidebarLock(isLocked);
    }, [handleSidebarLock, isLocked]);

 
    return (
        <div
            className={`
                z-40
                fixed top-0 left-0 h-full transition-all duration-300
                shadow-sm bg-zinc-800 border-zinc-700
                ${expanded ? "w-72" : "w-16"} overflow-hidden
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <img
                    src={logo}
                    className={`mt-1 overflow-hidden transition-all ${expanded ? "w-12" : "w-0"} rounded-lg`}
                    alt="Logo"
                    onClick={() => navigate("/")}
                />
                <button
                    onClick={() => setIsLocked((curr) => !curr)}
                    className={`p-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-700`}
                    data-testid={"lock-sidebar"}
                >
                    {isLocked ? <BsChevronBarLeft/> : <BsChevronBarRight/>}
                </button>
            </div>
 
            {/* Sidebar Content */}
            <nav className={`
                flex flex-col mt-2 pb-12 px-3 overflow-y-auto h-[calc(100%-3rem)]
                ${!expanded && "overflow-x-hidden"}
            `}>
                <SidebarItem
                    icon={<LuLayoutDashboard />}
                    title={"Dashboard"}
                    active={false}
                    alert={false}
                    onClick={"/"}
                    expanded={expanded}
                />
                <SidebarItem
                    icon={<BsChat />}
                    title={"Chats"}
                    active={false}
                    alert={false}
                    onClick={"/chats/"}
                    expanded={expanded}
                />
            </nav>
        </div>
    )
        ;
};
 
export default Sidebar;