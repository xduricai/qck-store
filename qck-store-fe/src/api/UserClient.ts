import { RegistrationCommand } from "./commands/RegistrationCommand";
import { User } from "./responses/User";
import { BaseUrl } from "./BaseUrl";
import { RegistrationResponse } from "./responses/RegistrationResponse";
import { UserUpdateCommand } from "./commands/UserUpdateCommand";
import { PasswordUpdateCommand } from "./commands/PasswordUpdateCommand";

type UserUpdateResult = { email: string, emailError?: string }

export async function authenticate() {
    const res = await fetch(`${BaseUrl}/users/authenticate`, { 
        credentials: "include"
    });
    if (res.status !== 200) throw "An error occurred during authentication";

    const user: User = await res.json();
    return user;
}

export async function login(identifier: string, password: string) {
    if (identifier.length < 4 || password.length < 4) {
        throw "Incorrect name, email or password";
    }
    
    const res = await fetch(`${BaseUrl}/users/login`, {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
        credentials: "include"
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

export async function logout() {
    const res = await fetch(`${BaseUrl}/users/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (res.status !== 200) {
        throw "An unknown error occurred while logging out"
    }
}

export async function register(data: RegistrationCommand) {
    const res = await fetch(`${BaseUrl}/users/register`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include"
    });
    if (res.status !== 200 && res.status !== 400) {
        throw "An unknown error occurred during registration"
    }

    const response: RegistrationResponse = await res.json();
    return response;
}

export async function updateUser(data: UserUpdateCommand) {
    const res = await fetch(`${BaseUrl}/users/update`, {
        method: "PATCH",
        body: JSON.stringify(data),
        credentials: "include"
    });

    if (res.status === 400) {
        throw "Could not update information, some fields are invalid";
    }
    if (res.status !== 200 && res.status !== 409) {
        throw "An unknown error occurred while updating settings"
    }

    const email: string = await res.text();
    const emailError = res.status === 409 ? "This email is already in use" : undefined;
    return { email, emailError } as UserUpdateResult;
}

export async function updatePassword(data: PasswordUpdateCommand) {
    const res = await fetch(`${BaseUrl}/users/password`, {
        method: "PATCH",
        body: JSON.stringify(data),
        credentials: "include"
    });

    if (res.status !== 200 && res.status !== 401) {
        throw "An unknown error occurred while updating password"
    }
    return res.status === 200;
}