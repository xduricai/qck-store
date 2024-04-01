import { BaseUrl } from "./BaseUrl";
import { Directory } from "./responses/Directory";
import { FolderContentResponse } from "./responses/FolderContentResponse";

export async function GetRootDirectories() {
    const res = await fetch(`${BaseUrl}/directories/root`, {
        credentials: "include"
    });
    if (res.status !== 200) {
        throw new Error();
    }

    const directories: Directory[] = await res.json();
    return directories;
}

export async function GetFolderContent(folderId?: string) {
    if (!folderId) return null;
    
    const res = await fetch(`${BaseUrl}/directories/content/${folderId}`, {
        credentials: "include"
    });
    if (res.status !== 200) {
        throw new Error();
    }

    const content: FolderContentResponse = await res.json();
    return content;
}