import { FetchWrapper } from "../utils/FetchWrapper";

export const getModels = async (): Promise<string[]> => 
    FetchWrapper.get<string[]>('/api/ollama/getModels');