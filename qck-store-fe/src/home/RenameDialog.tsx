import { useRef } from "react";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";

export default function RenameDialog() {
    const dialogRef = useRef(null);
  
    return (
        <dialog className="m-8" ref={dialogRef}>
            <Input />
            <div className="flex gap-4 w-full justify-end">
                <Button onClick={() => console.log(dialogRef)} color="outlined">Close</Button>
                <Button onClick={() => console.log(dialogRef)} color="outlined">Submit</Button>
            </div>
        </dialog>
    ) 
}
