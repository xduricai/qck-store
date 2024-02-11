import { useId } from "react";

type InputProps = {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export function Input({ value, placeholder, onChange, label='', className='' }: InputProps) {
    const id = useId();
    
    return (
        <div className='flex flex-col gap-1'>
            {label && 
                <label className='text-sm font-semibold' htmlFor={id}>
                    {label}
                </label>
            }
            <input 
                id={id}
                placeholder={placeholder}
                value={value} 
                onChange={(event) => onChange(event.target.value)} 
                className={`w-60 rounded px-3 py-1.5 text-base placeholder:text-gray-600 box-border
                focus:border-[2px] border-zinc-400 focus:border-zinc-800 focus:m-[-1px] border-[1px]
                border-transparent outline-none ${className}`}    
            />
        </div>
    )
}