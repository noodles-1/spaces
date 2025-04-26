package me.chowlong.userservice.exception.user;

public class UserNotFoundException extends Exception {
    @Override
    public String getMessage() {
        return "User not found.";
    }
}
