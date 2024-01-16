import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { Input } from '../shared/Input';

export function Searchbar(): JSX.Element {
    const [value, setValue]: [string, (value: string) => void] = useState("");
    
    return (
        <div className='relative h-min w-80'>
            <Input value={value} placeholder='Search...' onChange={setValue} className='w-80' />
            <SearchIcon className='text-gray-600 absolute top-2 right-2' />
        </div>
    )
}