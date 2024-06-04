export type UserUpdateCommand = {
    updatePicture: boolean;
    updateEmail: boolean;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
}