import { useRef } from "react";
import { useUserContext } from "../global/UserContext";

type TrackerInput = {
    used: string;
    total: string;
    percentage: string;
}

function getTrackerInput(used: number, total: number) {
    let coef: number;
    let unit: string;

    if (total < 1000) {
        coef = 1;
        unit = "B";
    } else if (total < 1000000) {
        coef = 1000;
        unit = "KB";
    } else if (total < 1000000000) {
        coef = 1000000;
        unit = "MB";
    } else {
        coef = 1000000000;
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
    const userContext = useUserContext();
    
    const used = userContext.user?.bytesUsed || 0;
    const total = userContext.user?.bytesTotal || 0;
    const input = getTrackerInput(used, total); 

    if (barRef.current) {
        barRef.current.style.width = input.percentage; 
    }
    
    return (
        <div className="flex flex-col mt-auto pt-2 pb-4 px-4 border-t border-gray-400">
            <span className="mb-1 px-[1px]">Storage Used</span>
            <div className="h-2 rounded-lg bg-purple-200">
                <div ref={barRef} className="h-full rounded-lg bg-purple-800" />
            </div>

            <div className="flex justify-between px-[1px]">
                <span className="text-[13px]">{input.used}</span>
                <span className="text-[13px]">{input.total}</span>
            </div>
        </div>
    );
}