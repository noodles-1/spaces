package me.chowlong.userservice.exception.refreshToken;

public class RefreshTokenInvalidException extends Exception {
    @Override
    public String getMessage() {
        return "Refresh token is either invalid or malformed.";
    }
}
