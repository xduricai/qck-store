import { File } from "../api/responses/File";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export function FileChip({ data }: { data: File }) {
    return (
        <div className="flex flex-col aspect-square w-full border-gray-400 hover:border-gray-800 hover:bg-gray-100 border-[1px] items-center rounded-lg p-2 cursor-pointer">
            <div className="flex items-center justify-center w-full h-[calc(100%-0.5rem)] mb-2 rounded-lg bg-gray-300">
                <DescriptionOutlinedIcon sx={{ width: 4/5, height: 4/5, stroke:"#6b7280", strokeWidth:"1.25%" }} className="text-gray-400" />
            </div>
            <div className="flex flex-col w-full self-end">
                <span className="truncate">{data.name}</span>
                <span className="truncate text-gray-700 text-sm">Size: {data.size}B</span>
            </div>
        </div>
    );
}