import { HardwareStats } from "../types/System.types";
import { FetchWrapper } from "../utils/FetchWrapper";

export const getHardwareStats = async (): Promise<HardwareStats> => 
    FetchWrapper.get<HardwareStats>('/api/system/resources/getHardwareStats');