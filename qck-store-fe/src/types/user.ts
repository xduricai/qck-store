export type User = {
    id: number;
    role: "user" | "admin";
    firstName: string;
    lastName: string;
}