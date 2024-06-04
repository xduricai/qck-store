import { useRef } from "react";
import { useUserContext } from "../global/UserContext";

type TrackerInput = {
    used: string;
    total: string;
    percentage: string;
}

const onePow = 1024;
const twoPow = Math.pow(1024, 2);
const threePow = Math.pow(1024, 3);

function getTrackerInput(used: number, total: number) {
    let coef: number;
    let unit: string;

    if (total < onePow) {
        coef = 1;
        unit = "B";
    } else if (total < twoPow) {
        coef = onePow;
        unit = "KB";
    } else if (total < threePow) {
        coef = twoPow;
        unit = "MB";
    } else {
        coef = threePow;
        unit = "GB";
    }

    const usedDisplay = (used / coef);
    const totalDisplay = (total / coef);
    const percentage = Math.min(Math.round(usedDisplay / totalDisplay * 100), 100);

    return {
        used: `${usedDisplay.toFixed(2)}${unit}`,
        total: `${totalDisplay.toFixed(2)}${unit}`,
        percentage: `${percentage}%`
    } as TrackerInput;
}

export function Tracker() {
    const barRef = useRef<HTMLDivElement>(null);
    const { user } = useUserContext();
    
    const used = user!.bytesUsed;
    const total = user!.bytesTotal;
    const input = getTrackerInput(used, total); 
    
    if (barRef.current) {
        barRef.current.style.width = input.percentage; 
    }
    
    return (
        <div className="flex flex-col mt-auto pt-2 pb-4 px-4 border-t border-gray-400">
            <span className="mb-1 px-[1px]">Storage Used</span>
            <div className="h-2 rounded-lg bg-purple-200">
                <div ref={barRef} className={`h-full rounded-lg bg-purple-800 ${barRef.current ? '' : 'w-0'}`} />
            </div>

            <div className="flex justify-between px-[1px]">
                <span className="text-[13px]">{input.used}</span>
                <span className="text-[13px]">{input.total}</span>
            </div>
        </div>
    );
}