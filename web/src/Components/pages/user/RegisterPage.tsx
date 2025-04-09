import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { MdPersonAddAlt1 } from "react-icons/md";
import { useNavigate } from "react-router";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../../custom/Authentication/AuthProvider";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, login } = useAuth();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const registerResponse = await register(username, password);
      if (!registerResponse.success) {
        setErrorMessage(registerResponse.message);
        return;
      }

      const loginResponse = await login(username, password);
      if (loginResponse) {
        setErrorMessage(loginResponse);
        return;
      }

      setErrorMessage(null);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message)
      else alert("An unexpected error occurred");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-full bg-zinc-900">
      <div className="flex flex-col justify-center items-center text-center w-[80%] md:w-[50%] h-[70%] bg-zinc-800 shadow-2xl rounded-3xl p-8">
        <MdPersonAddAlt1 className="text-cyan-300 text-6xl md:text-9xl mb-8 shadow-lg rounded-full p-4 bg-zinc-700" />
        <h1 className="text-3xl text-white mb-4 font-semibold">Registrieren</h1>

        <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
          <div className="relative group">
            <input
              className="block w-full p-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FiInfo
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-cyan-400 cursor-pointer"
              id="username-tooltip"
            />
            <Tooltip anchorSelect="#username-tooltip" place="top">
              Gib deinen Nutzernamen ein.
            </Tooltip>
          </div>

          <div className="relative group">
            <input
              className="block w-full p-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FiInfo
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-cyan-400 cursor-pointer"
              id="password-tooltip"
            />
            <Tooltip place="top" />
            <Tooltip anchorSelect="#password-tooltip" place="top">
              Gib dein Passwort ein.
            </Tooltip>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400 my-4">
              {errorMessage}
            </p>
          )}

          <button
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="submit"
          >
            Registrieren
          </button>
        </form>

        <p className="text-sm text-zinc-400 mt-4">
          Du hast schon ein Konto?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-500">
            Melde dich hier an
          </a>
        </p>
      </div>
    </div>
  );
}
