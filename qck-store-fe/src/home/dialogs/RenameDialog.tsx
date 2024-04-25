import { useRef, useState } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";

type RenameDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function RenameDialog({open, setOpen}: RenameDialogProps) {
    const [ name, setName ] = useState<string>("");
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();

    const close = () => setOpen(false);
    function handleSubmit() {
        // TODO implement
        console.log(name);
        setName("");
        close();
    }

    return (
        <dialog onCancel={close} ref={ref} className="w-[340px] px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg font-semibold mb-2">Rename</h2>
            <Input width="w-full" value={name} onChange={(event) => setName(event.target.value)} />
            <div className="flex mt-4 gap-4 w-full justify-end">
                <Button onClick={close} color="plain">Cancel</Button>
                <Button onClick={handleSubmit} color="accent">Submit</Button>
            </div>
        </dialog>
    ) 
}
