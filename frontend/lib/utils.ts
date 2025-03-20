import {ClassValue, clsx} from "clsx";
import { twMerge } from "tailwind-merge";

const SEC_PER_DAY = 86400;
const SEC_PER_HOUR = 3600;

/**
 * cn() Used to merge multiple Tailwind CSS class names and automatically remove duplicate classes.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// used by notificaiton list
export function formatTimeDifference(inputTime: Date) {
    const currTime = new Date();

    const timeDiff = (inputTime.getTime() - currTime.getTime()) / 1000;
    const daysDiff = Math.floor(timeDiff / SEC_PER_DAY);
    const hoursDiff = Math.floor((timeDiff - daysDiff * SEC_PER_DAY) / SEC_PER_HOUR) % 24;

    return `${daysDiff} Days, ${hoursDiff} Hours`;
}
