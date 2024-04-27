import { ReactNode } from "react";

export function IconButton({ children }: { children: ReactNode }) {
    return (
        <div className="p-1 m-1 cursor-pointer rounded-full hover:bg-gray-300">
            {children}
        </div>
    );
}