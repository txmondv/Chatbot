import { FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

export const profileDropdownLinks: { icon: React.ReactNode; displayName: string; target: string; }[] = [
    {
        icon: <FaUser />,
        displayName: "Profil",
        target: "profile"
    }, {
        icon: <IoIosLogOut />,
        displayName: "Abmelden",
        target: "logout"
    }
]