import { BaseUrl } from "./BaseUrl";
import { Directory } from "./responses/Directory";
import { FolderContentResponse } from "./responses/FolderContentResponse";

export async function GetRootDirectories() {
    const res = await fetch(`${BaseUrl}/directories/all`, {
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
    //TODO remove 
    content.files = tempData();
    return content;
}

export async function GetSearchResults(query?: string) {
    //TODO finish
    
    // if (!query) return null;
    
    // const res = await fetch(`${BaseUrl}/search/${query}`, {
    //     credentials: "include"
    // });
    // if (res.status !== 200) {
    //     throw new Error();
    // }

    // const content: FolderContentResponse = await res.json();
    //TODO remove 
    const content = { directories: [], files: tempData() };
    content.files = tempData();
    return content;
}

//TODO remove
function tempData() {
    return [
        { id: 1, name: "file name 1", size: 130450, modified: "10/10/2020 19:29:34", created: "10/10/2020 19:29:34"  },
        { id: 2, name: "file name 2", size: 130450, modified: "10/10/2020 19:29:34", created: "10/10/2020 19:29:34"  },
        { id: 3, name: "file name 3", size: 130450, modified: "10/10/2020 19:29:34", created: "10/10/2020 19:29:34"  },
        { id: 4, name: "file name 4", size: 130450, modified: "10/10/2020 19:29:34", created: "10/10/2020 19:29:34"  },
        { id: 5, name: "file name 5", size: 130450, modified: "10/10/2020 19:29:34", created: "10/10/2020 19:29:34"  },
        { id: 6, name: "file name 6", size: 130450, modified: "10/10/2020 19:29:34", created: "10/10/2020 19:29:34"  },
    ]
}