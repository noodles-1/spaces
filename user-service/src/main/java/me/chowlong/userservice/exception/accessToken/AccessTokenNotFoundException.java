package me.chowlong.userservice.exception.accessToken;

public class AccessTokenNotFoundException extends Exception {
    @Override
    public String getMessage() {
        return "Access token cannot be found.";
    }
}
