import { useId } from "react";

type InputProps = {
    value: string;
    placeholder: string;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
    width?: string;
    name?: string;
    label?: string;
    type?: string;
    className?: string;
    validator?: TextInputValidator;
}

type TextInputValidator = {
    error: string | null;
    validate?: (value: string) => void;
}

export function Input({ value, placeholder, onChange, width, name, type, label, className, validator }: InputProps) {
    const id = useId();
    const margin = validator && !validator.error?.length ? 'mb-5' : '';
    
    return (
        <div className={`w-60 flex flex-col gap-1 ${margin} ${width}`}>
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
                onChange={async (event) => {
                    if (validator?.validate) validator.validate(event.target.value);
                    onChange(event);
                }} 
                className={`w-full rounded px-3 py-1.5 text-base placeholder:text-gray-600 box-border
                focus:border-[2px] border-zinc-400 focus:border-zinc-800 focus:m-[-1px] border-[1px]
                border-transparent outline-none ${className}`}    
            />
            {validator?.error && 
            <span className="text-xs font-semibold text-red-600">
                {validator.error}
            </span>
            }
        </div>
    )
}