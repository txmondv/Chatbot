import { KeyboardEvent, useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useParams } from "react-router";
import { useChat, useChatInfo, useSendMessage } from "../../hooks/Chat.hooks";
import { ChatMessage } from "../../types/Chat.types";
import { ChatBubble } from "../custom/Chat/ChatBubble";
import { useGetUsername } from "../../hooks/Profile.hooks";
import { ClipLoader } from "react-spinners";

const ChatPage = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const { data: chat, isLoading } = useChat(Number(chatId));
    const sendMessage = useSendMessage();
    const [message, setMessage] = useState("");
    const [pendingMessages, setPendingMessages] = useState<{ id: number; content: string }[]>([]);

    const { data: userName } = useGetUsername();
    const { data: chatInfo } = useChatInfo(Number(chatId));

    useEffect(() => {
        setPendingMessages([]);
    }, [chat?.length]);

    const getSenderName = (who: "USER" | "LLM") => {
        return who == "USER"
            ? userName ?? "Loading..."
            : chatInfo?.model ?? "AI";
    }

    const findSenderName = (msg: ChatMessage) => {
        return msg.origin == "USER" ? getSenderName("USER") : getSenderName("LLM");
    }

    const handleSendMessage = () => {
        if(sendMessage.isLoading) return;
        if (message.trim()) {
            const tempId = Date.now();
            setPendingMessages((prev) => [...prev, { id: tempId, content: message }]);
            sendMessage.mutate(
                { chatId: Number(chatId), content: message },
                { onSettled: () => setPendingMessages([]) }
            );
            setMessage("");
        }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isLoading) return <div className="text-white text-center">Loading...</div>;

    return (
        <div className="max-h-full flex flex-col items-center bg-zinc-900 text-white">

            <div className={`overflow-y-auto w-full flex justify-center pb-20 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-red-800`}>
                <div className="w-[80%] p-6 space-y-4 mt-16">
                    {chat?.map((msg) => (
                        <ChatBubble userName={findSenderName(msg)} message={msg} />
                    ))}
                    {pendingMessages.map((msg) => (
                        <ChatBubble userName={getSenderName("USER")} message={{ chatId: msg.id, content: msg.content, origin: "USER" } as ChatMessage} />
                    ))}
                    {pendingMessages.length > 0 && (
                        <ChatBubble userName={getSenderName("LLM")} message={{ chatId: -1, content: "", origin: "LLM" } as ChatMessage} loading />
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 w-full bg-zinc-900 py-4">
                <div className="w-[80%] mx-auto flex items-center">
                    <input
                        type="text"
                        className="flex-1 px-4 py-4 rounded-l-lg bg-gray-700 text-white border-none focus:ring-2 focus:ring-blue-500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Schreibe etwas..."
                    />
                    <button
                        className={`bg-blue-600 text-white text-2xl rounded-r-lg hover:bg-blue-700 ${sendMessage.isLoading ? "p-3" : "p-4"}`}
                        onClick={handleSendMessage}
                    >
                        {sendMessage.isLoading ? <ClipLoader color="#ffffff" size={20} /> : <FaPaperPlane />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;