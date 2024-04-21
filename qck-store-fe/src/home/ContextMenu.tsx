import { ReactNode } from "react";
import { Directory } from "../api/responses/Directory";
import { ItemType } from "./Home";
import './home.css';

export type ContextMenuStatus = {
    type: ItemType;
    id: number;
    x: number;
    y: number;
}

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
        <span className={`w-full bg-white hover:bg-gray-100 items-center p-2 cursor-pointer ${className}`} onClick={onClick}>
            {children}
        </span>
    );
}

type ContextMenuProps = {
    dirs: Directory[];
    menuStatus: ContextMenuStatus;
}

export function ContextMenu({ dirs, menuStatus }: ContextMenuProps) {
    const rem = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
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

    return (
        <section className="flex flex-row absolute w-fit" style={style} >
            {x < 0 &&
            <div className="moveto-section w-48 max-h-64 rounded-r border-gray-400 border flex-col overflow-y-scroll scrollbar hidden hover:flex">
                {/* TODO filter current folder */}
                { dirs!.map(dir => <MenuItem key={dir.id}>{dir.name}</MenuItem>) }
            </div>
            }
            <div className="flex flex-col w-48 h-fit rounded outline outline-gray-400 outline-[1px]">
                <MenuItem>Details</MenuItem>
                <MenuItem>Rename</MenuItem>
                <MenuItem className="moveto-toggle cursor-default">Move To</MenuItem>
                <MenuItem>Delete</MenuItem>
            </div>
            {/* //TODO rework to dialog
            <div className="w-48 h-fit mt-5 p-4 rounded-r border-gray-400 border hidden hover:flex flex-col">
                <Input label="Enter a new name" placeholder="Name..." />
                <div>
                    <Button color="outlined">Cancel</Button>
                    <Button color="accent">Save</Button>
                </div>
            </div> */}
            {x >= 0 &&
            <div className="moveto-section w-48 max-h-64 rounded-r border-gray-400 border flex-col overflow-y-scroll scrollbar hidden hover:flex">
                { menuStatus.type === "folder" && <MenuItem>Root Folder</MenuItem> }
                {/* TODO filter current folder */}
                { dirs!.map(dir => <MenuItem key={dir.id}>{dir.name}</MenuItem>) }
            </div>
            }
        </section>
    )
}