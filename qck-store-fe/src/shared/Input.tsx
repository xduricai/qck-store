import { useId } from "react";
import { TextInputValidator } from "../types/inputValidators";

type InputProps = {
    value: string;
    placeholder: string;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    label?: string;
    type?: string;
    className?: string;
    validator?: TextInputValidator;
}

export function Input({ value, placeholder, onChange, name, type, label, className="" }: InputProps) {
    const id = useId();
    
    return (
        <div className="flex flex-col gap-1">
            {label && 
                <label className="text-sm font-semibold" htmlFor={id}>
                    {label}
                </label>
            }
            <input 
                id={id}
                placeholder={placeholder}
                value={value} 
                name={name}
                type={type}
                onChange={(event) => onChange(event)} 
                className={`w-60 rounded px-3 py-1.5 text-base placeholder:text-gray-600 box-border
                focus:border-[2px] border-zinc-400 focus:border-zinc-800 focus:m-[-1px] border-[1px]
                border-transparent outline-none ${className}`}    
            />
        </div>
    )
}