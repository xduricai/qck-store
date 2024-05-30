import { BaseUrl } from "./BaseUrl";
import { DirectoryCreationCommand } from "./commands/DirectoryCreationCommand";
import { MoveCommand } from "./commands/MoveCommand";
import { RenameCommand } from "./commands/RenameCommand";
import { Directory } from "./responses/Directory";
import { DirectoryMoveResponse } from "./responses/DirectoryMoveResponse";
import { FolderContentResponse } from "./responses/FolderContentResponse";
import { FolderDeletionResponse } from "./responses/FolderDeletionResponse";

export async function getRootDirectories() {
    const res = await fetch(`${BaseUrl}/directories/all`, {
        credentials: "include"
    });
    if (res.status !== 200) {
        throw new Error();
    }

    const directories: Directory[] = await res.json();
    return directories;
}

export async function getDirectoryContent(folderId?: string) {
    if (!folderId) return null;
    
    const res = await fetch(`${BaseUrl}/directories/content/${folderId}`, {
        credentials: "include"
    });
    if (res.status !== 200) {
        throw new Error();
    }
    
    const content: FolderContentResponse = await res.json();
    content.directories ||= [];
    content.files ||= [];
    return content;
}

export async function getSearchResults(query?: string) {
    if (!query) return null;
    
    const res = await fetch(`${BaseUrl}/search/${query}`, {
        credentials: "include"
    });
    if (res.status !== 200) {
        throw new Error();
    }

    const content: FolderContentResponse = await res.json();
    content.directories ||= [];
    content.files ||= [];
    return content;
}

export async function createDirectory(command: DirectoryCreationCommand) {  
    if (!command.parentId) command.parentId = "-1";
    const res = await fetch(`${BaseUrl}/directories/create/${command.parentId}`, {
        method: "POST",
        body: command.name,
        credentials: "include",
    });

    if (res.status !== 200) {
        throw "Directory creation failed, please try again"
    }

    const dir: Directory = await res.json();
    return dir;
}

export async function renameDirectory(command: RenameCommand) {
    const res = await fetch(`${BaseUrl}/directories/rename/${command.id}`, {
        method: "PATCH",
        body: command.name,
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error occurred while renaming directory";
    }

    const modified: string = await res.json();
    return modified;
}

export async function moveDirectory(command: MoveCommand) {
    const res = await fetch(`${BaseUrl}/directories/move/${command.itemId}`, {
        method: "PUT",
        body: command.folderId.toString(),
        credentials: "include"
    });

    if (res.status === 404) {
        throw "Unable to find target directory";
    }
    if (res.status !== 200) {
        throw "An error occurred while moving directory";
    }

    const moveRes: DirectoryMoveResponse = await res.json();
    return moveRes;
}

export async function deleteDirectory(id: number) {
    const res = await fetch(`${BaseUrl}/directories/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error has occurred while attempting to delete directory"
    }

    const deletionRes: FolderDeletionResponse = await res.json();
    return deletionRes;
}