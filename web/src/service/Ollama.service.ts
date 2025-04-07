import { OllamaModel } from "../types/Ollama.types";
import { FetchWrapper } from "../utils/FetchWrapper";

export const getModels = async (): Promise<string[]> => 
    FetchWrapper.get<string[]>('/api/ollama/getModels');

export const getModelInfo = async (modelName: string): Promise<OllamaModel> => 
    FetchWrapper.get<OllamaModel>(`/api/ollama/modelInfo/${modelName}`);