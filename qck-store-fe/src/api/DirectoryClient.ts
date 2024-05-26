import { BaseUrl } from "./BaseUrl";
import { DirectoryCreationCommand } from "./commands/DirectoryCreationCommand";
import { RenameCommand } from "./commands/RenameCommand";
import { Directory } from "./responses/Directory";
import { FolderContentResponse } from "./responses/FolderContentResponse";

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
        throw "An error occurred while renaming file";
    }
}

export async function deleteDirectory(id: number) {
    const res = await fetch(`${BaseUrl}/directories/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An error has occurred while attempting to delete directory"
    }

    const size: number = await res.json();
    return size;
}

//TODO remove
// function tempData() {
//     return [
//         { id: 100001, name: "file name 1", size: 130450, modified: "10/10/2020 19:29:35", created: "10/10/2020 19:29:35"  },
//         { id: 100002, name: "file name 2", size: 130450, modified: "10/10/2020 09:29:34", created: "10/10/2020 19:29:34"  },
//         { id: 100003, name: "file name 3", size: 130450, modified: "10/10/2020 19:29:33", created: "10/10/2020 19:29:33"  },
//         { id: 100004, name: "file name 4", size: 130450, modified: "10/10/2020 19:29:32", created: "10/10/2020 19:29:32"  },
//         { id: 100005, name: "file name 5", size: 130450, modified: "10/10/2020 19:29:31", created: "10/10/2020 19:29:31"  },
//         { id: 100006, name: "file name 6", size: 130450, modified: "10/10/2020 19:29:30", created: "10/10/2020 19:29:47"  },
//     ]
// }