package me.chowlong.userservice.config;

import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.chowlong.userservice.jwt.JwtService;
import me.chowlong.userservice.jwt.cookie.CookieService;
import me.chowlong.userservice.principal.UserPrincipal;
import me.chowlong.userservice.user.User;
import me.chowlong.userservice.user.UserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    private final JwtService jwtService;
    private final UserService userService;
    private final CookieService cookieService;

    public JwtAuthenticationFilter(
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver handlerExceptionResolver,
            JwtService jwtService,
            UserService userService,
            CookieService cookieService
    ) {
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.jwtService = jwtService;
        this.userService = userService;
        this.cookieService = cookieService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String requestURI = request.getRequestURI();
        if (
                requestURI.startsWith("/auth/login") ||
                requestURI.startsWith("/auth/register") ||
                requestURI.startsWith("/auth/token/refresh") ||
                requestURI.startsWith("/users/custom-username-exists") ||
                requestURI.startsWith("/users/info") ||
                requestURI.equals("/users/me") ||
                requestURI.startsWith("/users/me/authenticated")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String accessToken = this.cookieService.getSessionCookie(request);
            final String userId = this.jwtService.extractUserId(accessToken);
            User user = this.userService.getUserById(userId);

            if (!this.jwtService.isTokenValidAllowExpired(accessToken, user)) {
                throw new SignatureException("Access token signature is invalid.");
            }

            UserPrincipal userPrincipal = new UserPrincipal(user, accessToken);
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
