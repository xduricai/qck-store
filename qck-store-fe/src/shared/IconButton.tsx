import { ReactNode } from "react";

export function IconButton({ children, className = "" }: { children: ReactNode, className?: string }) {
    return (
        <div className={`p-1 m-1 cursor-pointer rounded-full hover:bg-gray-300 ${className}`}>
            {children}
        </div>
    );
}