import {useNavigate} from "react-router";
import React from "react";
 
interface SidebarItemProps {
    icon: React.ReactNode;
    title: string;
    active?: boolean;
    alert?: boolean;
    onClick: (() => void) | string;
    expanded: boolean;
    isStandalone?: boolean;
    hideBorder?: boolean;
}
 
export const SidebarItem: React.FC<SidebarItemProps> = ({
                                                            icon,
                                                            title,
                                                            active = false,
                                                            alert = false,
                                                            onClick,
                                                            expanded,
                                                            isStandalone = true,
                                                            hideBorder = false
                                                        }) => {
    const navigate = useNavigate();
 
    return (
        <div onClick={typeof onClick == "string" ? () => navigate(onClick) : onClick}>
            <li
                className={`
                    transition-all relative flex items-center py-2 px-3 my-1
                    font-medium rounded-md cursor-pointer group
                    ${isStandalone
                    ? !hideBorder && `border-b rounded-b-none border-gray-400`
                    : `select-none ml-4 border-l rounded-l-none font-medium cursor-pointer bg-white 
                       hover:border-gray-400 px-3 py-2 items-center rounded-lg group dark:bg-zinc-800 
                       dark:border-gray-400 dark:hover:border-white`}
                    ${active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800 dark:text-gray-900 dark:hover:text-black"
                    : "hover:bg-indigo-50 text-gray-600 hover:dark:bg-zinc-700 dark:text-gray-400 dark:hover:text-white"}
                `}
            >
                {icon}
                <span className={`overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}`}>
                    {expanded && title}
                </span>
                {alert && (
                    <div
                        className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                            expanded ? "" : "top-2"
                        }`}
                    />
                )}
 
                {!expanded && (
                    <div
                        className={`
                          absolute left-full rounded-md px-2 py-1 ml-6
                          bg-indigo-100 text-indigo-800 text-sm
                          invisible opacity-20 -translate-x-3 transition-all
                          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                        `}
                    >
                        {title}
                    </div>
                )}
            </li>
        </div>
    );
}