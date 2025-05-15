package me.chowlong.storageservice.storageservice.exception.accessToken;

public class AccessTokenNotFoundException extends Exception {
    @Override
    public String getMessage() {
        return "Access token cannot be found.";
    }
}
