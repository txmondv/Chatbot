import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getChatById } from "../../../service/Chat.service";
import { Chat, ChatMessage } from "../../../types/Chat.types";

interface SearchBarProps {
    chats: Chat[] | undefined;
    searchDropdownRef: React.RefObject<HTMLDivElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ chats, searchDropdownRef }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<
        { chat: Chat; context: { message: ChatMessage; highlighted: string }[] }[]
    >([]);
    const navigate = useNavigate();
    const [searchActive, setSearchActive] = useState(false);

    const chatMessages = useMemo(() => {
        if (!chats) return {};
        const messages: { [chatId: number]: ChatMessage[] } = {};
        if (chats) {
            chats.forEach(async (chat) => {
                const result = await getChatById(chat.id);
                messages[chat.id] = result;
            });
        }
        return messages;
    }, [chats]);

    useEffect(() => {
        if (!chats) return;

        const results: { chat: Chat; context: { message: ChatMessage; highlighted: string }[] }[] = [];
        chats.forEach(async (chat) => {
            const messages = await chatMessages[chat.id] || [];
            const chatTitleMatch = chat.title.toLowerCase().includes(searchTerm.toLowerCase());
            let messageMatchFound = false;

            const messageMatches = messages
                .filter((message) => message.content.toLowerCase().includes(searchTerm.toLowerCase()) && !messageMatchFound)
                .map((message) => {
                    messageMatchFound = true;
                    const index = message.content.toLowerCase().indexOf(searchTerm.toLowerCase());
                    const start = Math.max(0, index - 20);
                    const end = Math.min(message.content.length, index + searchTerm.length + 20);
                    const context = message.content.substring(start, end);
                    const highlighted = context.replace(
                        new RegExp(searchTerm, "gi"),
                        (match) => `<span class="bg-blue-400 text-white">${match}</span>`
                    );
                    return { message, highlighted };
                });

            if (chatTitleMatch || messageMatches.length > 0) {
                results.push({ chat, context: messageMatches.slice(0, 1) }); // Nur das erste Ergebnis
            }
        });
        setSearchResults(results);
    }, [searchTerm, chats, chatMessages]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchActive &&
                searchDropdownRef.current &&
                !searchDropdownRef.current.contains(event.target as Node)
            ) {
                setSearchActive(false);
                setSearchTerm("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchActive, searchDropdownRef]);

    return (
        <>
            <input
                type="text"
                placeholder="Chats durchsuchen..."
                className="w-1/3 px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchActive(true);
                }}
            />
            {searchActive && (
                <div
                    ref={searchDropdownRef}
                    className="absolute top-14 left-6 w-1/3 bg-zinc-800 rounded-lg shadow-lg p-4 z-20"
                >
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <div
                                key={result.chat.id}
                                className="p-2 pl-4 mb-2 rounded-md bg-zinc-700 cursor-pointer"
                                onClick={() => {
                                    navigate(`/chats/${result.chat.id}`);
                                    setSearchActive(false);
                                    setSearchTerm("");
                                }}
                            >
                                <h3 className="text-lg font-semibold text-white">{result.chat.title}</h3>
                                {result.context.map((contextItem, index) => (
                                    <p
                                        key={index}
                                        className="text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: contextItem.highlighted }}
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">Keine Ergebnisse gefunden.</p>
                    )}
                </div>
            )}
        </>
    );
};

export default SearchBar;