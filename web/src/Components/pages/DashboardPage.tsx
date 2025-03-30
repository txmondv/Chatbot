import { BiStats } from "react-icons/bi";
import ServerStatsChart from "../custom/Dashboard/ServerStatsChart";
import GridLayoutComponent from "../lib/layout/DynamicGrid";
import Panel from "../lib/panels/SimplePanel";

export default function DashboardPage() {
  return (
    <GridLayoutComponent>
      <Panel title={"Ressourcen-Statistiken"} icon={<BiStats />}>
        <ServerStatsChart />
      </Panel>
    </GridLayoutComponent>
  );
}
