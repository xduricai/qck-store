import SearchIcon from "@mui/icons-material/Search";
import { KeyboardEvent, useState } from "react";
import { Input } from "../shared/Input";
import { useNavigate } from "react-router-dom";

export function Searchbar() {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    function handleSubmit() {
        if (!value) return;
        navigate(`/search/${value}`);
        setValue("");
    } 
    
    function handleKeyDown(event: KeyboardEvent) {
        if (event.code !== "Enter") return;
        handleSubmit();
    }

    return (
        <div className="relative h-min w-80">
            <Input onKeyDown={handleKeyDown} value={value} placeholder="Search..." onChange={(event) => setValue(event.target.value)} width="w-80" />
            <SearchIcon onClick={handleSubmit} className="text-gray-800 cursor-pointer absolute top-2 right-2 hover:text-purple-800" />
        </div>
    )
}