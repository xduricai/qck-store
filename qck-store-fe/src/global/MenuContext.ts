import { createContext, useContext } from "react";
import { Directory } from "../api/responses/Directory";
import { File } from "../api/responses/File";

export type ItemType = "folder" | "file";

export type ContextMenuStatus = {
    type: ItemType;
    item: Directory | File;
    x: number;
    y: number;
}

export type MenuContext = {
    menuStatus: ContextMenuStatus | null;
    setMenuStatus: (status: ContextMenuStatus | null) => void;
}

export const ContextMenuContext = createContext<MenuContext>({ menuStatus: null, setMenuStatus: () => null });
export const useMenuContext = () => useContext<MenuContext>(ContextMenuContext);