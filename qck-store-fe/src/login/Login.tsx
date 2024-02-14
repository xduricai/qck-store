import './login.css';
import { useState } from "react";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { useNavigate } from "react-router-dom";
import { User } from '../types/user';
import { useUserContext } from '../UserContext';

export function Login() {
    const [ identifier, setIdentifier ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ formErr, setFormErr ] = useState('');
    const navigate = useNavigate();
    const toRegistration = () => navigate('/register');
    const userContext = useUserContext();

    async function submit() {
        if (identifier.length < 4 || password.length < 4) {
            setFormErr("Incorrect name, email or password");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                body: JSON.stringify({ identifier, password })
            });
            if (res.status === 401) {
                setFormErr("Incorrect password");
                return;
            }
            if (res.status === 404) {
                setFormErr("No account matches given username or email")
                return;
            }

            const user: User = await res.json();
            userContext.setUser(user);
        } catch {
            setFormErr("An unknown error has occurred");
            return;
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
            <Input 
                className="w-72"
                value={identifier}
                onChange={setIdentifier}
                placeholder="Username or Email..."
                label="Username or Email"
            />
            <Input 
                className="w-72"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Password..."
                label="Password"
            />
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
            <Button className="ml-auto" label="Confirm" color="accent" onClick={submit} />
        </div>
    );
}