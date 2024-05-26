import { KeyboardEvent, useRef, useState } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { RenameCommand } from "../../api/commands/RenameCommand";
import { useMenuContext } from "../../global/MenuContext";

type RenameDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    renameFile: (command: RenameCommand) => unknown;
    renameDirectory: (command: RenameCommand) => unknown;
}

export function RenameDialog({open, setOpen, renameFile, renameDirectory}: RenameDialogProps) {
    const [ name, setName ] = useState<string>("");
    const ref = useRef<HTMLDialogElement>(null);

    const { menuStatus, setMenuStatus } = useMenuContext();
    const type = menuStatus!.type;
    const id = menuStatus!.item.id;

    if (open) ref.current?.showModal();
    else ref.current?.close();

    function handleKeyDown(event: KeyboardEvent) {
        if (event.code !== "Enter" || !name) return;
        handleSubmit();
    }
    
    function handleSubmit() {
        if (type === "file") renameFile({id, name});
        if (type === "folder") renameDirectory({id, name});
        setName("");
        close();
    }

    function close() {
        setOpen(false);
        setMenuStatus(null);
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
