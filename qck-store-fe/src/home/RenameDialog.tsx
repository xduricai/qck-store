import { useRef, useState } from "react";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";

type RenameDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function RenameDialog({open, setOpen}: RenameDialogProps) {
    const [ name, setName ] = useState<string>("");
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();

    return (
        <dialog onCancel={() => {console.log('test')}} className="m-8" ref={ref}>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
            <div className="flex gap-4 w-full justify-end">
                <Button onClick={() => setOpen(false)} color="outlined">Close</Button>
                <Button onClick={() => setOpen(false)} color="outlined">Submit</Button>
            </div>
        </dialog>
    ) 
}
