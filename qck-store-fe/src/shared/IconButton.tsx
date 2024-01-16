import { ReactNode } from "react";

export function IconButton({ children }: { children: ReactNode }): JSX.Element {
    return (
        <div className="p-2 cursor-pointer rounded-full hover:bg-zinc-800/50">
            {children}
        </div>
    );
}