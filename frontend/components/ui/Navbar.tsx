import { ReactNode } from "react";

/**
 * Navigation bar
 */
interface NavbarProps {
    title: string;
    middleComponent?: ReactNode;
    rightComponent?: ReactNode;
}

// this is using daisyUI example code
export default function Navbar({
    title,
    middleComponent,
    rightComponent,
}: NavbarProps) {
    return (
        <>
            {/**The navigation bar */}
            <div className="navbar bg-black pl-5 justify-between border-b border-gray-600 min-h-20">
                {/**title as the first piece in the nav bar*/}
                <div className="flex items-center gap-2">
                    {/**Title */}
                    <a className="btn btn-ghost text-2xl normal-case px-2 py-1">{title}</a>
                </div>

                {/**Search bar */}
                {middleComponent}

                {/**Drop down */}
                {rightComponent}
            </div>
        </>
    );
}
