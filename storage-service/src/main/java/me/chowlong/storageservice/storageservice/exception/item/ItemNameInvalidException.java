package me.chowlong.storageservice.storageservice.exception.item;

public class ItemNameInvalidException extends Exception {
    @Override
    public String getMessage() {
        return "Item name is invalid.";
    }
}
