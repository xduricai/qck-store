import { useState } from "react";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [ identifier, setIdentifier ] = useState('');
    const [ password, setPassword ] = useState('');
    const navigate = useNavigate();
    const toRegistration = () => navigate('/register');

    function submit() {

    }
    
    return (
        <div className="flex w-max mt-32 mx-auto flex-col content-center py-8 px-16 gap-y-4 rounded shadow-lg">
            <p>
                <h1 className="text-2xl font-bold">
                    Sign In
                </h1>
                <span>
                    Sign in using your email or username
                </span>
            </p>
            <Input 
                className="w-72"
                value={identifier}
                onChange={setIdentifier}
                placeholder="Username or Email..."
                label="Username or Email"
            />
            <Input 
                className="w-72"
                value={password}
                onChange={setPassword}
                placeholder="Password..."
                label="Password"
            />
            <span onClick={toRegistration} className="text-[13px] font-semibold text-purple-800 hover:underline cursor-pointer">
                Don't have an account? Click here to register
            </span>
            <Button className="ml-auto" label="Confirm" color="accent" onClick={submit} />
        </div>
    );
}