import { BiChat, BiStats } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import { useGetUserRoles } from "../../../hooks/Profile.hooks";
import AssistantStats from "../../custom/Dashboard/AssistantStats";
import ServerStatsChart from "../../custom/Dashboard/ServerStatsChart";
import Panel from "../../lib/panels/SimplePanel";
import NoAccessPage from "../lib/NoAccessPage";

export default function DashboardPage() {
  const { data: roles, isLoading } = useGetUserRoles();
  const isAllowed = roles?.includes("TECHNICAL") ?? false;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }

  if (!isAllowed) {
    return <NoAccessPage />;
  }

  return (
    <div className="w-fit max-w-full mx-10 mt-4 flex flex-row justify-start">
      <Panel title={"Ressourcen-Statistiken"} icon={<BiStats />}>
        <ServerStatsChart />
      </Panel>
      <Panel title={"Chatbot-Statistiken"} icon={<BiChat />} className={`ml-4`}>
        <AssistantStats />
      </Panel>
    </div>

  );
}
