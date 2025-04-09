export interface OllamaModel {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    modelfile?: string;
    parameters?: string;
    template?: string;
    details?: Record<string, unknown>;
    model_info: Record<string, unknown>;
    capabilities: string[];
};