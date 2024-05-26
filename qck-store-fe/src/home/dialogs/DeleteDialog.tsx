import { useRef } from "react";
import { Button } from "../../shared/Button";
import { useMenuContext } from "../../global/MenuContext";

type DeleteDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    deleteFile: (id: number) => unknown;
    deleteDirectory: (id: number) => unknown;
}

export function DeleteDialog({open, setOpen, deleteFile, deleteDirectory}: DeleteDialogProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const { menuStatus, setMenuStatus } = useMenuContext();
    const type = menuStatus!.type;
    const id = menuStatus!.item.id;

    if (open) ref.current?.showModal();
    else ref.current?.close();

    function handleDelete() {
        if (type === "file") deleteFile(id);
        if (type === "folder") deleteDirectory(id);
        close();
    }

    function close() {
        setOpen(false);
        setMenuStatus(null);
    }

    return (
        <dialog onCancel={close} ref={ref} className="px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete this item?</h2>
            <div className="flex mt-4 gap-4 w-full justify-end">
                <Button onClick={close} color="plain">Cancel</Button>
                <Button onClick={handleDelete} color="warning">Delete</Button>
            </div>
        </dialog>
    ) 
}
