import { Directory } from '../api/responses/Directory';
import { useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import { ContextMenuStatus } from './ContextMenu';
import FolderIcon from '@mui/icons-material/Folder';

type DirectoryChipProps = {
    data: Directory;
    setMenuStatus: (status: ContextMenuStatus) => void;
}

export function DirectoryChip({ data, setMenuStatus }: DirectoryChipProps) {
    const navigate = useNavigate();
    const toFolder = (id: number) => navigate(`/folder/${id}`);
    
    function handleRightClick(event: MouseEvent) {
        event.preventDefault();
        setMenuStatus({ item: data, type: "folder", x: event.pageX, y: event.pageY });
    }
    
    return (
        <div 
            onClick={() => toFolder(data.id)}
            onContextMenu={(event) => handleRightClick(event)}
            className="flex w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border items-center rounded-lg p-2 cursor-pointer"
        >
            <FolderIcon className="text-gray-800 mr-2" />
            <span className="truncate">{data.name}</span>
        </div>
    );
}