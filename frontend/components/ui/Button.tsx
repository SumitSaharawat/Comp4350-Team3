import * as React from "react";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
    onClickFunc: () => void;
}

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
    (
        { className,
            children,
            loading,
            disabled,
            ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={loading || disabled}
                className={cn(
                    "w-full bg-customMirage hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none " +
                    "focus:ring focus:ring-purple-300 disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        Processing...
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);


const HamburgerButton = ({ onClickFunc }: HamburgerButtonProps) => {
    return (
        <button
            className="btn btn-square btn-ghost"
            onClick={() => onClickFunc()} // toggle the side bar
        >
            <svg className="inline-block h-5 w-5 stroke-current">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                ></path>
            </svg>
        </button>
    );
};

AuthButton.displayName = "AuthButton";
HamburgerButton.displayName = "HamburgerButton";

export { AuthButton, HamburgerButton };
