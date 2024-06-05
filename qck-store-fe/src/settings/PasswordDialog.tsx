import { FormEvent, useRef, useState } from "react";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../api/UserClient";
import { useSnackbarContext } from "../global/SnackbarContext";

type PasswordDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function PasswordDialog({ open, setOpen }: PasswordDialogProps) {
    const [ password, setPassword ] = useState<string>("");
    const [ confirm, setConfirm ] = useState<string>("");
    const [ current, setCurrent ] = useState<string>("");


    const [ passwordError, setPasswordError ] = useState<string>("");
    const validatePassword = (pw: string) => {
        if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(pw)) {
            setPasswordError("Password must include at least one capital letter and 1 digit");
            return;
        }
        if (pw.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }
        setPasswordError("");
    }
    const [ confirmError, setConfirmError ] = useState<string>("");
    const validateConfirm = (pw: string) => {
        pw !== password
            ? setConfirmError("Passwords do not match")
            : setConfirmError("");
    }

    const [ currentError, setCurrentError ] = useState<string>("");
    const validateCurrent = (pw: string) => {
        !pw
            ? setCurrentError("Please enter your password")
            : setCurrentError("");
    }

    const showSnackbar = useSnackbarContext();
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();

    const { mutate } = useMutation({
        mutationFn: updatePassword,
        onSuccess: (res) => {
            if (!res) {
                setCurrentError("Incorrect password");
                return;
            }
            showSnackbar("Password updated successfully", "success");
            close();
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });
    
    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        validatePassword(password);
        validateConfirm(confirm);
        validateCurrent(current);

        if (passwordError || confirmError || currentError || !password || !confirm || !current) return;
        
        mutate({ oldPassword: current, newPassword: password });
    }

    function close() {
        setPassword("");
        setConfirm("");
        setCurrent("");
        setPasswordError("");
        setConfirmError("");
        setCurrentError("");
        setOpen(false);
    }
    
    return (
        <dialog onCancel={close} ref={ref} className="w-fit px-8 py-4 gapy-8 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <form id="password-form" onSubmit={handleSubmit}>
                <Input 
                    width="w-72"
                    type="password"
                    label="New Password" 
                    value={password} 
                    validator={{ error: passwordError, validate: validatePassword }}
                    onChange={(event) => setPassword(event.target.value)} 
                />
                <Input 
                    width="w-72"
                    type="password"
                    label="Confirm New Password"
                    value={confirm}
                    validator={{ error: confirmError, validate: validateConfirm }}
                    onChange={(event) => setConfirm(event.target.value)}
                />
                <Input 
                    width="w-72"
                    type="password"
                    label="Current Password"
                    value={current}
                    validator={{ error: currentError, validate: validateCurrent }}
                    onChange={(event) => setCurrent(event.target.value)}
                />
            </form>
            <div className="flex mt-4 gap-4 w-full justify-end">
                <Button onClick={close} color="plain">Cancel</Button>
                <Button form="password-form" color="accent">Submit</Button>
            </div>
        </dialog>
    ); 
}