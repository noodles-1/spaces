package me.chowlong.userservice.exception.user;

public class UserAlreadyExistsException extends Exception {
    @Override
    public String getMessage() {
        return "User already exists.";
    }
}
