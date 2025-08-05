package me.chowlong.storageservice.storageservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.chowlong.storageservice.storageservice.exception.accessToken.AccessTokenExpiredException;
import me.chowlong.storageservice.storageservice.jwt.JwtService;
import me.chowlong.storageservice.storageservice.jwt.cookie.CookieService;
import me.chowlong.storageservice.storageservice.principal.UserPrincipal;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final CookieService cookieService;

    public JwtAuthenticationFilter(
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver handlerExceptionResolver,
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
            if (
                    request.getRequestURI().startsWith("/permissions/public") ||
                    request.getRequestURI().startsWith("/items/public") ||
                    request.getRequestURI().startsWith("/starred/public")
            ) {
                filterChain.doFilter(request, response);
                return;
            }

            final String accessToken = this.cookieService.getSessionCookie(request);

            if (this.jwtService.isTokenExpired(accessToken)) {
                throw new AccessTokenExpiredException();
            }

            final String userId = this.jwtService.extractUserId(accessToken);

            UserPrincipal userPrincipal = new UserPrincipal(userId, accessToken);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userPrincipal, null, List.of());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);
        }
        catch (Exception exception) {
            this.handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}
