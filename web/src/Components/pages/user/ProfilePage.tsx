import { AiOutlineCode, AiOutlineMessage } from "react-icons/ai";
import { useGetUsername, useGetUserRoles } from "../../../hooks/Profile.hooks";
import { useChats } from "../../../hooks/Chat.hooks";
import { ProfileImage } from "../../custom/Profile/ProfileImage";


const ProfilePage = () => {
    const { data: username, isLoading: isUsernameLoading } = useGetUsername();
    const { data: roles, isLoading: isRolesLoading } = useGetUserRoles();
    const { data: chats, isLoading: isChatsLoading } = useChats();

    if (isUsernameLoading || isRolesLoading || isChatsLoading) {
        return <div className="text-white text-center">Loading...</div>;
    }

    return (
        <div className="min-h-full flex flex-col items-center p-4">
            <div className="w-full max-w-[80%] p-6 rounded-lg bg-zinc-800 text-white mb-8 mt-10">
                <div className="flex flex-col justify-center">
                    <div className="flex flex-row items-center">
                        <div className="rounded-full bg-gray-700 mr-6">
                            <ProfileImage userName={username ?? ""} size={80} />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl font-bold">{username}</h1>
                            <div className="flex flex-wrap mt-2 gap-2">
                                {roles?.map((role) => (
                                    <span key={role} className="flex items-center gap-2 bg-zinc-700 text-sm px-2 py-1 rounded-md">
                                        <AiOutlineCode /> {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[80%] p-6 rounded-lg bg-zinc-800 text-white">
                <h2 className="text-2xl font-bold mb-4">Statistiken</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-700 p-4 rounded-lg flex flex-col items-center">
                        <AiOutlineMessage className="text-4xl mb-2" />
                        <span className="text-xl font-semibold">{chats?.length || 0}</span>
                        <span className="text-sm">Gesamte Chats</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;