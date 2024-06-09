import { ReactNode } from "react";

type IconButtonProps = {
    children: ReactNode,
    onClick?: () => void,
    className?: string,
    disabled?: boolean
}

export function IconButton({ children, onClick, className = "", disabled = false }: IconButtonProps) {
    return (
        <div onClick={onClick} className={`p-1 m-1 cursor-pointer rounded-full hover:bg-gray-300 ${className} ${disabled && "pointer-events-none"}`}>
            {children}
        </div>
    );
}