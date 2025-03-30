import { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { TfiThought } from "react-icons/tfi";
import ReactMarkdown from "react-markdown";
import { SyncLoader } from "react-spinners";
import { ChatMessage } from "../../../types/Chat.types";
import SimpleDropdownMenu from "../../lib/dropdown/SimpleDropdownMenu";
import { Modal } from "../../lib/modals/Modal";
import { ProfileImage } from "../Profile/ProfileImage";
import { extractThoughtProcess } from "../../../utils/Chat.utils";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const thoughtProcess = extractThoughtProcess(message.content);

        setThoughtProcess(thoughtProcess.thoughts);
        setFilteredMessage(thoughtProcess.answer);
    }, [message.content]);

    function copyToClipboard(close: () => void) {
        navigator.clipboard.writeText(message.content);
        close();
    }

    return (
        <div key={message.id} className={`flex items-top ${message.origin === "USER" ? "justify-end" : "justify-start"} ${className}`}>
            {message.origin !== "USER" && <ProfileImage userName={userName} className="mr-2" />}
            <div className={`p-3 rounded-lg max-w-[70%] ${message.origin === "USER" ? "bg-blue-600 self-end" : "bg-gray-700 self-start"}`}>
                {loading ? (
                    <div className={`px-4 py-3`}>
                        <SyncLoader color="#d8dadd" size={10} speedMultiplier={0.5} />
                    </div>
                ) : (
                    <div className="flex flex-row gap-2">
                        <div className="flex-1 self-center max-w-full overflow-auto break-words">
                            <ReactMarkdown>{filteredMessage}</ReactMarkdown>
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
