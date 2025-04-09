import { useState } from "react";

export const ModelInfoTable = ({ modelInfo }: { modelInfo: Record<string, unknown> }) => {
    const [filter, setFilter] = useState("");
  
    const entries = Object.entries(modelInfo || {}).filter(([key]) =>
      key.toLowerCase().includes(filter.toLowerCase())
    );
    
    return (
      <div className="bg-zinc-800 p-4 rounded-xl text-white">
        <h2 className="text-xl font-semibold mb-4">Modellinformationen</h2>
        <div className="flex justify-between mb-2">
          <input
            className="bg-zinc-900 text-white px-2 py-1 rounded border border-zinc-700"
            placeholder="Filter keys..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400">
                <th className="text-left pb-1">Key</th>
                <th className="text-left pb-1">Value</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key} className="border-t border-zinc-700">
                  <td className="py-1 pr-4 align-top text-zinc-300">{key}</td>
                  <td className="py-1 text-zinc-100 break-all">
                    {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };