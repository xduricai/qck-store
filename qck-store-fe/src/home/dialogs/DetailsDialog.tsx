import { useRef } from "react";
import { Button } from "../../shared/Button";
import { File } from "../../api/responses/File";
import { Directory } from "../../api/responses/Directory";

type DetailsDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    item: File | Directory;
}

export function DetailsDialog({ open, setOpen, item }: DetailsDialogProps) {
    const ref = useRef<HTMLDialogElement>(null);

    if (open) ref.current?.showModal();
    else ref.current?.close();
    const close = () => setOpen(false);

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
                    <p>{item.size}B</p>
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