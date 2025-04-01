import { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineCode, AiOutlineDelete, AiOutlineEdit, AiOutlineMessage } from "react-icons/ai";
import { useChats, useCreateChat } from "../../hooks/Chat.hooks";
import { getModels } from "../../service/Ollama.service";
import { Chat } from "../../types/Chat.types";
import { useNavigate } from "react-router";
import { deleteChat, setChatTitle } from "../../service/Chat.service";
import { extractThoughtProcess } from "../../utils/Chat.utils";

const formatDate = (isoString: string): string => {
    if(!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

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
        if (editingChat) {
            await setChatTitle(editingChat, editedTitle);
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

    const getTitle = (title: string) => {
        return extractThoughtProcess(title).answer.trim().replace(/^"+|"+$/g, '');
    };

    if (isLoading) return <div className="text-white text-center">Loading...</div>;

    return (
        <div className="min-h-full flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold text-white my-4">Deine Chats</h1>
            <div className="flex my-4">
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
                    className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700"
                >
                    Neuer Chat
                </button>
            </div>
            <div className="w-full max-w-[80%] p-4 rounded-lg flex flex-col gap-4">
                {chats?.length ? (
                    chats.reverse().map((chat) => (
                        <div 
                            key={chat.id} 
                            className="p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 flex justify-between items-center"
                            onClick={() => navigate("/chats/" + chat.id)}
                        >
                            <div className="flex flex-col">
                                <div className="text-lg font-bold flex items-center gap-2">
                                    {editingChat === chat.id ? (
                                        <input
                                            type="text"
                                            className="bg-gray-600 text-white px-2 py-1 rounded w-fit"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={handleSaveTitle}
                                            autoFocus
                                        />
                                    ) : (
                                        <>
                                            {getTitle(chat.title)}
                                            <AiOutlineEdit className="text-gray-500 cursor-pointer" onClick={(e) => {
                                                 e.stopPropagation();
                                                 handleEditTitle(chat);
                                            }} />
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-3 text-sm text-gray-300">
                                    <span className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-md">
                                        <AiOutlineCode /> {chat.model}
                                    </span>
                                    <span className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-md">
                                        <AiOutlineClockCircle /> {formatDate(chat.lastMessageAt)}
                                    </span>
                                    <span className="flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-md">
                                        <AiOutlineMessage /> {chat.messageCount}
                                    </span>
                                </div>
                            </div>
                            <AiOutlineDelete className="cursor-pointer text-red-500" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat.id);
                            }} />
                        </div>
                    ))
                ) : (
                    <div className="text-white text-center">Du hast noch nicht gechattet! :)</div>
                )}
            </div>
        </div>
    );
};

export default ChatsOverviewPage;