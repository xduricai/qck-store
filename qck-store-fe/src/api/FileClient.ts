import { BaseUrl } from "./BaseUrl";
import { FileUploadCommand } from "./commands/FIleUploadCommand";
import { MoveCommand } from "./commands/MoveCommand";
import { RenameCommand } from "./commands/RenameCommand";
import { File as FileResponse } from "./responses/File";

export async function downloadFile(id: number) {
    const res = await fetch(`${BaseUrl}/files/download/${id}`, { credentials: 'include' });
    if (res.status !== 200) {
        throw "Could not download file";
    }
}

export async function uploadFile(command: FileUploadCommand) {
    const data = new FormData();
    data.append('name', command.name);
    data.append('folderId', command.folderId);
    data.append('file', command.file);
    
    const res = await fetch(`${BaseUrl}/files/upload`, {
        method: "POST",
        body: data,
        credentials: "include",
    });

    if (res.status === 400) {
        throw "File could not be processed";
    }
    if (res.status !== 200) {
        throw "File upload failed, please try again"
    }

    const fileRes: FileResponse = await res.json();
    return fileRes;
}

export async function renameFile(command: RenameCommand) {
    const res = await fetch(`${BaseUrl}/files/rename/${command.id}`, {
        method: "PATCH",
        body: command.name,
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error occurred while renaming file";
    }

    const modified: string = await res.json();
    return modified;
}

export async function moveFile(command: MoveCommand) {
    const res = await fetch(`${BaseUrl}/files/move/${command.itemId}`, {
        method: "PUT",
        body: command.folderId.toString(),
        credentials: "include"
    });

    if (res.status === 404) {
        throw "File could not be found";
    }

    if (res.status !== 200) {
        throw "An error occurred while moving file";
    }

    const modified: string = await res.json();
    return modified;
}

export async function deleteFile(id: number) {
    const res = await fetch(`${BaseUrl}/files/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error has occurred while attempting to delete file"
    }

    const size: number = await res.json();
    return size;
}