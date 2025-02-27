import * as React from "react";
import { cn } from "@/lib/utils";

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
}

interface DropDownButtonProps {
    dropDownName: string;
    dropDownList?: string[];
    onSelectDropdown?: (item: string) => void;
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

const FilterButton = ({ filterName, filterOptions }: FilterButtonProps) => {
    return (
        <select className="select select-bordered join-item">
            <option>{filterName}</option>
            {filterOptions.map((o) => {
                return <option key={filterOptions.indexOf(o)}>{o}</option>;
            })}
        </select>
    );
};

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

AuthButton.displayName = "AuthButton";
HamburgerButton.displayName = "HamburgerButton";
FilterButton.displayName = "FilterButton";
DropDownButton.displayName = "DropDownButton";

export { AuthButton, HamburgerButton, FilterButton, DropDownButton };
