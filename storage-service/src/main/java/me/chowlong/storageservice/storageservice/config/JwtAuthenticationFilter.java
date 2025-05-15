package me.chowlong.storageservice.storageservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.chowlong.storageservice.storageservice.exception.accessToken.AccessTokenExpiredException;
import me.chowlong.storageservice.storageservice.jwt.JwtService;
import me.chowlong.storageservice.storageservice.jwt.cookie.CookieService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final CookieService cookieService;

    public JwtAuthenticationFilter(
            HandlerExceptionResolver handlerExceptionResolver,
            JwtService jwtService,
            CookieService cookieService
    ) {
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) {
        try {
            final String accessToken = this.cookieService.getSessionCookie(request);

            if (this.jwtService.isTokenExpired(accessToken)) {
                throw new AccessTokenExpiredException();
            }

            filterChain.doFilter(request, response);
        }
        catch (Exception exception) {
            this.handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}
