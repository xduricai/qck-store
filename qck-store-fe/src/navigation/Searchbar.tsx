import { KeyboardEvent, useState } from "react";
import { Input } from "../shared/Input";
import SearchIcon from "@mui/icons-material/Search";

type SearchbarProps = { 
    onSubmit: (query: string) => void, 
    className?: string 
}

export function Searchbar({ onSubmit, className = "" }: SearchbarProps) {
    const [value, setValue] = useState("");
    
    function handleKeyDown(event: KeyboardEvent) {
        if (event.code !== "Enter") return;
        handleSubmit();
    }

    function handleSubmit() {
        onSubmit(value.toLocaleLowerCase());
        setValue("");
    }

    return (
        <div className={`relative h-min w-80 ${className}`}>
            <Input onKeyDown={handleKeyDown} value={value} placeholder="Search..." onChange={(event) => setValue(event.target.value)} width="w-80" />
            <SearchIcon onClick={handleSubmit} className="text-gray-800 cursor-pointer absolute top-2 right-2 hover:text-purple-800" />
        </div>
    )
}