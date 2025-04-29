package me.chowlong.userservice.exception.handler;

import com.amazonaws.AmazonClientException;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import me.chowlong.userservice.enums.ApplicationErrorCode;
import me.chowlong.userservice.enums.AuthenticationErrorCode;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotExpiredException;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.userservice.exception.cookie.MissingCookieException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenExpiredException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenInvalidException;
import me.chowlong.userservice.exception.user.CustomUsernameInvalidException;
import me.chowlong.userservice.exception.user.InvalidImageFileException;
import me.chowlong.userservice.exception.user.UserAlreadyExistsException;
import me.chowlong.userservice.exception.user.UserNotFoundException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.FileNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGlobalExceptions(Exception exception) {
        ProblemDetail problemDetail = null;

        if (exception instanceof AccessDeniedException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("message", "You are not authorized to access this resource.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.ACCESS_DENIED);
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
        else if (exception instanceof ExpiredJwtException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "The JWT provided has already expired.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_EXPIRED);
        }
        else if (exception instanceof RequestNotPermitted) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(429), exception.getMessage());
            problemDetail.setProperty("message", "Too many requests have been made to the server.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.TOO_MANY_REQUESTS);
        }
        else if (exception instanceof AccessTokenNotExpiredException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Cannot refresh tokens because the access token is not yet expired.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_NOT_EXPIRED);
        }
        else if (exception instanceof AccessTokenNotFoundException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Access token cannot be found in the request.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.ACCESS_TOKEN_NOT_FOUND);
        }
        else if (exception instanceof RefreshTokenExpiredException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Cannot refresh tokens because the refresh token for this access token has already expired.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.REFRESH_TOKEN_EXPIRED);
        }
        else if (exception instanceof RefreshTokenInvalidException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Cannot refresh tokens because the refresh token for this access token is either invalid or malformed.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.REFRESH_TOKEN_INVALID);
        }
        else if (exception instanceof MissingCookieException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "HttpOnly cookie not found in the request.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.COOKIES_NOT_FOUND);
        }
        else if (exception instanceof AmazonClientException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), exception.getMessage());
            problemDetail.setProperty("message", "An internal server error occurred with Amazon SDK client.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.AMAZON_SDK_ERROR);
        }
        else if (exception instanceof UserNotFoundException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "User does not exist.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.USER_NOT_FOUND);
        }
        else if (exception instanceof UserAlreadyExistsException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "User already exists.");
            problemDetail.setProperty("errorCode", AuthenticationErrorCode.USER_ALREADY_EXISTS);
        }
        else if (exception instanceof FileNotFoundException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Cannot find file in request body form data.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.FILE_NOT_FOUND);
        }
        else if (exception instanceof InvalidImageFileException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Attached file form data is not an image.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.INVALID_IMAGE_FILE);
        }
        else if (exception instanceof CustomUsernameInvalidException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(400), exception.getMessage());
            problemDetail.setProperty("message", "Custom username is invalid.");
            problemDetail.setProperty("errorCode", ApplicationErrorCode.CUSTOM_USERNAME_INVALID);
        }

        if (problemDetail == null) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), exception.getMessage());
            problemDetail.setProperty("message", exception.getClass());
            problemDetail.setProperty("errorCode", ApplicationErrorCode.DEFAULT);
        }

        return problemDetail;
    }
}
