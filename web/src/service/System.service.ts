import { HardwareStats } from "../types/System.types";
import { FetchWrapper } from "../utils/FetchWrapper";

export const getHardwareStats = async (): Promise<HardwareStats> => 
    FetchWrapper.get<HardwareStats>('/api/system/resources/getHardwareStats');

export const getAssistantRequests = async (): Promise<number> => 
    FetchWrapper.get<number>('/api/system/stats/getAssistantRequests');

export const getAverageResponseTime = async (): Promise<number> => 
    FetchWrapper.get<number>('/api/system/stats/getAverageResponseTime');