import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { ItemType } from "../Home";
import { Directory } from "../../api/responses/Directory";

type NewItemDialogProps = {
    status: ItemType | null;
    setStatus: (status: ItemType | null) => void;
    dirs: Directory[];
    folderId?: string;
}

export function NewItemDialog({status, setStatus, dirs, folderId}: NewItemDialogProps) {
    const [ name, setName ] = useState<string>("");
    const [ file, setFile ] = useState<string>("");
    const [ folder, setFolder ] = useState<number | undefined>(-1);
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const id = parseInt(folderId || "");

        if (id > 0) setFolder(id);
        else if (status === "folder") setFolder(-1);
        else setFolder(dirs[0]?.id || undefined);
    }, [status, folderId]);    

    if (status) ref.current?.showModal();
    else ref.current?.close();

    const getTitle = () => {
        if (status === "folder") return "Create a Folder";
        if (status === "file") return "Upload a File";
    }
    
    function close() {
        setName("");
        setFile("");
        setStatus(null);
    };

    function handleKeyDown(event: KeyboardEvent) {
        if (event.code !== "Enter" || !name) return;
        handleSubmit();
    }
    
    function handleSubmit() {
        // TODO implement
        console.log(name, file, folder);
        close();
    }

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const val = event.target.value;
        const id = parseInt(val);
        if (isNaN(id)) setFolder(undefined);
        else setFolder(id);
    }

    return (
        <dialog onCancel={close} ref={ref} className="w-[340px] px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <h2 className="text-lg mb-2 font-semibold">{getTitle()}</h2>

            <form className="flex flex-col gapy-2">
                <Input width="w-full" label="Name" value={name} onKeyDown={handleKeyDown} onChange={(event) => setName(event.target.value)} />
                
                {status === "file" && 
                    <div>
                        
                    </div>
                }

                <div>
                    <label className="text-sm font-semibold" htmlFor="folder-select">
                        Folder
                    </label>
                    <select id="folder-select" value={folder} onChange={handleSelectChange} className="w-full rounded h-[38px] px-3 py-1.5 text-base placeholder:text-gray-600 box-border focus:border-2 border-gray-400 focus:border-purple-800 focus:px-[11px] border-[1.5px] outline-none">
                        {status === "folder" &&
                            <option value={-1}>Root Folder</option>
                        }
                        {dirs.map(dir => 
                            <option value={dir.id} key={dir.id}>
                                {dir.name}
                            </option>
                        )}
                    </select>
                </div>

                <div className="flex mt-4 gap-4 w-full justify-end">
                    <Button onClick={close} color="plain">Cancel</Button>
                    <Button onClick={handleSubmit} color="accent">Submit</Button>
                </div>
            </form>
        </dialog>
    ) 
}
