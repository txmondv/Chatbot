import { FiActivity } from "react-icons/fi";
import { useQuery } from "react-query";
import { getAssistantRequests, getAverageResponseTime } from "../../../service/System.service";
import NoAPIResponseCard from "../../lib/cards/NoAPIResponseCard";
import SimpleCard from "../../lib/cards/SimpleCard";
import { AssistantStatCard } from "./AssistantStatCard";
import { BiHistory } from "react-icons/bi";


const AssistantStats = () => {
    const { data: assistantRequests, error: assistantRequestsError } = useQuery({
        queryKey: ["assistantRequests"],
        queryFn: getAssistantRequests,
        refetchInterval: 5000,
    });

    const { data: averageResponseTime, error: averageResponseTimeError } = useQuery({
        queryKey: ["assistantResponseTime"],
        queryFn: getAverageResponseTime,
        refetchInterval: 5000,
    });

    if (assistantRequestsError && averageResponseTimeError) return <NoAPIResponseCard />;
    if (!assistantRequests && !averageResponseTime) return <></>;

    return (
        <SimpleCard className="flex items-center flex-col justify-center p-6 bg-zinc-800 rounded-2xl transition-all duration-500 space-y-6">
            <AssistantStatCard icon={<FiActivity />} statValue={assistantRequests} tooltip={"Anfragen an den Chatbot (gesamt)"} />
            <AssistantStatCard icon={<BiHistory />} statValue={averageResponseTime?.toFixed(0) + "ms"} tooltip={"Durchschnittliche Antwortzeit des Chatbots (seit Start)"} />
        </SimpleCard>
    );
};

export default AssistantStats;
