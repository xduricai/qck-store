import { File } from "../api/responses/File";
import { ContextMenuStatus } from "./Home";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

type FileChipProps = {
    data: File;
    menuStatus: ContextMenuStatus | null;
    setMenuStatus: (status: ContextMenuStatus) => void;
}

export function FileChip({ data, menuStatus, setMenuStatus }: FileChipProps) {
    return (
        <div onContextMenu={() => setMenuStatus({ id: data.id, type: "file" })} className="flex flex-col aspect-square w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border-[1px] items-center rounded-lg p-2">
            <div className="flex items-center justify-center w-full h-[calc(100%-0.5rem)] mb-2 rounded-lg bg-gray-300">
                <DescriptionOutlinedIcon sx={{ width: 4/5, height: 4/5, strokeWidth:"1.25%" }} className="text-gray-400" />
            </div>
            <div className="flex flex-row w-full items-center self-end">
                <div className="flex flex-col">
                    <span className="truncate">{data.name}</span>
                    <span className="truncate text-gray-700 text-sm">Size: {data.size}B</span>
                </div>
                <MoreVertIcon onClick={() => setMenuStatus({ id: data.id, type: "file" })} className="ml-auto text-gray-800 cursor-pointer" />
            </div>
        </div>
    );
}