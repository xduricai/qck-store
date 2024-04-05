import { ReactNode } from "react";

type ButtonProps = {
    children?: ReactNode;
    onClick?: () => unknown;
    color?: "plain" | "outlined" | "accent";
    className?: string
    form?: string
    width?: string;
};

export function Button({ children, onClick, className, form, color="plain", width="w-max" }: ButtonProps) {
    const colors = {
        plain: "border-[1px] border-zinc-400 hover:border-zinc-800 hover:bg-zinc-100",
        outlined: "text-purple-800 border-[1px] border-purple-800 hover:bg-zinc-100",
        accent: "bg-purple-800 text-slate-50 hover:bg-purple-900",
    };
    
    return <button 
                className={`${colors[color]} ${width} hover:underline h-10 rounded font-medium px-4 ${className}`}
                onClick={onClick}
                form={form}
            >
                {children}
            </button>
}