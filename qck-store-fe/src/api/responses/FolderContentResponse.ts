import { Directory } from "./Directory";
import { File } from "./File"

export type FolderContentResponse = {
    path: string;
    files: File[];
    directories: Directory[];
}