import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router";
import { OllamaModel } from "../../../types/Ollama.types";
import { getModelInfo, getModels } from "../../../service/Ollama.service";
import { ModelInfoDisplay } from "../../custom/Ollama/ModelInfoDisplay";
import { CollapsibleViewer } from "../../lib/panels/CollapsibleViewer";
import { ModelInfoTable } from "../../custom/Ollama/ModelInfoTable";
import InvalidParamsPage from "../lib/InvalidParamsPage";
import ServerErrorPage from "../lib/ServerErrorPage";
import { useState } from "react";

const OllamaModelPage = () => {
  const { modelName } = useParams<{ modelName: string }>();

  const [enableQuery, setEnableQuery] = useState<boolean>(false);

  const { data: models, isLoading: modelsLoading, isError: modelsError } = useQuery<string[]>({
    queryKey: ["models"],
    queryFn: getModels,
    onSuccess: (models) => {
      if(!modelName) return;
      setEnableQuery(models.includes(modelName));
    }
  });

  const { data: model, isLoading: modelLoading } = useQuery<OllamaModel>({
    queryKey: ["chat", modelName],
    queryFn: () => getModelInfo(modelName || ""),
    enabled: enableQuery,
    refetchOnWindowFocus: false
  });

  if (modelsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }

  if (modelsError) {
    return <ServerErrorPage message="Fehler beim Laden der Modelle." />;
  }

  if (!modelName || modelName === "" || !models?.includes(modelName)) {
    return <InvalidParamsPage message={<p>Unbekanntes Modell: <code>{modelName}</code> <br /><br /> Verfügbare Modelle: {models?.join(", ")}</p>} />;
  }


  if (modelLoading || !model) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-full text-white w-full">
      <h1 className="text-3xl font-bold mb-6">{model.name}</h1>
      <ModelInfoDisplay model={model} />
      <CollapsibleViewer title="Modelfile" content={model.modelfile} />
      <CollapsibleViewer title="Template" content={model.template} />
      <CollapsibleViewer title="Parameters" content={model.parameters} />
      <ModelInfoTable modelInfo={model.model_info} />
    </div>
  );
};

export default OllamaModelPage;