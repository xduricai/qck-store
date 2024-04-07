import FolderIcon from '@mui/icons-material/Folder';
import { Directory } from '../api/responses/Directory';
import { Link } from 'react-router-dom';
import { ContextMenuStatus } from './Home';

type DirectoryChipProps = {
    data: Directory;
    menuStatus: ContextMenuStatus | null;
    setMenuStatus: (status: ContextMenuStatus) => void;
}

export function DirectoryChip({ data, menuStatus, setMenuStatus }: DirectoryChipProps) {
    return (
        <Link onContextMenu={() => setMenuStatus({ id: data.id, type: "folder" })} className="w-full" to={`/folder/${data.id}`}>
        <div className="flex w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border-[1px] items-center rounded-lg p-2 cursor-pointer">
            <FolderIcon className="text-gray-800 mr-2" />
            <span className="truncate">{data.name}</span>
        </div>
        </Link>
    );
}