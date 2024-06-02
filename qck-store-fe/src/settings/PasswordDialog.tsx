import { useRef, useState } from "react";
import { Input } from "../shared/Input";
import { Button } from "../shared/Button";

export type PasswordDialogProps = {
    userId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function PasswordDialog({ open, setOpen, userId }: PasswordDialogProps) {
    const [ password, setPassword ] = useState<string>();
    const [ confirm, setConfirm ] = useState<string>();
    const [ current, setCurrent ] = useState<string>();
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();
    
    function handleSubmit() {
        close();
    }

    function close() {
        setOpen(false);
    }

    return (
        <dialog onCancel={close} ref={ref} className="w-[340px] px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg font-semibold mb-2">Change Password</h2>
            <Input width="w-full" label="New Password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <Input width="w-full" label="Confirm New Password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
            <Input width="w-full" label="Current Password" value={current} onChange={(event) => setCurrent(event.target.value)} />
            <div className="flex mt-4 gap-4 w-full justify-end">
                <Button onClick={close} color="plain">Cancel</Button>
                <Button onClick={handleSubmit} color="accent">Submit</Button>
            </div>
        </dialog>
    ) 
}