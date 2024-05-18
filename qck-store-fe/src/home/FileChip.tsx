import { File } from "../api/responses/File";
import { MouseEvent } from "react";
import { ContextMenuStatus } from "./ContextMenu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

type FileChipProps = {
    data: File;
    setMenuStatus: (status: ContextMenuStatus) => void;
}

export function FileChip({ data, setMenuStatus }: FileChipProps) {  
    function handleRightClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        setMenuStatus({ item: data, type: "file", x: event.pageX, y: event.pageY });
    }
    
    return (
        <div onContextMenu={(event) => handleRightClick(event)} className="flex flex-col aspect-square w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border items-center rounded-lg p-2">
            <div className="flex flex-row w-full items-center justify-between self-end">
                <div className="flex flex-col max-w-[calc(100%-1.5rem)]">
                    <span className="truncate">{data.name}</span>
                    <span className="truncate text-gray-700 text-sm">Size: {data.size}B</span>
                </div>
                <MoreVertIcon onClick={(event) => handleRightClick(event)} className="text-gray-800 cursor-pointer" />
            </div>
            <div className="flex items-center justify-center w-full h-[calc(100%-0.5rem)] mt-2 rounded-lg bg-gray-300">
                <DescriptionOutlinedIcon sx={{ width: 4/5, height: 4/5, strokeWidth:"1.25%" }} className="text-gray-400" />
            </div>
        </div>
    );
}