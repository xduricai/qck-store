import { BaseUrl } from "./BaseUrl";
import { UserDetails } from "./responses/UserDetails";

export async function getUsers() {
    const res = await fetch(`${BaseUrl}/admin/users`, { 
        credentials: "include"
    });
    if (res.status !== 200) throw "Could not retrieve users";

    const users: UserDetails[] = await res.json();
    return users || [];
}

export async function searchUsers(query: string) {
    const res = await fetch(`${BaseUrl}/admin/search/${query}`, { 
        credentials: "include"
    });
    if (res.status !== 200) throw "Could not retrieve users";

    const users: UserDetails[] = await res.json();
    return users || [];
}