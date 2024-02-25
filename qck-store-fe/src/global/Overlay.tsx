import { ReactNode } from "react";

export function Overlay({ children }: { children: ReactNode }) {
    return (
        <div className="fixed z-50 inset-0 w-full h-full pointer-events-none">
            {children}            
        </div>
    );
}