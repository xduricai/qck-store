import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import { Directory } from "../api/responses/Directory";
import { Button } from "../shared/Button";

type SidebarProps = {
    directories: Directory[];
    selectedId: number | null;
}

export function Sidebar({ directories, selectedId }: SidebarProps) {
    const colorRegular = "hover:bg-gray-100";
    const colorSelected = "bg-purple-100 text-purple-800";

    return (
        <div className="flex flex-col h-full w-48 pt-4 border-gray-400 border-r-[1.5px] overflow-y-auto">
            <Button color="accent" width="w-[175px]" className="mx-2 mb-4">
                <span className='flex items-center justify-start mr-4'>
                    <AddIcon className="mr-1" />
                    New
                </span>
            </Button>
            {
                directories.map(item => 
                    <Link key={item.id} to={`/folder/${item.id}`}>
                        <div className={`mx-2 my-1 py-2 pl-2 truncate cursor-pointer font-semibold rounded ${selectedId === item.id ? colorSelected : colorRegular}`}>
                            {item.name}
                        </div>
                    </Link>
                )
            }
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