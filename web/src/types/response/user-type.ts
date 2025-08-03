export interface UserResponse {
    id: string;
    customUsername: string | null;
    provider: string;
    providerUsername: string;
    profilePictureUrl: string | null;
    setupDone: boolean;
};

export interface User {
    user: UserResponse;
};