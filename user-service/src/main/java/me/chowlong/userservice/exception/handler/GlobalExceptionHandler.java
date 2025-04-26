package me.chowlong.userservice.exception.handler;

import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import me.chowlong.userservice.enums.ErrorCode;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotExpiredException;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.userservice.exception.cookie.MissingCookieException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenExpiredException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenInvalidException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGlobalExceptions(Exception exception) {
        ProblemDetail problemDetail = null;

        if (exception instanceof AccessDeniedException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("description", "You are not authorized to access this resource.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_DENIED);
        }
        else if (exception instanceof SignatureException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "The JWT signature is invalid.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_TOKEN_INVALID);
        }
        else if (exception instanceof MalformedJwtException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "The JWT provided is malformed.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_TOKEN_MALFORMED);
        }
        else if (exception instanceof ExpiredJwtException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "The JWT provided has already expired.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_TOKEN_EXPIRED);
        }
        else if (exception instanceof MissingRequestHeaderException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "No authorization header found in the request.");
            problemDetail.setProperty("errorCode", ErrorCode.AUTHORIZATION_HEADER_NOT_FOUND);
        }
        else if (exception instanceof RequestNotPermitted) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(429), exception.getMessage());
            problemDetail.setProperty("description", "Too many requests have been made to the server.");
            problemDetail.setProperty("errorCode", ErrorCode.TOO_MANY_REQUESTS);
        }
        else if (exception instanceof AccessTokenNotExpiredException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "Cannot refresh tokens because the access token is not yet expired.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_TOKEN_NOT_EXPIRED);
        }
        else if (exception instanceof AccessTokenNotFoundException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "Access token cannot be found in the request.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_TOKEN_NOT_FOUND);
        }
        else if (exception instanceof RefreshTokenExpiredException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "Cannot refresh tokens because the refresh token for this access token has already expired.");
            problemDetail.setProperty("errorCode", ErrorCode.REFRESH_TOKEN_EXPIRED);
        }
        else if (exception instanceof RefreshTokenInvalidException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "Cannot refresh tokens because the refresh token for this access token is either invalid or malformed.");
            problemDetail.setProperty("errorCode", ErrorCode.REFRESH_TOKEN_INVALID);
        }
        else if (exception instanceof MissingCookieException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("description", "HttpOnly cookie not found in the request.");
            problemDetail.setProperty("errorCode", ErrorCode.COOKIES_NOT_FOUND);
        }

        if (problemDetail == null) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), exception.getMessage());
            problemDetail.setProperty("description", exception.getClass());
            problemDetail.setProperty("errorCode", ErrorCode.DEFAULT);
        }

        return problemDetail;
    }
}
