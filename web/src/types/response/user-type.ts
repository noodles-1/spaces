interface UserResponse {
    customUsername: string | null;
    provider: string;
    providerUsername: string;
    profilePictureUrl: string | null;
    setupDone: boolean;
};

export interface User {
    user: UserResponse;
};