import FolderIcon from '@mui/icons-material/Folder';
import { Directory } from '../api/responses/Directory';
import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';
import { ContextMenu, ContextMenuStatus } from './ContextMenu';

type DirectoryChipProps = {
    data: Directory;
    menuStatus: ContextMenuStatus | null;
    setMenuStatus: (status: ContextMenuStatus) => void;
    dirs?: Directory[];
}

export function DirectoryChip({ data, menuStatus, setMenuStatus, dirs = [] }: DirectoryChipProps) {
    function handleRightClick(event: MouseEvent) {
        event.preventDefault();
        setMenuStatus({ id: data.id, type: "folder", x: event.pageX, y: event.pageY });
    }
    
    return (
        <Link onContextMenu={(event) => handleRightClick(event)} className="w-full" to={`/folder/${data.id}`}>
        <div className="flex w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border items-center rounded-lg p-2 cursor-pointer">
            <FolderIcon className="text-gray-800 mr-2" />
            <span className="truncate">{data.name}</span>
        </div>
        {menuStatus?.id === data.id && menuStatus.type === "folder" && 
            <ContextMenu dirs={dirs} menuStatus={menuStatus} />
        }
        </Link>
    );
}