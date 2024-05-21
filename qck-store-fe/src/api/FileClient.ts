import { BaseUrl } from "./BaseUrl";
import { FileUploadCommand } from "./commands/FIleUploadCommand";
import { FileMoveCommand } from "./commands/FileMoveCommand";
import { FileRenameCommand } from "./commands/FileRenameCommand";
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

export async function renameFile(command: FileRenameCommand) {
    const res = await fetch(`${BaseUrl}/files/rename/${command.id}`, {
        method: "PATCH",
        body: command.name,
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error occurred while renaming file";
    }
}

export async function moveFile(command: FileMoveCommand) {
    const res = await fetch(`${BaseUrl}/files/move/${command.id}`, {
        method: "PUT",
        body: command.folderId.toString(),
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error occurred while moving file";
    }
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