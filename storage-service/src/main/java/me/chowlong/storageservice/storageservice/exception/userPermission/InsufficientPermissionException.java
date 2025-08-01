package me.chowlong.storageservice.storageservice.exception.userPermission;

public class InsufficientPermissionException extends Exception {
    @Override
    public String getMessage() {
        return "You do not have sufficient permission to create this request.";
    }
}
