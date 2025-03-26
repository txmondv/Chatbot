import React from "react";

interface NoAPIResponseCardProps {
    className?: string;
}

const NoAPIResponseCard: React.FC<NoAPIResponseCardProps> = ({ className = "" }) => {
    return (
        <div className={`bg-zinc-800 text-white rounded-xl ${className}`}>
            <p className="text-red-300">The API is currently not reachable. Maybe the server shut down?</p>
        </div>
    );
};

export default NoAPIResponseCard;
