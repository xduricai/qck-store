import { User } from "./User";

export type UserDetails = User & {
    id: number;
    created: string;
    username: string;
}