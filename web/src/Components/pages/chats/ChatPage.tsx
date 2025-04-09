import { KeyboardEvent, useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaPaperPlane } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { Tooltip } from "react-tooltip";
import { useChat, useChatInfo, useSendMessage } from "../../../hooks/Chat.hooks";
import { useGetUsername } from "../../../hooks/Profile.hooks";
import { ChatMessage } from "../../../types/Chat.types";
import { ChatBubble } from "../../custom/Chat/ChatBubble";
import SummaryModal from "../../custom/Chat/SummaryModal";

const ChatPage = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const { data: chat, isLoading } = useChat(Number(chatId));
    const sendMessage = useSendMessage();
    const [message, setMessage] = useState("");
    const [pendingMessages, setPendingMessages] = useState<{ id: number; content: string }[]>([]);
    const { data: userName } = useGetUsername();
    const { data: chatInfo } = useChatInfo(Number(chatId));
    const [dateDividers, setDateDividers] = useState<{ date: string; messages: ChatMessage[] }[]>([]);

    useEffect(() => {
        setPendingMessages([]);
    }, [chat?.length]);

    useEffect(() => {
        if (chat) {
            const allMessages = [...chat, ...pendingMessages.map(msg => ({
                id: msg.id,
                content: msg.content,
                origin: "USER",
                timestamp: new Date().toISOString(),
                chatId: Number(chatId)
            } as ChatMessage))];

            const groupedMessages = allMessages.reduce((acc: { [key: string]: ChatMessage[] }, msg) => {
                const date = new Date(msg.timestamp).toLocaleDateString();
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(msg);
                return acc;
            }, {});

            const dividers = Object.entries(groupedMessages).map(([date, messages]) => ({ date, messages }));
            setDateDividers(dividers);
        }
    }, [chat, chatId, pendingMessages]);

    const getSenderName = (who: "USER" | "LLM") => {
        return who == "USER"
            ? userName ?? "Loading..."
            : chatInfo?.model ?? "AI";
    };

    const findSenderName = (msg: ChatMessage) => {
        return msg.origin == "USER" ? getSenderName("USER") : getSenderName("LLM");
    };

    const handleSendMessage = () => {
        if (sendMessage.isLoading) return;
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateTicket = () => {
        setIsModalOpen(true);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatDateDivider = (date: string) => {
        const parsedDate = new Date(date);
    
        const formatted = parsedDate.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    
        const todayFormatted = new Date().toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    
        return formatted === todayFormatted ? "Heute" : formatted;
    };
    

    if (isLoading) return (
        <div className="flex justify-center mt-20">
            <ClipLoader color="#22d3ee" size={50} />
        </div>
    );

    return (
        <div className="max-h-full flex flex-col items-center bg-zinc-900 text-white">
            <div className={`overflow-y-auto w-full flex justify-center pb-20 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-red-800`}>
                <div className="w-[80%] p-6 space-y-4 mt-16">
                    {dateDividers.map(({ date, messages }) => (
                        <div key={date}>
                            <div className="flex items-center justify-center my-8">
                                <div className="border-t border-gray-600 w-1/2"></div>
                                <span className="mx-4 text-sm text-gray-400">{formatDateDivider(date)}</span>
                                <div className="border-t border-gray-600 w-1/2"></div>
                            </div>
                            {messages.map((msg) => (
                                <ChatBubble key={msg.id} userName={findSenderName(msg)} message={msg} />
                            ))}
                        </div>
                    ))}
                    {pendingMessages.length > 0 && (
                        <ChatBubble userName={getSenderName("LLM")} message={{ chatId: -1, content: "", origin: "LLM", timestamp: new Date().toISOString() } as ChatMessage} loading />
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
                        className={`bg-blue-600 text-white text-2xl rounded-r-lg cursor-pointer hover:bg-blue-700 ${sendMessage.isLoading ? "p-3" : "p-4"}`}
                        onClick={handleSendMessage}
                    >
                        {sendMessage.isLoading ? <ClipLoader color="#ffffff" size={20} /> : <FaPaperPlane />}
                    </button>
                    {chat && chat.length > 1 && (
                        <>
                            <button
                                className={`bg-indigo-600 ml-6 text-white cursor-pointer text-2xl rounded-lg hover:bg-indigo-700 ${sendMessage.isLoading ? "p-3" : "p-4"}`}
                                onClick={handleCreateTicket}
                                data-tooltip-id="ticket-tooltip"
                                data-tooltip-content="Ticket erstellen"
                            >
                                {sendMessage.isLoading ? <RxCross2 /> : <CiMail />}
                            </button>
                            {!sendMessage.isLoading && <Tooltip id="ticket-tooltip" />}
                            <SummaryModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;