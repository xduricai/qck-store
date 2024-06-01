export type User = {
    id: number;
    role: "user" | "admin";
    email: string;
    firstName: string;
    lastName: string;
    bytesUsed: number;
    bytesTotal: number;
}