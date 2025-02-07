"use client";

// @ts-ignore
import Link from "next/link";

export default function Main() {

    return (
        <div>
            <p className="text-sm text-white text-center">
                <Link href="/login" className="text-center hover:underline">
                    Log in?
                </Link>
            </p>
        </div>
    );
}
