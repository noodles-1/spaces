package me.chowlong.storageservice.storageservice.exception.accessToken;

public class AccessTokenExpiredException extends Exception {
    @Override
    public String getMessage() {
        return "Access token is already expired.";
    }
}
