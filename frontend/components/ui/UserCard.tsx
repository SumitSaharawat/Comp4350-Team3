
import Image from "next/image";
import {JSX} from "react";

interface UserCardProps {
    username: string
}

export default function UserCard({
    username

} : UserCardProps){
    return (
        <div className="flex items-center gap-3 p-2 bg-transparent rounded-2xl shadow-md shadow-gray-500 border border-gray-400">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                    src="/user_icon.png"
                    alt="User Avatar"
                    width={35}
                    height={35}
                    className="object-cover"
                />
            </div>

            {/* Text info */}
            <div className="flex-1">
                <p className="text-2xl font-semibold text-foreground">{username}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Personal account</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 ml-1 rounded-md font-medium">
                        Free Trial
                    </span>
                </div>
            </div>

        </div>
    );
}
