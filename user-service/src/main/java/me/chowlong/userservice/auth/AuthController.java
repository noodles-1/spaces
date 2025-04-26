package me.chowlong.userservice.auth;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import me.chowlong.userservice.auth.dto.LoginRequestDTO;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotExpiredException;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenExpiredException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenInvalidException;
import me.chowlong.userservice.jwt.JwtService;
import me.chowlong.userservice.jwt.cookie.CookieService;
import me.chowlong.userservice.jwt.refreshToken.RefreshToken;
import me.chowlong.userservice.jwt.refreshToken.RefreshTokenService;
import me.chowlong.userservice.user.User;
import me.chowlong.userservice.user.UserService;
import me.chowlong.userservice.util.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RateLimiter(name = "auth-controller")
public class AuthController {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private CookieService cookieService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @NonNull HttpServletResponse response,
            @Valid @RequestBody LoginRequestDTO loginRequestDTO
    ) {
        Map<String, Object> responseData = new HashMap<>();
        User user;

        if (!this.userService.userExistsByProviderEmail(loginRequestDTO.getProviderEmail())) {
            user = this.userService.createUser(loginRequestDTO);
        }
        else {
            user = this.userService.getUserByProviderEmail(loginRequestDTO.getProviderEmail());
        }

        String accessToken = this.jwtService.generateAccessToken(user);
        String refreshToken = this.jwtService.generateRefreshToken(user);
        this.refreshTokenService.createRefreshToken(accessToken, refreshToken);

        responseData.put("user", user);
        this.cookieService.setSessionCookie(response, accessToken);
        return ResponseHandler.generateResponse("User logged-in successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<Object> generateNewTokens(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response
    ) throws Exception {
        String accessToken = this.cookieService.getSessionCookie(request);

        if (!this.jwtService.isTokenExpiredAllowExpired(accessToken)) {
            throw new AccessTokenNotExpiredException();
        }
        if (!this.refreshTokenService.refreshTokenExistsByAccessToken(accessToken)) {
            throw new AccessTokenNotFoundException();
        }

        String userId = this.jwtService.extractUserIdAllowExpired(accessToken);
        User user = this.userService.getUserById(userId);

        RefreshToken refreshToken = this.refreshTokenService.getRefreshTokenByAccessToken(accessToken);

        if (this.jwtService.isTokenExpiredAllowExpired(refreshToken.getRefreshToken())) {
            throw new RefreshTokenExpiredException();
        }
        if (!this.jwtService.isTokenValidAllowExpired(refreshToken.getRefreshToken(), user)) {
            throw new RefreshTokenInvalidException();
        }

        this.refreshTokenService.deleteRefreshToken(refreshToken);

        String newAccessToken = this.jwtService.generateAccessToken(user);
        String newRefreshToken = this.jwtService.generateRefreshToken(user);
        this.refreshTokenService.createRefreshToken(newAccessToken, newRefreshToken);

        this.cookieService.setSessionCookie(response, newAccessToken);
        return ResponseHandler.generateResponse("Tokens successfully refreshed.", HttpStatus.OK, null);
    }
}
