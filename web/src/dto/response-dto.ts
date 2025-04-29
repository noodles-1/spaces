import { ApplicationErrorCode } from "@/types/app-error-code-type";
import { AuthenticationErrorCode } from "@/types/auth-error-code-type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResponseDto<T = any> {
    status: number;
    message: string;
    data?: T;
    errorCode?: ApplicationErrorCode | AuthenticationErrorCode;
};