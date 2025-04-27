package me.chowlong.userservice.exception.user;

public class InvalidImageFileException extends Exception {
    @Override
    public String getMessage() {
        return "Invalid file content type in request body form data. File should be a JPG, JPEG, or PNG only.";
    }
}
