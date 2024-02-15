import { User } from "../types/user";
import { BaseUrl } from "./baseUrl";

export async function login(identifier: string, password: string): Promise<User> {
    if (identifier.length < 4 || password.length < 4) {
        throw "Incorrect name, email or password";
    }
    
    const res = await fetch(`${BaseUrl}/users/login`, {
        method: "POST",
        body: JSON.stringify({ identifier, password })
    });

    if (res.status === 401) {
        throw "Incorrect password";
    }
    if (res.status === 404) {
        throw "No account matches given username or email"
    }

    const user: User = await res.json();
    return user;
}

export async function register() {
    
}