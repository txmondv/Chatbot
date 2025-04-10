import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Select, { MultiValue } from "react-select";
import makeAnimated from "react-select/animated";
import { User } from "../../../../types/User.types";
import { statusLabels } from "../../../../utils/Ticket.util";

const animatedComponents = makeAnimated();

interface TicketHeaderProps {
  title: string;
  category: string;
  creator: string;
  availableCategories: string[];
  supporters: number[];
  allSupporters: User[];
  status: string;
  onEdit: () => void;
  onDelete: () => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onAddSupporter: (id: number) => void;
  onRemoveSupporter: (id: number) => void;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({
  title,
  category,
  availableCategories,
  creator,
  supporters,
  allSupporters,
  status,
  onEdit,
  onDelete,
  onCategoryChange,
  onStatusChange,
  onAddSupporter,
  onRemoveSupporter,
}) => {
  const supporterOptions = allSupporters.map((s) => ({
    value: s.userId,
    label: s.username,
  }));

  const selectedSupporters = supporterOptions.filter((opt) =>
    supporters.includes(opt.value)
  );

  const handleSupporterChange = (
    selected: MultiValue<{ value: number; label: string }> | null
  ) => {
    const selectedArray = selected ?? [];
    const newIds = selectedArray.map((s) => s.value);
    const added = newIds.filter((id) => !supporters.includes(id));
    const removed = supporters.filter((id) => !newIds.includes(id));
  
    added.forEach((id) => onAddSupporter(id));
    removed.forEach((id) => onRemoveSupporter(id));
  }; 


  return (
    <div className="flex flex-col gap-4 border-b border-zinc-700 pb-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 bg-cyan-400 text-zinc-900 px-3 py-1 rounded hover:bg-cyan-300 transition"
          >
            <FiEdit /> Bearbeiten
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition"
          >
            <FiTrash2 /> Löschen
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-2 text-sm text-zinc-400">
        <label className="flex items-center gap-2">
          Kategorie:
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Status:
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-white"
          >
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 min-w-[250px]">
          Bearbeiter:
          <div className="w-full">
            <Select
              isMulti
              closeMenuOnSelect={false}
              components={animatedComponents}
              options={supporterOptions}
              value={selectedSupporters}
              onChange={(value) => handleSupporterChange(value as MultiValue<{ value: number; label: string }>)}
              placeholder="Bearbeiter auswählen..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#18181b",
                  borderColor: "#3f3f46",
                  color: "white",
                  minHeight: "32px",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#18181b",
                  color: "white",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#3f3f46",
                  color: "white",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "white",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#27272a" : "#18181b",
                  color: "white",
                  cursor: "pointer",
                }),
                input: (base) => ({
                  ...base,
                  color: "white",
                }),
              }}
            />
          </div>
        </label>
      </div>
      <div className="text-sm text-gray-400">Ersteller: {creator}</div>
    </div>
  );
};

export default TicketHeader;
