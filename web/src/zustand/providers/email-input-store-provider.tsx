"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type EmailInputStore,
    createEmailInputStore,
} from "@/zustand/stores/email-input-store";

export type EmailInputStoreApi = ReturnType<typeof createEmailInputStore>;

export const EmailInputStoreContext = createContext<EmailInputStoreApi | undefined>(
    undefined,
);

export const EmailInputStoreProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const storeRef = useRef<EmailInputStoreApi | null>(null);

    if (storeRef.current === null) storeRef.current = createEmailInputStore();

    return (
        <EmailInputStoreContext.Provider value={storeRef.current}>
            {children}
        </EmailInputStoreContext.Provider>
    );
};

export const useEmailInputStore = <T,>(
    selector: (store: EmailInputStore) => T,
): T => {
    const emailInputStoreContext = useContext(EmailInputStoreContext);

    if (!emailInputStoreContext)
        throw new Error(
            "useEmailInputStore must be within EmailInputStoreProvider",
        );

    return useStore(emailInputStoreContext, selector);
};
