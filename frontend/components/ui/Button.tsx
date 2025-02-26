import * as React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";


interface HamburgerButtonProps {
    onClickFunc: () => void;
}

const AuthButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "w-full bg-customMirage hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none " +
                    "focus:ring focus:ring-purple-300",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

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

interface FloatingButtonProps {
    toggle: () => void;
}

const FloatingButton = ({ toggle }: FloatingButtonProps) => {
    return (
        <button
            onClick={toggle}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
            <Plus size={24} />
        </button>
    );
};

AuthButton.displayName = "AuthButton";
HamburgerButton.displayName = "HamburgerButton";
FloatingButton.displayName = "FloatingButton";

export { AuthButton, HamburgerButton, FloatingButton };
