import { BaseUrl } from "./BaseUrl";

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
    console.log(data)
    
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

    const id: number = await res.json();
    return id;
}