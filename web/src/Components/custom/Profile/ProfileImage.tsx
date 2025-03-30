interface ProfileImageProps {
    userName: string;
    onClick?: () => void;
    className?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
    userName,
    onClick,
    className = "",
}) => {
    const generateColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 60%, 50%)`;
        return color;
    };

    const getPointer = () => {
        if(onClick) return "cursor-pointer";
        else return "";
    }

    return (
        <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${getPointer()} ${className}`}
            style={{
                backgroundColor: generateColor(userName)
            }}
            onClick={() => {
                if(onClick) onClick()
            }}
        >
            {userName.charAt(0).toUpperCase()}
        </div>
    );
}