import { BaseUrl } from "./BaseUrl";
import { FileUploadCommand } from "./commands/FIleUploadCommand";
import { File as FileResponse } from "./responses/File";

export type FileUploadResult = FileResponse & { parentId: string };
export type FileDeleteResult = { id: number, size: number };

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
    return { ...fileRes, parentId: command.folderId } as FileUploadResult;
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
    return { id, size } as FileDeleteResult;
}