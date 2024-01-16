interface InputProps {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    className?: string;
}

export function Input({ value, placeholder, onChange, className='' }: InputProps): JSX.Element {
    return (
        <input 
            value={value} 
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)} 
            className={`w-60 rounded px-3 py-1.5 text-base placeholder:text-gray-600
            focus:border-2 focus:border-zinc-800 border-2 border-transparent outline-none ${className}`}    
        />
    )
}