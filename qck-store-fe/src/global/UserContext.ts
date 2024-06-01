import { createContext, useContext } from "react";
import { User } from "../api/responses/User";

export type UserContext = {
    user?: User;
    setUser: (user?: User) => void;
}
export const CurrentUserContext = createContext<UserContext>({ user: undefined, setUser: () => null });
export const useUserContext = () => useContext<UserContext>(CurrentUserContext);