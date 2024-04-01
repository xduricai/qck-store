import { Directory } from "./Directory";
import { File } from "./File"

export type FolderContentResponse = {
    files: File[];
    directories: Directory[];
}