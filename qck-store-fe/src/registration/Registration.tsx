import { FormEvent, useState } from "react";
import { Input } from "../shared/Input";
import { useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";
import { register } from "../api/UserClient";
import { useUserContext } from "../global/UserContext";
import { useSnackbarContext } from "../global/SnackbarContext";
import { RegistrationResponse } from "../api/responses/RegistrationResponse";

export function Registration() {
    const userContext = useUserContext();
    const showSnackbar = useSnackbarContext();
    const navigate = useNavigate();
    const toLogin = () => navigate('/login');
    
    const [ formData, setFormData ] = useState({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        confirm: ""
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const [ usernameError, setUsernameError ] = useState<string | null>(null);
    const validateUserName = (username: string) => {
        if (username.length < 4) {
            setUsernameError("Username must be at least 4 characters long");
            return;
        } 
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            setUsernameError("Username must only contain alphanumeric characters");
            return;
        }
        setUsernameError(null);
    };

    const [ emailError, setEmailError ] = useState<string | null>(null);
    const validateEmail = (email: string) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError(null);
    }

    const [ passwordError, setPasswordError ] = useState<string | null>(null);
    const validatePassword = (pw: string) => {
        if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(pw)) {
            setPasswordError("Password must include at least one capital letter and 1 digit");
            return;
        }
        if (pw.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }
        setPasswordError(null);
    }

    const [ confirmError, setConfirmError ] = useState<string | null>(null);
    const validateConfirm = (pw: string) => {
        pw !== formData.password
            ? setConfirmError("Passwords do not match")
            : setConfirmError(null);
    }

    const [firstError, setFirstError] = useState<string | null>(null);
    const validateFirst = (name: string) => {
        setFirstError(name ? null : "Please enter your first name");
    }

    const [lastError, setLastError] = useState<string | null>(null);
    const validateLast = (name: string) => {
        setLastError(name ? null : "Please enter your first name");
    }

    function checkFormValidity() {
        return !usernameError 
            && !emailError
            && !firstError
            && !lastError
            && !passwordError
            && !confirmError;            
    }
    
    async function submit(event: FormEvent) {
        event.preventDefault();
        if (!checkFormValidity()) return;
        let res: RegistrationResponse;

        try {
            res = await register({...formData});
        } catch {
            showSnackbar("An unknown error has occurred", "error");
            return;
        }

        if (res.nameInUse) {
            setUsernameError("This username is already in use");
        }
        if (res.emailInUse) {
            setEmailError("This email address is already in use");
        }
        if (res.id < 0) return;

        userContext.setUser({
            id: res.id,
            role: "user",
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            bytesUsed: 0,
            bytesTotal: 1073741824
        });
    }
    
    return (
        <div className="flex w-max mt-32 mb-8 mx-auto flex-col content-center py-8 px-16 rounded even-shadow">
        <div className="mb-4">
            <h1 className="text-2xl font-bold">
                Register
            </h1>
            <span>
                Create an account
            </span>
        </div>
        <form id="registrationForm" className="flex flex-col" onSubmit={submit}>
            <Input 
                width="w-72"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email..."
                label="Email"
                validator={{error: emailError, validate: validateEmail}}
            />
            <Input 
                width="w-72"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username..."
                label="Username"
                validator={{error: usernameError, validate: validateUserName}}
            />
            <Input 
                width="w-72"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                validator={{error: firstError, validate: validateFirst}}
                placeholder="First Name..."
                label="First Name"
            />
             <Input 
                width="w-72"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                validator={{error: lastError, validate: validateLast}}
                placeholder="Last Name..."
                label="Last Name"
            />
            <Input 
                width="w-72"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                validator={{error: passwordError, validate: validatePassword}}
                placeholder="Password..."
                label="Password"
            />
            <Input 
                width="w-72"
                type="password"
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                validator={{error: confirmError, validate: validateConfirm}}
                placeholder="Confirm Password..."
                label="Confirm Password"
            />
        </form>
        <div className="mb-4">
            <p onClick={toLogin} className="text-[13px] font-semibold text-purple-800 hover:underline cursor-pointer">
                Already have an account? Click here to sign in
            </p>
        </div>
        <Button className="ml-auto" color="accent" form="registrationForm" >
            Confirm
        </Button>
        </div>
    );
}