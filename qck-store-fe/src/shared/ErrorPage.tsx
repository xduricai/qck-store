import { Logo } from "../navigation/Logo";

export function ErrorPage() {
    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] text-center justify-center items-center font-bold">
            <Logo />
            <span className="text-lg">
                AN ERROR HAS OCCURRED
            </span>
            <span className="text-lg">
                PLEASE TRY REFRESHING THE PAGE
            </span>
        </div>
    );
}