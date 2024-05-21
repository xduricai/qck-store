import { ReactNode } from "react";
import { Directory } from "../api/responses/Directory";
import { useParams } from "react-router-dom";
import { BaseUrl } from "../api/BaseUrl";
import { FileMoveCommand } from "../api/commands/FileMoveCommand";
import { ContextMenuStatus, useMenuContext } from "../global/MenuContext";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './home.css';

type MenuItemProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => any;
}

function getPosX(point: number, size: number, screenSize: number) {
    if (screenSize <= size) {
        return 0;
    }

    let start = point;
    let end = point + size;
    if (end <= screenSize) {
        return start;
    }

    end = point + size / 2;
    if (end <= screenSize) {
        return end - screenSize;
    }

    end = point;
    start = point - size;
    if (start > 0) {
        return end - screenSize;
    }

    return (screenSize - size) / 2;
}

function getPosY(point: number, size: number, screenSize: number) {
    if (screenSize <= size) {
        return 0;
    }

    if (point + size <= screenSize) {
        return point;
    }

    return screenSize - size;
}

export function MenuItem ({ children, className = "", onClick }: MenuItemProps) {
    return (
        <span className={`menu-item ${className}`} onClick={onClick}>
            {children}
        </span>
    );
}

type ContextMenuProps = {
    dirs: Directory[];
    setDetails: (open: boolean) => void;
    setRename: (open: boolean) => void;
    setDelete: (open: boolean) => void;
    moveFile: (command: FileMoveCommand) => void;
}

export function ContextMenu({ dirs, setDetails, setRename, setDelete, moveFile }: ContextMenuProps) {   
    const { folderId } = useParams();
    const currentId = parseInt(folderId || "");
    const { menuStatus, setMenuStatus } = useMenuContext() as { menuStatus: ContextMenuStatus, setMenuStatus };

    const filteredDirs = dirs.filter(dir => {
        if (dir.id == currentId) return false;
        if (dir.isRoot && isNaN(currentId)) return false;
        return true;
    });
    if (menuStatus.type === "folder" && !isNaN(currentId)) {
        filteredDirs.unshift({ id: -1, name: "Root Folder", modified: "", created: "", isRoot: false });
    }

    const rem = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
    let dirsMargin = "";
    if (filteredDirs.length <= 2) dirsMargin = "mt-20";
    if (filteredDirs.length === 3) dirsMargin = "mt-10";

    const width = 24 * rem;
    const height = 12 * rem;
    const x = getPosX(menuStatus.x, width, window.innerWidth);
    const y = getPosY(menuStatus.y, height, window.innerHeight);

    const top = `${y}px`;
    let left = "unset";
    let right = "unset";
    
    if (x >= 0) left = `${x}px`;
    else right = `${-x}px`;

    const style = {
        left, right, top
    }

    function moveItem(folderId: number) {
        if (menuStatus.type === "file") moveFile({ id: menuStatus.item.id, folderId });
        // TODO
        // if (menuStatus.type === "folder") moveFolder({ id: menuStatus.item.id, folderId });
        setMenuStatus(null);
    }

    function downloadItem() {
        if (menuStatus.type === "file") {
            window.open(`${BaseUrl}/files/download/${menuStatus.item.id}`, '_self');
        }
        else if (menuStatus.type === "folder") {
            // window.open(`${BaseUrl}/folders/download/${menuStatus.item.id}`, '_self');
            // TODO (maybe)
        }
    }

    return (
        <section className="flex flex-row absolute w-fit" style={style} >
            {x < 0 &&
            <div className={`moveto-section w-48 h-fit max-h-64 rounded-l border-gray-400 border bg-white flex-col overflow-y-auto scrollbar hidden hover:flex ${dirsMargin}`}>
                {filteredDirs!.map(dir => 
                    <MenuItem key={dir.id} onClick={() => moveItem(dir.id)}>
                        {dir.name}
                    </MenuItem>
                )}
                { !filteredDirs.length && <span className="w-full bg-white items-center p-2">No folders available</span> }
            </div>
            }
            <div className="flex flex-col w-48 h-fit rounded outline outline-gray-400 outline-[1px]">
                <MenuItem onClick={() => setDetails(true)}>Details</MenuItem>
                <MenuItem onClick={() => downloadItem()}>Download</MenuItem>
                <MenuItem onClick={() => setRename(true)}>Rename</MenuItem>
                <MenuItem className="moveto-toggle cursor-default justify-between pr-2">
                    Move To <ChevronRightIcon />
                </MenuItem>
                <MenuItem onClick={() => setDelete(true)} className="text-red-600 font-semibold">
                    Delete
                </MenuItem>
            </div>
            {x >= 0 &&
            <div className={`moveto-section w-48 h-fit max-h-64 rounded-r border-gray-400 border bg-white flex-col overflow-y-auto scrollbar hidden hover:flex ${dirsMargin}`}>
                {filteredDirs!.map(dir => 
                    <MenuItem key={dir.id} onClick={() => moveItem(dir.id)}>
                        {dir.name}
                    </MenuItem>
                )}
                { !filteredDirs.length && <span className="w-full bg-white items-center p-2">No folders available</span> }
            </div>
            }
        </section>
    )
}