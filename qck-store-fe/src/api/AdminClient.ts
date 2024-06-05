import { BaseUrl } from "./BaseUrl";
import { User } from "./responses/User";

export async function getUsers() {
    const res = await fetch(`${BaseUrl}/admin/users`, { 
        credentials: "include"
    });
    if (res.status !== 200) throw "Could not retrieve users";

    const users: User[] = await res.json();
    return users;
}