package me.chowlong.userservice.constant;

public class ApplicationConstants {
    public static final String[] PUBLIC_URLS = {
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/auth/login/**",
            "/auth/register",
            "/auth/token/refresh",
            "/users/custom-username-exists/**",
            "/users/info/**",
            "/users/me",
            "/users/me/authenticated"
    };
}
