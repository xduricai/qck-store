import { useEffect, useRef } from "react";
import { User } from "../api/responses/User";

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

export function Tracker({ user, className = "" }: { user: User, className?: string }) {
    const barRef = useRef<HTMLDivElement>(null);
    const input = getTrackerInput(user!.bytesUsed, user!.bytesTotal);
    
    useEffect(() => {
        if (barRef.current) {
            barRef.current.style.width = input.percentage; 
        }
    }, [barRef, input])
    
    return (
        <div className={`flex flex-col ${className}`}>
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