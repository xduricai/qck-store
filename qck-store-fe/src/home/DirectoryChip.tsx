import FolderIcon from '@mui/icons-material/Folder';
import { Directory } from '../api/responses/Directory';
import { Link } from 'react-router-dom';

export function DirectoryChip({ data }: { data: Directory }) {
    return (
        <Link to={`/folder/${data.id}`}>
        <div className="flex border-zinc-400 hover:border-zinc-800 hover:bg-zinc-100 border-[1px] items-center w-44 rounded-xl p-2 cursor-pointer">
            <FolderIcon className="text-zinc-800 mr-2" />
            <span className="truncate">{data.name}</span>
        </div>
        </Link>
    );
}