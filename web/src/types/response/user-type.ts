interface UserResponse {
    customUsername: string;
    providerEmail: string;
    providerUsername: string;
    profilePictureUrl: string;
};

export interface User {
    user: UserResponse;
};