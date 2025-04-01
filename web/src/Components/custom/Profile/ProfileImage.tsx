interface ProfileImageProps {
    userName: string;
    onClick?: () => void;
    className?: string;
    size?: number;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
    userName,
    onClick,
    className = "",
    size = 40
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
            className={`flex items-center justify-center rounded-full select-none ${getPointer()} ${className}`}
            style={{
                backgroundColor: generateColor(userName),
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${size * 0.4}px`
            }}
            onClick={() => {
                if(onClick) onClick()
            }}
        >
            {userName.charAt(0).toUpperCase()}
        </div>
    );
}