import { Overlay } from "./Overlay";

export type SnackbarStyle = "success" | "error" | "default";
export type SnackbarProps = { message: string; style: SnackbarStyle; };
const snackbarColors = {
    success: "background-emerald-700",
    error: "background-red-600",
    default: "background-purple-600"
};

export function Snackbar({ message, style }: SnackbarProps) {
    const background = snackbarColors[style];
    const color = `${background} text-white`
    
    return (
        <Overlay>
            <div className={`${color}`}>{message}</div>
        </Overlay>
    );
}