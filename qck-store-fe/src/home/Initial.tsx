import { Button } from "../shared/Button";

export function Initial() {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] text-center justify-center items-center">
            <p>QCK STORE</p>
            <Button label="Create an Account" />
            <p>Already have an account?</p>
            <Button label="Sign In" />
        </div>
    );
}