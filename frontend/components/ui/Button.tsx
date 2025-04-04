/**
 * Buttons used by the app
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCheck, Check, Bell, BellDot } from "lucide-react";

interface HamburgerButtonProps {
    onClickFunc: () => void;
}

interface AuthButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

interface FilterButtonProps {
    filterName: string;
    filterOptions: string[];
    onSelectOption?: (selectedOptions: string[]) => void;
}

interface DropDownButtonProps {
    dropDownName: string;
    dropDownList?: string[];
    onSelectDropdown?: (item: string) => void;
}

interface CheckButtonProps {
    onClickFunc: () => void;
    checked?: boolean;
}

interface notificationButtonProps {
    onClickFunc: () => void;
    empty: boolean;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
    ({ className, children, loading, disabled, ...props }, ref) => {
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
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
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

interface FloatingButtonProps {
    toggle: () => void;
}

const FloatingButton = ({ toggle }: FloatingButtonProps) => {
    return (
        <button
            onClick={toggle}
            className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg
            hover:bg-blue-700 transition-all transform hover:scale-105"
        >
            + New
        </button>
    );
};

// filter Name: what to display on the button, filter options: what's in the list, on select options: functions to execute when selected
const FilterButton = ({
    filterName,
    filterOptions,
    onSelectOption,
}: FilterButtonProps) => {
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleSelection = (item: string) => {
        let updatedSelection;
        if (selectedOptions.includes(item)) {
            updatedSelection = selectedOptions.filter((i) => i !== item);
        } else {
            updatedSelection = [...selectedOptions, item];
        }

        setSelectedOptions(updatedSelection);
        if (onSelectOption) onSelectOption(updatedSelection);
    };

    return (
        <div className="relative ml-10">
            <button
                className="flex items-center gap-1 text-foreground font-bold focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {filterName}{" "}
                <span
                    className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    ⌄
                </span>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <ul className="absolute left-0 mt-3 w-52 bg-black/80 rounded-lg shadow-md p-2 z-10">
                    {filterOptions.map((d) => (
                        <li key={d} className="py-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(d)}
                                    onChange={() => toggleSelection(d)}
                                    className="checkbox checkbox-error"
                                />
                                {d}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// similar to filter button
const DropDownButton = ({
    dropDownName,
    dropDownList,
    onSelectDropdown,
}: DropDownButtonProps) => {
    return (
        <details className="dropdown">
            <summary className="btn m-1">{dropDownName}</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {dropDownList
                    ? dropDownList.map((d) => {
                          return (
                              <li key={d}>
                                  <a
                                      onClick={() => {
                                          if (onSelectDropdown)
                                              onSelectDropdown(d);
                                      }}
                                  >
                                      {d}
                                  </a>
                              </li>
                          );
                      })
                    : []}
            </ul>
        </details>
    );
};

const CheckButton = ({ checked, onClickFunc }: CheckButtonProps) => {
    return (
        <button
            className={`btn btn-sm btn-square border rounded-sm transition-all duration-150 
        ${checked ? "bg-transparent text-yellow-400 border-yellow-400" : "bg-transparent text-gray-400 border-gray-300"}
        hover:ring-2 hover:ring-yellow-300`}
            onClick={onClickFunc}
        >
            {checked ? (
                <CheckCheck className="w-5 h-5" />
            ) : (
                <Check className="w-5 h-5" />
            )}
        </button>
    );
};

// display a bell when the notification list is indicated empty, and display a bell with a dot otherwise
const NotificationButton = ({
    onClickFunc,
    empty,
}: notificationButtonProps) => {
    return (
        <button
            className="w-8 h-8 flex items-center justify-center bg-transparent hover:text-gray-500 rounded transition"
            onClick={onClickFunc}
        >
            {empty ? <Bell/> : <BellDot/>}
        </button>
    );
};

AuthButton.displayName = "AuthButton";
HamburgerButton.displayName = "HamburgerButton";
FloatingButton.displayName = "FloatingButton";
FilterButton.displayName = "FilterButton";
DropDownButton.displayName = "DropDownButton";
CheckButton.displayName = "CheckButton";
NotificationButton.displayName = "NotificationButton";

export {
    AuthButton,
    HamburgerButton,
    FloatingButton,
    FilterButton,
    DropDownButton,
    CheckButton,
    NotificationButton,
};
