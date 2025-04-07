import { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { TfiThought } from "react-icons/tfi";
import ReactMarkdown from "react-markdown";
import { SyncLoader } from "react-spinners";
import { ChatMessage } from "../../../types/Chat.types";
import SimpleDropdownMenu from "../../lib/dropdown/SimpleDropdownMenu";
import { Modal } from "../../lib/modals/Modal";
import { ProfileImage } from "../Profile/ProfileImage";
import { extractButtonFromHtml, extractThoughtProcess } from "../../../utils/Chat.utils";

import rehypeRaw from "rehype-raw";


interface ChatBubbleProps {
    userName: string;
    message: ChatMessage;
    className?: string;
    loading?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    userName,
    className = "",
    message,
    loading = false,
}) => {
    const [thoughtProcess, setThoughtProcess] = useState<string | null>(null);
    const [filteredMessage, setFilteredMessage] = useState<string>(message.content);
    const [extractedButton, setExtractedButton] = useState<{ category: string; title: string; description: string; label: string; } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const thoughtProcess = extractThoughtProcess(message.content);
        const buttonData = extractButtonFromHtml(thoughtProcess.answer);

        setThoughtProcess(thoughtProcess.thoughts);
        if (buttonData) {
            setFilteredMessage(buttonData.cleanedMarkdown);
            setExtractedButton(buttonData);
        } else {
            setFilteredMessage(thoughtProcess.answer);
            setExtractedButton(null);
        }
    }, [message.content]);


    function createTicket(category: string, title: string, description: string) {
        console.log(`[${category}]:`, `${title} - ${description}`);
    }

    function copyToClipboard(close: () => void) {
        navigator.clipboard.writeText(message.content);
        close();
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div key={message.id} className={`mb-4 flex items-top ${message.origin === "USER" ? "justify-end" : "justify-start"} ${className}`}>
            {message.origin !== "USER" && <ProfileImage userName={userName} className="mr-2" />}
            <div className={`p-3 rounded-lg max-w-[70%] ${message.origin === "USER" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}>
                {loading ? (
                    <div className={`px-4 py-3`}>
                        <SyncLoader color="#d8dadd" size={10} speedMultiplier={0.5} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <div className="flex-1 self-center max-w-full overflow-auto break-words">
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{filteredMessage}</ReactMarkdown>
                                {extractedButton && (
                                    <button
                                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded ticket-button"
                                        onClick={() => createTicket(extractedButton.category, extractedButton.title, extractedButton.description)}
                                    >
                                        {extractedButton.label}
                                    </button>
                                )}

                            </div>
                            {message.origin === "LLM" && (
                                <SimpleDropdownMenu
                                    className="self-start"
                                    buttonClassName={"text-gray-400 hover:bg-gray-600"}
                                    options={[
                                        { icon: <GoCopy />, title: "Kopieren", onClick: copyToClipboard },
                                        ...(thoughtProcess ? [{ icon: <TfiThought />, title: "Gedankengang anzeigen", onClick: () => setIsModalOpen(true) }] : [])
                                    ]}
                                />
                            )}
                        </div>
                        <div className={`text-xs ${message.origin === "USER" ? "text-gray-300" : "text-gray-400"} self-end`}>
                            {formatTimestamp(message.timestamp)}
                        </div>
                    </div>
                )}
            </div>
            {message.origin === "USER" && <ProfileImage userName={userName} className="ml-2" />}
            {thoughtProcess && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-lg font-bold mb-2">Gedankengang</h2>
                    <ReactMarkdown>{thoughtProcess}</ReactMarkdown>
                </Modal>
            )}
        </div>
    );
};