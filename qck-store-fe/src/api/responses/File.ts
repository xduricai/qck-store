export type File = {
    id: number;
    size: number;
    name: string;
    modified: string;
    created: string;
}

const onePow = 1024;
const twoPow = Math.pow(1024, 2);
const threePow = Math.pow(1024, 3);

export function getFormattedSize(size: number) {
    if (size < onePow) 
        return `${size}B`;
    if (size < twoPow) 
        return `${(size / onePow).toFixed(2)}KB`;
    if (size < threePow) 
        return `${(size / twoPow).toFixed(2)}MB`;
   
    return `${(size / threePow).toFixed(2)}GB`;
}