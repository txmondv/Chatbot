import { useEffect, useState } from "react";
import {
    AiOutlineClockCircle,
    AiOutlineCode,
    AiOutlineDelete,
    AiOutlineEdit,
    AiOutlineMessage,
    AiOutlinePlusCircle,
} from "react-icons/ai";
import { useNavigate } from "react-router";
import { useChats, useCreateChat } from "../../../hooks/Chat.hooks";
import { deleteAllChats, deleteChat, setChatTitle } from "../../../service/Chat.service";
import { getModels } from "../../../service/Ollama.service";
import { Chat } from "../../../types/Chat.types";
import { getTitle } from "../../../utils/Chat.utils";
import { formatDate } from "../../../utils/Formatting.utils";

const ChatsOverviewPage = () => {
    const navigate = useNavigate();
    const { data: chats, isLoading, refetch } = useChats();
    const createChat = useCreateChat();

    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [editingChat, setEditingChat] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState("");

    useEffect(() => {
        getModels().then((models) => {
            setModels(models);
            if (models.length > 0) {
                setSelectedModel(models[0]);
            }
        });
    }, []);

    const handleNewChat = () => {
        if (selectedModel) {
            createChat.mutate(selectedModel);
        }
    };

    const handleEditTitle = (chat: Chat) => {
        setEditingChat(chat.id);
        setEditedTitle(getTitle(chat.title));
    };

    const handleSaveTitle = async () => {
        if (editingChat && editedTitle.trim()) {
            await setChatTitle(editingChat, editedTitle.trim());
            refetch();
            setEditingChat(null);
        }
    };

    const handleDeleteChat = async (chatId: number) => {
        if (window.confirm("Bist du sicher, dass du diesen Chat löschen möchtest?")) {
            await deleteChat(chatId);
            refetch();
        }
    };

    const handleDeleteAllChats = async () => {
        if (window.confirm("Bist du sicher, dass du wirklich **alle** Chats löschen möchtest?")) {
            await deleteAllChats();
            refetch();
        }
    };



    const sortedChats = chats
        ? [...chats].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
        : [];

    if (isLoading) return <div className="text-white text-center">Loading...</div>;

    return (
        <div className="min-h-full flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold text-white mb-6">Deine Chats</h1>

            <div className="flex mb-6">
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="pl-3 pr-6 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-600"
                >
                    {models.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleNewChat}
                    className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <AiOutlinePlusCircle /> Neuer Chat
                </button>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-4">
                {sortedChats.length > 0 ? (
                    sortedChats.map((chat) => (
                        <div
                            key={chat.id}
                            className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition flex justify-between items-center cursor-pointer"
                            onClick={() => navigate(`/chats/${chat.id}`)}
                        >
                            <div className="flex flex-col w-full overflow-hidden">
                                <div className="text-lg font-semibold flex items-center gap-2 w-full">
                                    {editingChat === chat.id ? (
                                        <input
                                            type="text"
                                            className="bg-zinc-700 text-white px-2 py-1 rounded w-full max-w-full"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={handleSaveTitle}
                                            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 max-w-full">
                                            <span className="truncate max-w-[calc(100%-1.5rem)]">
                                                {getTitle(chat.title)}
                                            </span>
                                            <AiOutlineEdit
                                                className="text-gray-400 hover:text-cyan-400 cursor-pointer flex-shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditTitle(chat);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-3 text-sm text-gray-300 flex-wrap">
                                    <span className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-md">
                                        <AiOutlineCode /> {chat.model}
                                    </span>
                                    <span className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-md">
                                        <AiOutlineClockCircle /> {formatDate(chat.lastMessageAt)}
                                    </span>
                                    <span className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-md">
                                        <AiOutlineMessage /> {chat.messageCount}
                                    </span>
                                </div>
                            </div>

                            <AiOutlineDelete
                                className="text-red-500 hover:text-red-400 transition cursor-pointer text-xl ml-4 flex-shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat(chat.id);
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-white text-center">Du hast noch nicht gechattet! :)</div>
                )}
            </div>
            <button
                onClick={handleDeleteAllChats}
                className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all flex items-center cursor-pointer"
            >
                <AiOutlineDelete className="mr-2" />
                Alle löschen
            </button>
        </div>
    );
};

export default ChatsOverviewPage;
