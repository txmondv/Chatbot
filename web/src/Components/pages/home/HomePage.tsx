import { useState } from "react";
import { useNavigate } from "react-router";
import { FaComments, FaTicketAlt } from "react-icons/fa";

const HomePage = () => {
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (side: "left" | "right") => {
    setSelected(side);
  };

  const handleGo = () => {
    if (selected === "left") navigate("/chats");
    else if (selected === "right") navigate("/tickets");
  };

  const GRADIENT_CLASSES_MAP = {
    default: "from-purple-500/10 via-indigo-500/10",
    left: "from-cyan-500/10 via-green-500/10",
    right: "from-green-500/10 via-cyan-500/10",
  };

  const GLOW_CLASSES = {
    left: "hover:shadow-[0_0_35px_5px_rgba(34,197,94,0.4)] hover:border-green-400",
    right: "hover:shadow-[0_0_35px_5px_rgba(34,211,238,0.4)] hover:border-cyan-400",
  };

  const getGradientClasses = () => {
    if (!selected) return GRADIENT_CLASSES_MAP.default;
    return GRADIENT_CLASSES_MAP[selected];
  };

  return (
    <div className="bg-zinc-900 text-white min-h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      {/* Uniform Bottom Gradient Background */}
      <div className="absolute bottom-0 left-0 right-0 h-[80%] pointer-events-none z-0 transition-all">
        <div
          key={selected}
          className={`absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t ${getGradientClasses()} to-transparent`}
        />

      </div>


      {/* Top Section */}
      <section className="w-[80%] h-1/2 flex flex-col justify-center items-center z-10">
        <h1 className="text-4xl font-bold mb-4 text-center">IT-Solutions</h1>
        <p className="text-lg text-zinc-400 text-center mb-8 max-w-2xl">
          Herzlich Willkommen beim Support der IT-Solutions GmBH! Wir helfen dir gerne bei jeglichen technischen Problemen rund um deinen Arbeitsplatz.
          Wähle dazu eine Kontaktmethode aus:
        </p>
        <div className="flex justify-center items-center gap-6 w-full">
          {(["left", "right"] as const).map((side) => (
            <div
              key={side}
              onClick={() => handleCardClick(side)}
              className={`
                  flex-1 h-48 rounded-2xl bg-zinc-800 p-6 cursor-pointer transition-all duration-300 
                  border border-transparent flex flex-col items-center justify-center text-center gap-2 
                  ${GLOW_CLASSES[side]} ${selected === side ? `ring-2 ${GLOW_CLASSES[side].split(" ").find(c => c.startsWith("ring-"))}` : ""}
              `}
            >
              {side === "left" ? (
                <FaComments className="text-3xl text-green-400" />
              ) : (
                <FaTicketAlt className="text-3xl text-cyan-400" />
              )}
              <h2 className="text-2xl font-semibold mt-2">
                {side === "left" ? "Chats" : "Tickets"}
              </h2>
              <p className="text-zinc-400">
                {side === "left"
                  ? "Löse deine Probleme eigenständig mit Hilfe unseres KI-Assistenten."
                  : "Kontakt mit unserem IT-Team."}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Bottom Info Section */}
      <section className="w-[80%] h-1/2 bg-zinc-800 rounded-2xl p-6 shadow-inner flex flex-col justify-between z-10">
        <div className="overflow-y-auto flex-grow mb-4">
          {selected === null && (
            <p className="text-zinc-400 text-center my-4 items-center">Klicke auf eine Karte, um mehr Informationen zu erhalten.</p>
          )}
          {selected === "left" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Chats</h3>
              <p className="text-zinc-300">
                Hier kannst du mit unserem KI-Assistenten chatten und dein Problem somit eventuell eigenständig lösen. Solltest du dennoch Hilfe benötigen - kein Problem: Du kannst aus einem Chat heraus
                direkt ein Ticket erstellen und sparst dir somit die lästige Schreibarbeit. Außerdem hilfst du unserem IT-Team bei der Arbeit :)<br />
                <small className="mt-4">Um ein Ticket aus einem Chat heraus zu erstellen, nutze den Knopf rechts neben der Chatleiste.</small>
              </p>
            </div>
          )}
          {selected === "right" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Tickets</h3>
              <p className="text-zinc-300">
                Hier kannst du deine erstellten/offenen Tickets und deren Status einsehen. Anfragen, welche du per Ticket einreichts werden von unserem IT-Team bearbeitet, weshalb hier längere Wartezeiten anfallen können.
                Du kannst alternativ das Chat-Feature nutzen, um dein Problem entweder direkt mithilfe unseres KI-Assistenten zu lösen oder aus dem Chat heraus ein Ticket erstellen. Das Hilft unserem IT-Team dabei, dein
                Problem besser zu verstehen und schneller zu lösen! :)
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          {selected && (
            <button
              onClick={handleGo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition cursor-pointer"
            >
              Los geht's!
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;