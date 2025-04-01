import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getHardwareStats } from "../../../service/System.service";
import NoAPIResponseCard from "../../lib/cards/NoAPIResponseCard";
import SimpleCard from "../../lib/cards/SimpleCard";

interface HardwareStatsHistory {
    time: string;
    ProcessCPU: number;
    SystemMemory: number;
    SystemSwap: number;
    SystemDisk: number;
}

const formatUptime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    const days = Math.floor((seconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (months > 0) return `${months} month${months > 1 ? "s" : ""}, ${days} day${days > 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}, ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
};


const ServerStatsChart = () => {
    const [history, setHistory] = useState<HardwareStatsHistory[]>([]);
    const { data, error } = useQuery({
        queryKey: ["hardwareStats"],
        queryFn: getHardwareStats,
        refetchInterval: 5000,
    });

    useEffect(() => {
        if (data) {
            setHistory((prev: HardwareStatsHistory[]) => {
                const SystemMemoryPercent = (((data.totalMemoryMiB - data.freeMemoryMiB) / data.totalMemoryMiB) * 100).toFixed(2);
                const SystemSwapPercent = (((data.totalSwapMiB - data.freeSwapMiB) / data.totalSwapMiB) * 100).toFixed(2);
                const SystemDiskPercent = (((data.totalDiskSpaceMiB - data.freeDiskSpaceMiB) / data.totalDiskSpaceMiB) * 100).toFixed(2);

                const newEntry: HardwareStatsHistory = {
                    time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                    ProcessCPU: Number(data.processCPUUsage.toFixed(2)),
                    SystemMemory: Number(SystemMemoryPercent),
                    SystemSwap: Number(SystemSwapPercent),
                    SystemDisk: Number(SystemDiskPercent),
                };
                return [...prev.slice(-9), newEntry];
            });
        }
    }, [data]);

    if (error) return <NoAPIResponseCard />;
    if(!data) return <></>;

    return (
        <SimpleCard>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                    <XAxis dataKey="time" stroke="#ccc" />
                    <YAxis stroke="#ccc" domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                        formatter={(value, name) => {
                            return [`${value}%`, name];
                        }}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <Line type="monotone" dataKey="ProcessCPU" stroke="#ff7300" strokeWidth={2} />
                    <Line type="monotone" dataKey="SystemMemory" stroke="#00c4ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="SystemSwap" stroke="#32cd32" strokeWidth={2} />
                    <Line type="monotone" dataKey="SystemDisk" stroke="#ff0000" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-white">
                <h5 className="font-bold my-2">System-Ressourcen</h5>
                <table className="w-full border-collapse border border-gray-700 text-sm">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border border-gray-700 p-2">Ressource</th>
                            <th className="border border-gray-700 p-2">Gesamt (MiB)</th>
                            <th className="border border-gray-700 p-2">Genutzt (MiB)</th>
                            <th className="border border-gray-700 p-2">Frei (MiB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.totalMemoryMiB && data?.freeMemoryMiB && (
                            <tr>
                                <td className="border border-gray-700 p-2">Arbeitsspeicher (RAM)</td>
                                <td className="border border-gray-700 p-2">{data.totalMemoryMiB}</td>
                                <td className="border border-gray-700 p-2">{(data.totalMemoryMiB - data.freeMemoryMiB).toFixed(0)}</td>
                                <td className="border border-gray-700 p-2">{data.freeMemoryMiB}</td>
                            </tr>
                        )}
                        {data?.totalSwapMiB && data?.freeSwapMiB && (
                            <tr>
                                <td className="border border-gray-700 p-2">Swap-RAM</td>
                                <td className="border border-gray-700 p-2">{data.totalSwapMiB}</td>
                                <td className="border border-gray-700 p-2">{(data.totalSwapMiB - data.freeSwapMiB).toFixed(0)}</td>
                                <td className="border border-gray-700 p-2">{data.freeSwapMiB}</td>
                            </tr>
                        )}
                        {data?.totalDiskSpaceMiB && data?.freeDiskSpaceMiB && (
                            <tr>
                                <td className="border border-gray-700 p-2">Speicherplatz</td>
                                <td className="border border-gray-700 p-2">{data.totalDiskSpaceMiB}</td>
                                <td className="border border-gray-700 p-2">{(data.totalDiskSpaceMiB - data.freeDiskSpaceMiB).toFixed(0)}</td>
                                <td className="border border-gray-700 p-2">{data.freeDiskSpaceMiB}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="mt-4 font-bold">Der Chatbot-Server läuft seit {formatUptime(data?.systemUptimeSeconds || 0)}</div>
            </div>
        </SimpleCard>
    );
};

export default ServerStatsChart;
