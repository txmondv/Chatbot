import { Chat, ChatMessage, ChatSummary } from "../types/Chat.types";
import { FetchWrapper } from "../utils/FetchWrapper";

export const getChats = async (): Promise<Chat[]> => 
    FetchWrapper.get<Chat[]>("/api/chats");

export const getChatInfo = async (chatId: number): Promise<Chat> => 
    FetchWrapper.get<Chat>(`/api/chats/${chatId}`);

export const getChatById = async (chatId: number): Promise<ChatMessage[]> => 
    FetchWrapper.get<ChatMessage[]>(`/api/chats/${chatId}/history`);

export const sendMessage = async (chatId: number, content: string): Promise<ChatMessage> => 
    FetchWrapper.post<ChatMessage>(`/api/chats/${chatId}/message`, { message: content });

export const createChat = async (model: string): Promise<Chat> => 
    FetchWrapper.post<Chat>('/api/chats/start', { model: model });

export const setChatTitle = async (chatId: number, title: string): Promise<Chat> => 
    FetchWrapper.patch<Chat>(`/api/chats/${chatId}/setTitle`, { title: title });

export const deleteChat = async (chatId: number): Promise<void> => 
    FetchWrapper.delete<void>(`/api/chats/${chatId}/delete`);

export const deleteAllChats = async (): Promise<void> => 
    FetchWrapper.delete<void>(`/api/chats/deleteAllChats`);

export const getSummary = async (chatId: number): Promise<ChatSummary> => 
    FetchWrapper.get<ChatSummary>(`/api/chats/${chatId}/getSummary`);