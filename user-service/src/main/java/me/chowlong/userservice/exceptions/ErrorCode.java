package me.chowlong.userservice.exceptions;

public enum ErrorCode {
    ACCESS_DENIED,
    JWT_INVALID,
    JWT_MALFORMED,
    JWT_EXPIRED,
    AUTHORIZATION_HEADER_NOT_FOUND
}
