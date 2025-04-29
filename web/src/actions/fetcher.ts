import { AxiosError } from "axios";
import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { redirect } from "next/navigation";

export async function fetcher(endpoint: string): Promise<ResponseDto> {
    try {
        const response = await axiosClient.get(endpoint, { headers: { "Content-Type": "application/json" } });
        return response.data as ResponseDto;
    } 
    catch (error) {
        const responseAxiosError = error as AxiosError;
        const data = responseAxiosError.response?.data as ResponseDto;

        if (["COOKIES_NOT_FOUND", "ACCESS_TOKEN_NOT_FOUND", "ACCESS_TOKEN_INVALID", "ACCESS_TOKEN_MALFORMED"].includes(data.errorCode as string)) {
            redirect("/login");
        }

        if (data.errorCode !== "ACCESS_TOKEN_EXPIRED") {
            return data;
        }

        try {
            await axiosClient.post("/user/auth/token/refresh");

            try {
                const retryResponse = await axiosClient.get(endpoint, { headers: { "Content-Type": "application/json" } });
                return retryResponse.data as ResponseDto;
            }
            catch (retryResponseError) {
                const retryResponseAxiosError = retryResponseError as AxiosError;
                return retryResponseAxiosError.response?.data as ResponseDto;
            }
        }
        catch (refreshTokenResponseError) {
            const refreshTokenResponseAxiosError = refreshTokenResponseError as AxiosError;
            const refreshTokenResponseErrorData = refreshTokenResponseAxiosError.response?.data as ResponseDto;
            
            if (["REFRESH_TOKEN_EXPIRED", "REFRESH_TOKEN_INVALID"].includes(refreshTokenResponseErrorData.errorCode as string)) {
                redirect("/login");
            }

            return refreshTokenResponseErrorData;
        }
    }
}