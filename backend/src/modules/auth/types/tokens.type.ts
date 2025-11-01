// defines the structure for the access token and refresh token pait

export type Tokens = {
    access_token: string;
    refresh_token: string;
    role: 'CUSTOMER' | 'ADMIN';
}