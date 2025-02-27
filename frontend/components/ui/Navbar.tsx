import { HamburgerButton } from "./Button";
import { ReactNode } from "react";

interface NavbarProps {
    title: string;
    middleComponent?: ReactNode;
    rightComponent?: ReactNode;
    toggleSidebar: () => void;
}

// this is using daisyUI example code
export default function Navbar({
    title,
    middleComponent,
    rightComponent,
    toggleSidebar,
}: NavbarProps) {
    return (
        <>
            {/**The navigation bar */}
            <div className="navbar bg-base-100 justify-between">
                {/**Hamburger button and the title as the first piece in the nav bar*/}
                <div className="flex items-center gap-2">
                    <HamburgerButton onClickFunc={toggleSidebar} />
                    {/**Title */}
                    <a className="btn btn-ghost text-xl">{title}</a>
                </div>

                {/**Search bar */}
                {middleComponent}

                {/**Drop down */}
                {rightComponent}
            </div>
        </>
    );
}
