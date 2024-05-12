import { BaseUrl } from "./BaseUrl";
import { File as FileResponse } from "./responses/File";

export async function downloadFile(id: number) {
    const res = await fetch(`${BaseUrl}/files/download/${id}`, { credentials: 'include' });
    if (res.status !== 200) {
        throw "Could not download file";
    }
}

export async function uploadFile(name: string, folderId: string, file: File) {
    const data = new FormData();
    data.append('name', name);
    data.append('folderId', folderId.toString());
    data.append('file', file);
    
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

export async function deleteFile(id: number) {
    const res = await fetch(`${BaseUrl}/files/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error has occurred while attempting to delete file"
    }
}