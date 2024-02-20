import { ReactNode } from "react";

export function Overlay({ children }: { children: ReactNode }) {
    return (
        <div className="fixed z-50 w-full h-full">
            {children}            
        </div>
    );
}