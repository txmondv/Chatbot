export interface Chat {
    id: number,
    model: string,
    title: string,
    username: string,
    creationDate: string,
    messageCount: number,
    lastMessageAt: string
}

export interface ChatMessage {
    id: number;
    chatId: number;
    origin: "USER" | "LLM";
    content: string;
    timestamp: string;
}

export interface ChatSummary {
    category: string;
    title: string;
    summary: string;
}