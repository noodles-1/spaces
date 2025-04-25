package me.chowlong.userservice.exceptions;

public class AccessTokenNotFoundException extends Exception {
    @Override
    public String getMessage() {
        return "Access token cannot be found.";
    }
}
