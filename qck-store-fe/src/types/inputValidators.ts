export type TextInputValidator = {
    error: boolean;
    setError: (value: boolean) => void;
    validate: (...args) => boolean;
    errorText?: string;
}

export const DefaultTextInputValidator = {
    validate: (value: string) => !value,
    errorText: "This field is required"
}