import { OllamaModel } from "../../../types/Ollama.types";
import {
  FaCalendarAlt,
  FaDatabase,
  FaFingerprint,
  FaCheckCircle,
} from "react-icons/fa";
import { formatDate } from "../../../utils/Formatting.utils";

export const ModelInfoDisplay = ({ model }: { model: OllamaModel }) => {
  return (
    <div className="bg-zinc-800 p-6 rounded-xl text-white shadow-md w-full mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center bg-zinc-700 p-4 rounded-lg">
          <FaCalendarAlt className="mr-4 text-cyan-400 text-xl" />
          <div>
            <p className="font-semibold">Letztes Update:</p>
            <p>{formatDate(new Date(model.modified_at).toISOString())}</p>
          </div>
        </div>
        <div className="flex items-center bg-zinc-700 p-4 rounded-lg">
          <FaDatabase className="mr-4 text-cyan-400 text-xl" />
          <div>
            <p className="font-semibold">Größe:</p>
            <p>{model.size.toLocaleString()} Bytes</p>
          </div>
        </div>
        <div className="flex items-center bg-zinc-700 p-4 rounded-lg">
          <FaFingerprint className="mr-4 text-cyan-400 text-xl" />
          <div>
            <p className="font-semibold">Digest:</p>
            <p className="break-all">{model.digest}</p>
          </div>
        </div>
        <div className="flex items-center bg-zinc-700 p-4 rounded-lg">
          <FaCheckCircle className="mr-4 text-cyan-400 text-xl" />
          <div>
            <p className="font-semibold">Funktionen:</p>
            <p className="break-words">{model.capabilities.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};