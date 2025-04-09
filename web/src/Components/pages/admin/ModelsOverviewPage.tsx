import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { getModels, getModelInfo } from "../../../service/Ollama.service";
import { AiOutlineCalendar, AiOutlineDatabase, AiOutlineInfoCircle } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { OllamaModel } from "../../../types/Ollama.types";
import { formatDate } from "../../../utils/Formatting.utils";

const ModelsOverviewPage = () => {
    const navigate = useNavigate();

    const { data: models, isLoading: modelsLoading, isError: modelsError } = useQuery<string[]>({
        queryKey: ["models"],
        queryFn: getModels,
    });

    const { data: modelInfo, isLoading: modelInfoLoading, isError: modelInfoError } = useQuery<{ [key: string]: OllamaModel }>({
        queryKey: ["modelInfo"],
        queryFn: async () => {
            if (!models) return {};
            const infoPromises = models.map(async (modelName) => {
                const info = await getModelInfo(modelName);
                return { [modelName]: info };
            });
            const infoResults = await Promise.all(infoPromises);
            return infoResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        },
        enabled: !!models,
    });

    if (modelsLoading || modelInfoLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#ffffff" size={50} />
            </div>
        );
    }

    if (modelsError || modelInfoError) {
        return <div className="text-white text-center">Fehler beim Laden der Modelle.</div>;
    }

    return (
        <div className="min-h-full flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold text-white mt-4 mb-8">Verfügbare Modelle</h1>
            <div className="w-full max-w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models?.map((modelName) => (
                    <div
                        key={modelName}
                        className="p-4 bg-gray-700 rounded-lg text-white hover:bg-gray-600 cursor-pointer shadow-lg transition-shadow duration-300 hover:shadow-xl"
                        onClick={() => navigate(`/model/${modelName}`)}
                        style={{ boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)' }}
                    >
                        <div className="flex flex-col">
                            <div className="text-lg font-bold mb-2">
                                {modelName}
                            </div>
                            {modelInfo && modelInfo[modelName] && (
                                <div className="text-sm text-gray-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AiOutlineCalendar /> {formatDate(new Date(modelInfo[modelName].modified_at).toISOString())}
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <AiOutlineDatabase /> {modelInfo[modelName].size.toLocaleString()} Bytes
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AiOutlineInfoCircle /> {modelInfo[modelName].digest.substring(0, 10)}...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelsOverviewPage;