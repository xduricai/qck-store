import { KeyboardEvent, useRef, useState } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { ItemType } from "../Home";
import { FileRenameCommand } from "../../api/commands/FileRenameCommand";

type RenameDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number;
    type: ItemType;
    renameFile: (command: FileRenameCommand) => unknown;
}

export function RenameDialog({open, setOpen, id, type, renameFile}: RenameDialogProps) {
    const [ name, setName ] = useState<string>("");
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();

    const close = () => setOpen(false);

    function handleKeyDown(event: KeyboardEvent) {
        if (event.code !== "Enter" || !name) return;
        handleSubmit();
    }
    
    function handleSubmit() {
        // TODO implement
        if (type === "file") renameFile({id, name});

        setName("");
        close();
    }

    return (
        <dialog onCancel={close} ref={ref} className="w-[340px] px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg font-semibold mb-2">Rename</h2>
            <Input width="w-full" value={name} onKeyDown={handleKeyDown} onChange={(event) => setName(event.target.value)} />
            <div className="flex mt-4 gap-4 w-full justify-end">
                <Button onClick={close} color="plain">Cancel</Button>
                <Button onClick={handleSubmit} color="accent">Submit</Button>
            </div>
        </dialog>
    ) 
}
