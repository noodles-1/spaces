package me.chowlong.userservice.exception.accessToken;

public class AccessTokenNotExpiredException extends Exception {
    @Override
    public String getMessage() {
        return "Cannot refresh tokens because access token is not yet expired.";
    }
}
