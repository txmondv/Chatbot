import { useState, useEffect, useRef } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { useGetAllUsers, useGetUserRoles } from "../../../hooks/Profile.hooks";
import { UserRole } from "../../../types/User.types";
import { addUserRole, removeUserRole } from "../../../service/User.service";
import NoAccessPage from "../lib/NoAccessPage";
import { ProfileImage } from "../../custom/Profile/ProfileImage";
import SimpleDropdownMenu from "../../lib/dropdown/SimpleDropdownMenu";


const UserManagementPage = () => {
    const { data: roles, isLoading: isRolesLoading, refetch: refetchRoles } = useGetUserRoles();
    const isAllowed = roles?.includes("MANAGER") ?? false;
    const { data: users, isLoading: isUsersLoading, refetch: refetchUsers } = useGetAllUsers(isAllowed);

    const [filterName, setFilterName] = useState("");
    const [filterRoles, setFilterRoles] = useState<UserRole[]>([]);
    const [listHeight, setListHeight] = useState("75vh");

    const allRoles: UserRole[] = ["SUPPORT", "MANAGER", "TECHNICAL"];
    const listRef = useRef<HTMLDivElement>(null);

    const filteredUsers = users?.filter((user) => {
        const nameMatch = user.username.toLowerCase().includes(filterName.toLowerCase());
        const roleMatch = filterRoles.length === 0 || filterRoles.every((role) => user.roles.includes(role as UserRole));
        return nameMatch && roleMatch;
    });

    async function refetch() {
        await refetchRoles();
        if (isAllowed) await refetchUsers();
    }

    async function addRole(username: string, role: UserRole) {
        await addUserRole({
            username: username,
            role: role,
        });

        refetch();
    }

    async function removeRole(username: string, role: UserRole) {
        await removeUserRole({
            username: username,
            role: role,
        });

        refetch();
    }

    function updateHeight(elem: HTMLDivElement) {
        const rect = elem.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 65;
        setListHeight(`${availableHeight}px`);
    }

    useEffect(() => {
        const updateListHeight = () => {
            if (listRef.current) {
                updateHeight(listRef.current);
            }
        };

        updateListHeight();
        window.addEventListener("resize", updateListHeight);

        return () => window.removeEventListener("resize", updateListHeight);
    }, [listRef]);

    useEffect(() => {
        if (listRef.current) updateHeight(listRef.current);
    }, [listRef, filteredUsers]);

    const isLoading = isRolesLoading || isUsersLoading;
    if (isLoading) return;

    if (!roles?.includes("MANAGER")) {
        return <NoAccessPage />;
    }

    return (
        <div className="min-h-full max-h-[100%] flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold text-white my-4">Benutzerverwaltung</h1>

            <div className="w-full max-w-[95%] md:max-w-[80%] p-6 rounded-lg bg-zinc-800 text-white flex flex-col gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Durchsuchen..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="bg-zinc-700 p-2 rounded-md flex-grow min-w-[150px]"
                    />
                    <div className="flex flex-wrap gap-2">
                        {allRoles.map((role) => (
                            <button
                                key={role}
                                className={`p-2 rounded-md ${filterRoles.includes(role) ? "bg-blue-600" : "bg-zinc-700"}`}
                                onClick={() => {
                                    if (filterRoles.includes(role)) {
                                        setFilterRoles(filterRoles.filter((r) => r !== role));
                                    } else {
                                        setFilterRoles([...filterRoles, role]);
                                    }
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div ref={listRef} className="overflow-y-auto pr-2" style={{ maxHeight: listHeight }}>
                    {filteredUsers?.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-md bg-zinc-700 mb-2">
                            <div className="flex items-center gap-4">
                                <div className="p-1">
                                    <ProfileImage userName={user.username} />
                                </div>
                                <span>{user.username}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {user.roles.map((role) => (
                                    <span key={role} className="flex items-center gap-1 bg-zinc-600 px-3 py-1 rounded-md">
                                        {role}
                                        <AiOutlineDelete className="cursor-pointer" onClick={() => removeRole(user.username, role)} />
                                    </span>
                                ))}
                                <SimpleDropdownMenu
                                    icon={
                                        <button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
                                            <AiOutlinePlus />
                                        </button>
                                    }
                                    options={allRoles
                                        .filter((role) => !user.roles.includes(role))
                                        .map((role) => ({
                                            title: role,
                                            onClick: (close) => {
                                                addRole(user.username, role);
                                                close();
                                            },
                                        }))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;