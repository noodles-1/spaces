package me.chowlong.userservice.exceptions;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleSecurityException(Exception exception) {
        ProblemDetail problemDetail = null;

        if (exception instanceof AccessDeniedException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("description", "You are not authorized to access this resource.");
            problemDetail.setProperty("errorCode", ErrorCode.ACCESS_DENIED);
        }
        else if (exception instanceof SignatureException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("description", "The JWT signature is invalid.");
            problemDetail.setProperty("errorCode", ErrorCode.JWT_INVALID);
        }
        else if (exception instanceof MalformedJwtException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("description", "The JWT provided is malformed.");
            problemDetail.setProperty("errorCode", ErrorCode.JWT_MALFORMED);
        }
        else if (exception instanceof ExpiredJwtException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("description", "The JWT provided has already expired.");
            problemDetail.setProperty("errorCode", ErrorCode.JWT_EXPIRED);
        }
        else if (exception instanceof MissingRequestHeaderException) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(403), exception.getMessage());
            problemDetail.setProperty("description", "No authorization header found in the request.");
            problemDetail.setProperty("errorCode", ErrorCode.AUTHORIZATION_HEADER_NOT_FOUND);
        }

        if (problemDetail == null) {
            problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(500), exception.getMessage());
            problemDetail.setProperty("description", exception.getClass());
            problemDetail.setProperty("errorCode", "OTHER");
        }

        return problemDetail;
    }
}
