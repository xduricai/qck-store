import { RegistrationCommand } from "./commands/RegistrationCommand";
import { User } from "./responses/User";
import { BaseUrl } from "./BaseUrl";
import { RegistrationResponse } from "./responses/RegistrationResponse";

export async function login(identifier: string, password: string) {
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

export async function register(data: RegistrationCommand) {
    const res = await fetch(`${BaseUrl}/users/register`, {
        method: "POST",
        body: JSON.stringify(data)
    });
    if (res.status !== 200) {
        throw new Error();
    }

    const response: RegistrationResponse = await res.json();
    return response;
}