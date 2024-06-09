import { Link } from "react-router-dom";
import { MouseEvent } from 'react';
import { Directory } from "../api/responses/Directory";
import { Button } from "../shared/Button";
import { Tracker } from './Tracker';
import { ItemType, useMenuContext } from '../global/MenuContext';
import { useUserContext } from "../global/UserContext";
import AddIcon from '@mui/icons-material/Add';

type SidenavProps = {
    directories: Directory[];
    selectedId: number | null;
    addOpen: boolean;
    setAddOpen: (open: boolean) => void;
    setDialogStatus: (status: ItemType | null) => void;
}

export function Sidenav({ directories, selectedId, addOpen, setAddOpen, setDialogStatus }: SidenavProps) {  
    const { user } = useUserContext();
    const { setMenuStatus } = useMenuContext();

    const colorRegular = "hover:bg-gray-200";
    const colorSelected = "bg-purple-100 text-purple-800";

    function handleRightClick(event: MouseEvent, item: Directory) {
        event.preventDefault();
        setMenuStatus({ item, type: "folder", x: event.pageX, y: event.pageY });
    }

    function toggleDialog(type: ItemType) {
        setDialogStatus(type);
        setAddOpen(false);
    }

    return (
        <div className="flex flex-col h-full w-48 pt-4">
            <Button onClick={(event) => { setAddOpen(!addOpen); event?.stopPropagation(); }} color="accent" width="w-[175px]" className="mx-2 mb-4 min-h-10">
                <span className='flex items-center justify-start mr-4'>
                    <AddIcon className="mr-1" />
                    New
                </span>
            </Button>
            {addOpen &&
                <div className="absolute mx-2 top-[124px] w-[175px] rounded border-gray-400 border">
                    <span onClick={() => toggleDialog("folder")} className="menu-item">
                        Create a Folder
                    </span>
                    <span onClick={() => toggleDialog("file")} className="menu-item">
                        Upload a File
                    </span>
                </div>
            }
            <div className="flex flex-col overflow-y-auto scrollbar">
            {
                directories.map(item => 
                    <Link key={item.id} to={`/folder/${item.id}`} onContextMenu={(event) => handleRightClick(event, item)}>
                        <div className={`mx-2 my-1 py-2 pl-2 truncate cursor-pointer font-semibold rounded ${selectedId === item.id ? colorSelected : colorRegular}`}>
                            {item.name}
                        </div>
                    </Link>
                )
            }
            </div>
            <Tracker className="mt-auto pt-2 pb-4 px-4 border-t border-gray-400" user={user!}/>
        </div>
    );
}

/*
ALT VERSION
const colorRegular = "border-transparent hover:border-gray-400 hover:border-gray-500";
const colorSelected = "border-purple-800 text-purple-800 font-semibold";

return (
        <div className="h-full w-48 pt-4 border-gray-400 border-r-[1.5px] overflow-y-auto">
            <div className="border-gray-300 ml-4 border-l-2">
            {
                directories.map(item => 
                    <div 
                    key={item.id} 
                    onClick={() => onSelected(item.id)}
                    className={`mt-4 first:mt-0 ml-[-2px] pl-2 truncate cursor-pointer border-l-2 ${selectedId === item.id ? colorSelected : colorRegular}`
                    }
                    >
                        {item.name}
                    </div>
                )
            }
            </div>
        </div>
    );
}
*/