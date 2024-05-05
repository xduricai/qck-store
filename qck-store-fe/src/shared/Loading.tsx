import { Logo } from "../navigation/Logo";

export function LoadingPage() {
    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] text-center justify-center items-center font-bold">
            <Logo />
            <span className="text-lg">
                LOADING DATA
            </span>
        </div>
    );
}