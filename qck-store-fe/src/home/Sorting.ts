import { Directory } from "../api/responses/Directory";
import { File } from "../api/responses/File";

export type ItemCompareFn = <T extends File | Directory>(a: T, b: T) => number;
export type SortOption = {
    name: string;
    compareFn: ItemCompareFn;
};

function namesAsc<T extends File | Directory>(a: T, b: T): number {
    if (a.name === b.name) return 0;
    if (a.name < b.name) return -1;
    return 1;
}

function namesDesc<T extends File | Directory>(a: T, b: T): number {
    if (a.name === b.name) return 0;
    if (a.name > b.name) return -1;
    return 1;
}

function datesAsc<T extends File | Directory>(a: T, b: T): number {
    //TODO implement
    return 1;
}

function datesDesc<T extends File | Directory>(a: T, b: T): number {
    //TODO implement
    return 1;
}

export function getSortOptions(): SortOption[] {
    return [
        { name: "Name: A-Z", compareFn: namesAsc },
        { name: "Name: Z-A", compareFn: namesDesc },
        { name: "Newest", compareFn: datesAsc },
        { name: "Oldest", compareFn: datesDesc },
    ];
}