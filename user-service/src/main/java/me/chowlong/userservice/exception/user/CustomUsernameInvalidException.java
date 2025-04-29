package me.chowlong.userservice.exception.user;

public class CustomUsernameInvalidException extends Exception {
    @Override
    public String getMessage() {
        return "Custom username is invalid.";
    }
}
