import { IoRadio } from "react-icons/io5";
import GridLayoutComponent from "../lib/layout/DynamicGrid";
import Panel from "../lib/panels/SimplePanel";

export default function DashboardPage() {
  return (
    <GridLayoutComponent>
      <Panel title={"Status"} icon={<IoRadio />}>
        <p>Hallo </p>
      </Panel>
    </GridLayoutComponent>
  );
}
