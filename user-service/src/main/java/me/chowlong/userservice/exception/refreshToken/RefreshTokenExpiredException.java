package me.chowlong.userservice.exception.refreshToken;

public class RefreshTokenExpiredException extends Exception {
    @Override
    public String getMessage() {
        return "Refresh token has already expired.";
    }
}
