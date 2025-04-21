import { createStore } from "zustand/vanilla";

export type EmailInputState = {
    email: string;
};

export type EmailInputActions = {
    setEmailInput: (email: string) => void;
};

export type EmailInputStore = EmailInputState & EmailInputActions;

export const defaultInitState: EmailInputState = {
    email: "",
};

export const createEmailInputStore = (
    initState: EmailInputState = defaultInitState,
) => {
    return createStore<EmailInputStore>()((set) => ({
        ...initState,
        setEmailInput: (email) => set(() => ({ email })),
    }));
};
