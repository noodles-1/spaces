package me.chowlong.userservice.enums;

public enum ErrorCode {
    ACCESS_DENIED,
    JWT_INVALID,
    JWT_MALFORMED,
    JWT_EXPIRED,
    JWT_NOT_EXPIRED,
    JWT_NOT_FOUND,
    AUTHORIZATION_HEADER_NOT_FOUND,
    TOO_MANY_REQUESTS,
    DEFAULT
}
