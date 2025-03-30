import { useMutation, useQuery, useQueryClient } from "react-query";
import { Chat, ChatMessage } from "../types/Chat.types";
import { createChat, getChatById, getChatInfo, getChats, sendMessage } from "../service/Chat.service";

export const useChats = () => {
    return useQuery<Chat[]>({ queryKey: ["chats"], queryFn: getChats });
};

export const useChat = (chatId: number) => {
    return useQuery<ChatMessage[]>({ queryKey: ["chat", chatId], queryFn: () => getChatById(chatId) });
};

export const useChatInfo = (chatId: number) => {
    return useQuery<Chat>({ queryKey: ["chatInfo", chatId], queryFn: () => getChatInfo(chatId) });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, content }: { chatId: number; content: string }) => {
            return sendMessage(chatId, content);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["chat", variables.chatId]);
        }
    });
};

export const useCreateChat = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (model: string) => createChat(model),
        onSuccess: () => {
            queryClient.invalidateQueries(["chats"]);
        }
    });
};