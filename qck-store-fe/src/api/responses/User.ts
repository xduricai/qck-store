export type User = {
    role: "user" | "admin";
    email: string;
    firstName: string;
    lastName: string;
    bytesUsed: number;
    bytesTotal: number;
    profilePicture?: string;
}