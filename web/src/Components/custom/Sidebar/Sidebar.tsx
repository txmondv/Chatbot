import React, { useEffect, useState, } from "react";
import { BiSupport, BiUser } from "react-icons/bi";
import { BsChat, BsChevronBarLeft, BsChevronBarRight, BsTicket } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi2";
import { IoBriefcaseOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbBoxModel2 } from "react-icons/tb";
import { useNavigate } from "react-router";
import logo from "../../../assets/sidebar-icon.png";
import { useGetUserRoles } from "../../../hooks/Profile.hooks.ts";
import { getStorageValue, setStorageValue } from "../../../storage/StorageProvider.ts";
import { SidebarDivider } from "./SidebarDivider.tsx";
import { SidebarDropdown } from "./SidebarDropdown.tsx";
import { SidebarItem } from "./SidebarItem.tsx";
import { IoMdPaper } from "react-icons/io";

interface SidebarProps {
    handleSidebarLock: (expanded: boolean) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ handleSidebarLock }) => {
    const navigate = useNavigate();

    const getStorageLock = (): boolean => getStorageValue("sidebarLocked") as boolean;
    const setStorageLock = (lock: boolean) => setStorageValue("sidebarLocked", lock);

    const [isLocked, setIsLocked] = useState(getStorageLock());
    const [isHovered, setIsHovered] = useState(false);

    const { data: roles, isLoading: isRolesLoading } = useGetUserRoles();

    const expanded = isLocked || isHovered;

    useEffect(() => {
        if (getStorageLock() != isLocked) setStorageLock(isLocked);
        handleSidebarLock(isLocked);
    }, [handleSidebarLock, isLocked]);

    const isLoading = isRolesLoading;

    if (isLoading) return <></>;

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
                    {isLocked ? <BsChevronBarLeft /> : <BsChevronBarRight />}
                </button>
            </div>

            <nav className={`
                flex flex-col mt-2 pb-12 px-3 overflow-y-auto h-[calc(100%-3rem)]
                ${!expanded && "overflow-x-hidden"}
            `}>
                <SidebarItem
                    icon={<HiOutlineHome />}
                    title={"Home"}
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
                <SidebarItem
                    icon={<BsTicket />}
                    title={"Tickets"}
                    active={false}
                    alert={false}
                    onClick={"/tickets/"}
                    expanded={expanded}
                />
                {roles && roles?.length > 0 && (
                    <div>
                        <SidebarDivider expanded={expanded}  />
                        {roles?.includes("SUPPORT") && (
                            <SidebarDropdown sidebarExpanded={expanded} icon={<BiSupport />} title={"Support"} hideBorder={true}>
                                <SidebarItem
                                    icon={<IoMdPaper />}
                                    title={"Anfragen"}
                                    active={false}
                                    alert={false}
                                    onClick={"/requests/"}
                                    expanded={expanded}
                                />
                            </SidebarDropdown>

                        )}
                        {roles?.includes("MANAGER") && (
                            <SidebarDropdown sidebarExpanded={expanded} icon={<IoBriefcaseOutline />} title={"Verwaltung"} hideBorder={true}>
                                <SidebarItem
                                    icon={<BiUser />}
                                    title={"Benutzer"}
                                    active={false}
                                    alert={false}
                                    onClick={"/users/"}
                                    expanded={expanded}
                                />
                            </SidebarDropdown>

                        )}
                        {roles?.includes("TECHNICAL") && (
                            <SidebarDropdown sidebarExpanded={expanded} icon={<FaLaptopCode />} title={"Technisches"} hideBorder={true}>
                                <SidebarItem
                                    icon={<LuLayoutDashboard />}
                                    title={"Dashboard"}
                                    active={false}
                                    alert={false}
                                    onClick={"/dashboard"}
                                    expanded={expanded}
                                />
                                <SidebarItem
                                    icon={<TbBoxModel2 />}
                                    title={"Modelle"}
                                    active={false}
                                    alert={false}
                                    onClick={"/models/"}
                                    expanded={expanded}
                                />
                            </SidebarDropdown>
                        )}
                    </div>
                )}
            </nav>
        </div>
    )
        ;
};

export default Sidebar;