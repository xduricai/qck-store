import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { Directory } from "../../api/responses/Directory";
import { FileUploadCommand } from "../../api/commands/FIleUploadCommand";
import { ItemType } from "../../global/MenuContext";
import { DirectoryCreationCommand } from "../../api/commands/DirectoryCreationCommand";
import { useParams } from "react-router-dom";

type NewItemDialogProps = {
    status: ItemType | null;
    setStatus: (status: ItemType | null) => void;
    dirs: Directory[];
    uploadFile: (command: FileUploadCommand) => unknown;
    createDirectory: (command: DirectoryCreationCommand) => unknown;
}

export function NewItemDialog({status, setStatus, dirs, uploadFile, createDirectory}: NewItemDialogProps) {
    const { folderId } = useParams();
    const [ name, setName ] = useState<string>("");
    const [ folder, setFolder ] = useState<string>("");
    const [ file, setFile ] = useState<File | null>(null);
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (folderId) setFolder(folderId);
        else if (status === "folder") setFolder("-1");
        else setFolder(dirs[0]?.id.toString() || "");
    }, [status, folderId, dirs]);    

    if (status) ref.current?.showModal();
    else ref.current?.close();

    const getTitle = () => {
        if (status === "folder") return "Create a Folder";
        if (status === "file") return "Upload a File";
    }
    
    function close() {
        setName("");
        setFile(null);
        setStatus(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.code !== "Enter" || !name) return;
        handleSubmit();
    }
    
    async function handleSubmit() {
        if (!name || !folder) return;

        if (status === "file" && file != null) {
            uploadFile({name, folderId: folder, file});
        }
        if (status === "folder") {
            createDirectory({name, parentId: folder});
        }
        close();
    }

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        setFolder(event.target.value);
    }

    function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files?.length) return;
        const file = event.target.files[0];
        setName(file.name);
        setFile(file);
    }

    return (
        <dialog onCancel={close} ref={ref} className="w-[340px] px-8 py-4 rounded outline outline-[1px] outline-gray-400">
            <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-semibold">{getTitle()}</h2>

                <Input width="w-full" label="Name" value={name} onKeyDown={handleKeyDown} onChange={(event) => setName(event.target.value)} />
                
                {status === "file" && 
                    <div>
                        <label className="text-sm font-semibold" htmlFor="file-upload">Choose a file</label>
                        <input onChange={handleUpload} className="max-w-full" id="file-upload" type="file" />
                    </div>
                }

                <div>
                    <label className="text-sm font-semibold" htmlFor="folder-select">
                        Folder
                    </label>
                    <select id="folder-select" value={folder} onChange={handleSelectChange} className="w-full rounded h-[38px] px-3 py-1.5 text-base placeholder:text-gray-600 box-border focus:border-2 border-gray-400 focus:border-purple-800 focus:px-[11px] border-[1.5px] outline-none">
                        {status === "folder" &&
                            <option value={"-1"}>Root Folder</option>
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
            </div>
        </dialog>
    ) 
}
