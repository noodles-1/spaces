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
import me.chowlong.userservice.exception.user.UserNotFoundException;
import me.chowlong.userservice.jwt.JwtService;
import me.chowlong.userservice.jwt.cookie.CookieService;
import me.chowlong.userservice.jwt.refreshToken.RefreshToken;
import me.chowlong.userservice.jwt.refreshToken.RefreshTokenService;
import me.chowlong.userservice.user.User;
import me.chowlong.userservice.user.UserService;
import me.chowlong.userservice.util.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.lang.NonNull;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RateLimiter(name = "auth-controller")
public class AuthController {
    @Value("${auth.providers.github.client-id}")
    private String githubClientId;
    @Value("${auth.providers.github.client-secret}")
    private String githubClientSecret;
    @Value("${auth.providers.discord.client-id}")
    private String discordClientId;
    @Value("${auth.providers.discord.client-secret}")
    private String discordClientSecret;

    private final JwtService jwtService;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final CookieService cookieService;

    private final RestTemplate restTemplate;

    public AuthController(
            JwtService jwtService,
            UserService userService,
            RefreshTokenService refreshTokenService,
            CookieService cookieService,
            @Qualifier("externalRestTemplate") RestTemplate restTemplate
    ) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.cookieService = cookieService;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/login/github")
    public ResponseEntity<Object> githubLogin(
            @NonNull HttpServletResponse response,
            @Valid @RequestBody LoginRequestDTO loginRequestDTO
    ) throws UserNotFoundException {
        String code = loginRequestDTO.getCode();

        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                String.format(
                        "https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s",
                        this.githubClientId, this.githubClientSecret, code
                ),
                null,
                Map.class
        );

        String githubAccessToken = (String) tokenResponse.getBody().get("access_token");

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(githubAccessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.exchange(
                "https://api.github.com/user",
                HttpMethod.GET,
                userRequest,
                Map.class
        );

        Map userDetails = userResponse.getBody();

        if (userDetails == null) {
            throw new UserNotFoundException();
        }

        String githubUserId = userDetails.get("id").toString();
        String githubUsername = userDetails.get("login").toString();

        User user;
        if (!this.userService.userExistsByProviderUserIdAndProviderUsername(githubUserId, githubUsername)) {
            RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO();
            registerRequestDTO.setProvider("GitHub");
            registerRequestDTO.setProviderUserId(githubUserId);
            registerRequestDTO.setProviderUsername(githubUsername);

            user = this.userService.createUser(registerRequestDTO);
        }
        else {
            user = this.userService.getUserByProviderUserIdAndProviderUsername(githubUserId, githubUsername);
        }

        String accessToken = this.jwtService.generateAccessToken(user);
        String refreshToken = this.jwtService.generateRefreshToken(user);
        this.refreshTokenService.createRefreshToken(accessToken, refreshToken);
        this.cookieService.setSessionCookie(response, accessToken);

        return ResponseHandler.generateResponse("Successfully logged user in with GitHub.", HttpStatus.OK, null);
    }

    @PostMapping("/login/discord")
    public ResponseEntity<Object> discordLogin(
            @NonNull HttpServletResponse response,
            @Valid @RequestBody LoginRequestDTO loginRequestDTO
    ) throws UserNotFoundException {
        String code = loginRequestDTO.getCode();
        String discordApiUrl = "https://discord.com/api/v10";

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(this.discordClientId, this.discordClientSecret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                discordApiUrl + "/oauth2/token",
                request,
                Map.class
        );

        String discordAccessToken = (String) tokenResponse.getBody().get("access_token");

        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(discordAccessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.exchange(
                discordApiUrl + "/users/@me",
                HttpMethod.GET,
                userRequest,
                Map.class
        );

        Map userDetails = userResponse.getBody();

        if (userDetails == null) {
            throw new UserNotFoundException();
        }

        String discordUserId = userDetails.get("id").toString();
        String discordUsername = userDetails.get("username").toString();

        User user;
        if (!this.userService.userExistsByProviderUserIdAndProviderUsername(discordUserId, discordUsername)) {
            RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO();
            registerRequestDTO.setProvider("Discord");
            registerRequestDTO.setProviderUserId(discordUserId);
            registerRequestDTO.setProviderUsername(discordUsername);

            user = this.userService.createUser(registerRequestDTO);
        }
        else {
            user = this.userService.getUserByProviderUserIdAndProviderUsername(discordUserId, discordUsername);
        }

        String accessToken = this.jwtService.generateAccessToken(user);
        String refreshToken = this.jwtService.generateRefreshToken(user);
        this.refreshTokenService.createRefreshToken(accessToken, refreshToken);
        this.cookieService.setSessionCookie(response, accessToken);

        return ResponseHandler.generateResponse("Successfully logged user in with Discord.", HttpStatus.OK, null);
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
