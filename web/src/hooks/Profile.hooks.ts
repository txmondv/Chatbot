import { useQuery } from "react-query";
import { getUsername } from "../service/User.service";

export const useGetUsername = () => {
    return useQuery<string>({
        queryKey: "getUserName",
        queryFn: getUsername,
        initialData: "Loading..."
    });
};