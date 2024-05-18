import { useRef } from "react";
import { Button } from "../../shared/Button";
import { ItemType } from "../Home";

type DeleteDialogProps = {
    id: number;
    type: ItemType;
    open: boolean;
    setOpen: (open: boolean) => void;
    deleteFile: (id: number) => any;
}

export function DeleteDialog({id, type, open, setOpen, deleteFile}: DeleteDialogProps) {
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();

    const close = () => setOpen(false);
    function handleDelete() {
        if (type === "file") {
            deleteFile(id);
        }
        close();
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
