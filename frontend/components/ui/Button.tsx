import * as React from "react";
import { cn } from "@/lib/utils";

const AuthButton = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props },
     ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "w-full bg-customMirage hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-purple-300",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
);

AuthButton.displayName = "AuthButton";

export { AuthButton };
