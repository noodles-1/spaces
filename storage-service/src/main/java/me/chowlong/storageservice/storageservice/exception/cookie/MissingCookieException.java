package me.chowlong.storageservice.storageservice.exception.cookie;

public class MissingCookieException extends Exception {
    @Override
    public String getMessage() {
        return "HttpOnly cookie not found in the request.";
    }
}
