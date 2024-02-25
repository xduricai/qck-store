import { Overlay } from "./Overlay";

export type SnackbarStyle = "success" | "error" | "default";
export type SnackbarProps = { message: string; style: SnackbarStyle; };
const snackbarColors = {
    success: "bg-emerald-800",
    error: "bg-red-900",
    default: "bg-purple-800"
};

export function Snackbar({ message, style }: SnackbarProps) {
    const background = snackbarColors[style];
    const color = `${background} text-white`;
    
    return (
        <Overlay>
            <div className="flex h-full justify-center items-end">
                <div className={`${color} w-80 px-[12px] py-2 mb-8 rounded pointer-events-auto`}>{message}</div>
            </div>
        </Overlay>
    );
}