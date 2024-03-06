import { FormEvent, useState } from "react";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../global/UserContext';
import { login } from "../api/UserClient";
import { useSnackbarContext } from "../global/SnackbarContext";

export function Login() {
    const [ identifier, setIdentifier ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ formErr, setFormErr ] = useState('');

    const userContext = useUserContext();
    const showSnackbar = useSnackbarContext();
    const navigate = useNavigate();
    const toRegistration = () => navigate('/register');

    async function submit(event: FormEvent) {
        event.preventDefault();
        try {
            const res = await login(identifier, password);
            userContext.setUser(res);
        } catch (err) {
            if (typeof err === "string") setFormErr(err);
            else {
                setFormErr("");
                showSnackbar("An unknown error has occurred", "error");
            } 
        }
    }
    
    return (
        <div className="flex w-max mt-32 mx-auto flex-col content-center py-8 px-16 gap-y-4 rounded even-shadow">
            <div>
                <h1 className="text-2xl font-bold">
                    Sign In
                </h1>
                <span>
                    Sign in using your email or username
                </span>
            </div>

            <form id="loginForm" className="flex flex-col gap-y-4" onSubmit={submit}>
                <Input 
                    width="w-72"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Username or Email..."
                    label="Username or Email"
                />
                <Input 
                    width="w-72"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password..."
                    label="Password"
                />
            </form>

            <div>
                <p onClick={toRegistration} className="text-[13px] font-semibold text-purple-800 hover:underline cursor-pointer">
                    Don't have an account? Click here to register
                </p>
                { !!formErr.length &&
                    <p className="text-[13px] mt-1 font-semibold text-red-600">
                        {formErr}
                    </p>
                }
            </div>
            <Button className="ml-auto" label="Confirm" color="accent" form="loginForm" />
        </div>
    );
}