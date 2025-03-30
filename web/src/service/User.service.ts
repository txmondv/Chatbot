import { FetchWrapper } from "./FetchWrapper";

export const getUsername = async (): Promise<string> => FetchWrapper.get<string>("/api/users/info/getUsername");