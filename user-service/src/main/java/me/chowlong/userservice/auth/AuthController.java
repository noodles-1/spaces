package me.chowlong.userservice.auth;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import me.chowlong.userservice.auth.dto.LoginRequestDTO;
import me.chowlong.userservice.auth.dto.RegisterRequestDTO;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotExpiredException;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenExpiredException;
import me.chowlong.userservice.exception.refreshToken.RefreshTokenInvalidException;
import me.chowlong.userservice.exception.user.CustomUsernameInvalidException;
import me.chowlong.userservice.exception.user.UserAlreadyExistsException;
import me.chowlong.userservice.exception.user.UserNotFoundException;
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

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

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
    ) throws UserNotFoundException {
        if (!this.userService.userExistsByProviderEmail(loginRequestDTO.getProviderEmail())) {
            throw new UserNotFoundException();
        }

        User user = this.userService.getUserByProviderEmail(loginRequestDTO.getProviderEmail());
        String accessToken = this.jwtService.generateAccessToken(user);
        String refreshToken = this.jwtService.generateRefreshToken(user);
        this.refreshTokenService.createRefreshToken(accessToken, refreshToken);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", user);
        this.cookieService.setSessionCookie(response, accessToken);
        return ResponseHandler.generateResponse("User logged-in successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(
            @NonNull HttpServletResponse response,
            @Valid @RequestBody RegisterRequestDTO authRequestDTO
    ) throws UserAlreadyExistsException, CustomUsernameInvalidException {
        if (this.userService.userExistsByProviderEmail(authRequestDTO.getProviderEmail())) {
            throw new UserAlreadyExistsException();
        }

        String customUsername = authRequestDTO.getCustomUsername();
        if (customUsername.length() < 4 || 20 < customUsername.length()) {
            throw new CustomUsernameInvalidException();
        }

        Pattern customUsernamePattern = Pattern.compile("^[a-zA-Z0-9]+$");
        if (!customUsernamePattern.matcher(customUsername).matches()) {
            throw new CustomUsernameInvalidException();
        }

        User user = this.userService.createUser(authRequestDTO);
        String accessToken = this.jwtService.generateAccessToken(user);
        String refreshToken = this.jwtService.generateRefreshToken(user);
        this.refreshTokenService.createRefreshToken(accessToken, refreshToken);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", user);
        this.cookieService.setSessionCookie(response, accessToken);
        return ResponseHandler.generateResponse("User registered successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/sign-out")
    public ResponseEntity<Object> signOut(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response
    ) throws Exception {
        String accessToken = this.cookieService.getSessionCookie(request);
        RefreshToken refreshToken = this.refreshTokenService.getRefreshTokenByAccessToken(accessToken);

        this.refreshTokenService.deleteRefreshToken(refreshToken);
        this.cookieService.deleteSessionCookie(response);

        return ResponseHandler.generateResponse("User signed-out successfully.", HttpStatus.OK, null);
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
