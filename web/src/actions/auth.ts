import { ResponseDto } from "@/dto/response-dto";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function userExistsByProviderEmail(providerEmail: string): Promise<boolean> {
    const response = await fetch(`${SERVER_URL}/user/users/provider-email-exists/${providerEmail}`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Something went wrong with the request.");
    }

    const responseData: ResponseDto = await response.json();

    if (responseData.status !== 200) {
        throw new Error(`${responseData.message}`);
    }

    if (responseData.data && responseData.data.userExists) {
        return true;
    }
    
    return false;
}