import { CiLogout } from "react-icons/ci";
import { useAuth } from "../custom/Authentication/AuthProvider";
import { useEffect } from "react";

export default function LogoutPage() {
    const { logout } = useAuth();
    useEffect(() => logout(), [logout])

    return (
        <div className="flex items-center justify-center h-screen w-full bg-zinc-900">
            <div className="flex flex-col justify-center items-center text-center w-[80%] md:w-[50%] h-[70%] bg-zinc-700 shadow-2xl rounded-3xl p-8">
                <CiLogout className="text-cyan-300 text-6xl md:text-9xl mb-4" />
                <h1 className="text-5xl md:text-8xl font-bold text-gray-50">Tschüss!</h1>
                <p className="text-xl md:text-2xl pt-4 text-gray-300">Du wirst jetzt abgemeldet. Solltest du diese Seite länger als ein paar Sekunden sehen, melde diesen Fehler bitte.</p>
                <a href="/login" className="mt-12 text-blue-400 hover:text-blue-500">
                    Melde dich hier wieder an.
                </a>
            </div>
        </div>
    );
}
