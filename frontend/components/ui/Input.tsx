import * as React from "react";
import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";

interface searchBarProps {
    searchHint?: string;
    onTextChange?: (inputText: string) => void;
    onSearchLaunch?: (inputText: string) => void;
}

const AuthInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "w-full px-4 py-2 border-b border-gray-300 " +
                    "bg-transparent focus:outline-none focus:border-purple-500",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

const SearchBar = ({
                       searchHint,
                       onTextChange,
                       onSearchLaunch }: searchBarProps) => {
    const [inputText, setInputText] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputText(value);
        if (onTextChange) onTextChange(value);
    };

    const handleKeyDown = () => {
        if (onSearchLaunch) onSearchLaunch(inputText);
    };

    const clearInput = () => {
        setInputText("");
        if (onTextChange) onTextChange("");
    };

    return (
        <label
            className={`relative input input-bordered flex items-center gap-2 px-2 h-10 rounded-xl border border-gray-300 
    transition-all duration-300 ${isFocused ? "w-64" : "w-32"}`}
        >
            <input
                type="text"
                className="grow px-2 py-0.5 pr-8 bg-transparent focus:outline-none"
                placeholder={isFocused ? searchHint : "Search"}
                value={inputText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {inputText ? (
                <button
                    onClick={clearInput}
                    className="absolute right-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <Delete className="w-5 h-5"/>
                </button>
            ) : (
                <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="absolute right-2 h-4 w-4 opacity-70"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </label>
    );
};

AuthInput.displayName = "AuthInput";
SearchBar.displayName = "SearchBar";

export {AuthInput, SearchBar};
