package me.chowlong.storageservice.storageservice.exception.handler;

import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import me.chowlong.storageservice.storageservice.enums.ApplicationErrorCode;
import me.chowlong.storageservice.storageservice.enums.AuthenticationErrorCode;
import me.chowlong.storageservice.storageservice.exception.accessToken.AccessTokenExpiredException;
import me.chowlong.storageservice.storageservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.storageservice.storageservice.exception.cookie.MissingCookieException;
import me.chowlong.storageservice.storageservice.exception.item.ItemNameInvalidException;
import me.chowlong.storageservice.storageservice.exception.userPermission.InsufficientPermissionException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGlobalExceptions(Exception exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), exception.getMessage());
        problemDetail.setProperty("message", exception.getClass());
        problemDetail.setProperty("errorCode", ApplicationErrorCode.DEFAULT);

        if (exception instanceof AccessDeniedException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("message", "You are not authorized to access this resource.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.ACCESS_DENIED);
        }
        else if (exception instanceof RequestNotPermitted) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(429), exception.getMessage());
            problemDetail.setProperty("message", "Too many requests have been made to the server.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.TOO_MANY_REQUESTS);
        }
        else if (exception instanceof SignatureException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "The JWT signature is invalid.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_INVALID);
        }
        else if (exception instanceof MalformedJwtException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "The JWT provided is malformed.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_MALFORMED);
        }
        else if (exception instanceof ExpiredJwtException || exception instanceof AccessTokenExpiredException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "The JWT provided has already expired.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_EXPIRED);
        }
        else if (exception instanceof AccessTokenNotFoundException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Access token cannot be found in the request.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_NOT_FOUND);
        }
        else if (exception instanceof MissingCookieException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "HttpOnly cookie not found in the request.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.COOKIES_NOT_FOUND);
        }
        else if (exception instanceof ItemNameInvalidException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Item name is invalid.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.ITEM_NAME_INVALID);
        }
        else if (exception instanceof InsufficientPermissionException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("message", "Insufficient permission.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.INSUFFICIENT_PERMISSION);
        }

        return problemDetail;
    }
}
