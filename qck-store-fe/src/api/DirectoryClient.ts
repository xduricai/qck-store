import { BaseUrl } from "./BaseUrl";
import { Directory } from "./responses/Directory";

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