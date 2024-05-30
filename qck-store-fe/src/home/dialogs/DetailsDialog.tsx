import { useRef } from "react";
import { Button } from "../../shared/Button";
import { useMenuContext } from "../../global/MenuContext";
import { getFormattedSize } from "../../api/responses/File";

type DetailsDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function DetailsDialog({ open, setOpen }: DetailsDialogProps) {
    const ref = useRef<HTMLDialogElement>(null);
    const { menuStatus, setMenuStatus } = useMenuContext(); 
    const item = menuStatus!.item;

    if (open) ref.current?.showModal();
    else ref.current?.close();
    
    function close() {
        setOpen(false);
        setMenuStatus(null);
    }

    return (
        <dialog onCancel={close} ref={ref} className="w-[340px] px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <div className="flex flex-col gap-y-2 mb-2">
                <div>
                    <span className="text-sm">Name</span>
                    <p>{item.name}</p>
                </div>
                {"size" in item && 
                <div>
                    <span className="text-sm">Size</span>
                    <p>{getFormattedSize(item.size)} ({item.size}B)</p>
                </div>
                }
                <div>
                    <span className="text-sm">Created</span>
                    <p>{item.created}</p>
                </div>
                <div>
                    <span className="text-sm">Last Modified</span>
                    <p>{item.modified}</p>
                </div>
            </div>
            <div className="flex mt-4 gap-4 w-full justify-end">
                <Button onClick={close} color="outlined">Close</Button>
            </div>
        </dialog>
    ) 
}