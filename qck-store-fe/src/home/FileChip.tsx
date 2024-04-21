import { File } from "../api/responses/File";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { MouseEvent } from "react";
import { ContextMenu, ContextMenuStatus } from "./ContextMenu";
import { Directory } from "../api/responses/Directory";

type FileChipProps = {
    data: File;
    menuStatus: ContextMenuStatus | null;
    setMenuStatus: (status: ContextMenuStatus) => void;
    dirs?: Directory[];
}

export function FileChip({ data, menuStatus, setMenuStatus, dirs = [] }: FileChipProps) {
    function handleRightClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        setMenuStatus({ id: data.id, type: "file", x: event.pageX, y: event.pageY });
    }
    
    return (
        <div onContextMenu={(event) => handleRightClick(event)} className="flex flex-col aspect-square w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border items-center rounded-lg p-2">
            <div className="flex flex-row w-full items-center self-end">
                <div className="flex flex-col">
                    <span className="truncate">{data.name}</span>
                    <span className="truncate text-gray-700 text-sm">Size: {data.size}B</span>
                </div>
                <MoreVertIcon onClick={(event) => handleRightClick(event)} className="ml-auto text-gray-800 cursor-pointer" />
            </div>
            <div className="flex items-center justify-center w-full h-[calc(100%-0.5rem)] mt-2 rounded-lg bg-gray-300">
                <DescriptionOutlinedIcon sx={{ width: 4/5, height: 4/5, strokeWidth:"1.25%" }} className="text-gray-400" />
            </div>
            {menuStatus?.id === data.id && menuStatus.type === "file" && 
                <ContextMenu dirs={dirs} menuStatus={menuStatus} />
            }
        </div>
    );
}