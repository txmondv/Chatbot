import { ReactNode } from "react";
import { Tooltip } from "react-tooltip";

interface AssistantStatCardProps {
    icon: ReactNode;
    statValue: ReactNode;
    tooltip?: string;
    id?: string;
}

const hashString = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return `tooltip-${Math.abs(hash)}`;
};

export const AssistantStatCard: React.FC<AssistantStatCardProps> = ({ icon, statValue, tooltip, id }) => {
    const finalId = id ?? (tooltip ? hashString(tooltip) : "no-tooltip");

    return (
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-cyan-900/20 text-cyan-400">
                <div className="text-3xl" id={`${finalId}`}>
                    {icon}
                </div>
                {tooltip && (
                    <Tooltip anchorSelect={`#${finalId}`} place="top">
                        {tooltip}
                    </Tooltip>
                )}
            </div>
            <div className="text-4xl font-bold text-cyan-400 animate-in fade-in zoom-in duration-300">
                {statValue}
            </div>
        </div>
    );
};
