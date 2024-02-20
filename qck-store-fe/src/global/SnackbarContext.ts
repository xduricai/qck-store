import { createContext, useContext } from "react";
import { SnackbarStyle } from "./Snackbar";

export type SnackbarContext = (message: string, style?: SnackbarStyle, duration?: number) => void;

export const SnackbarContext = createContext<SnackbarContext>(() => null);
export const useSnackbarContext = () => useContext<SnackbarContext>(SnackbarContext);