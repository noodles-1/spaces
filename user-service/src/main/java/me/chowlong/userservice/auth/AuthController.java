package me.chowlong.userservice.auth;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.Valid;
import me.chowlong.userservice.auth.dto.LoginRequestDTO;
import me.chowlong.userservice.exceptions.AccessTokenNotExpiredException;
import me.chowlong.userservice.exceptions.AccessTokenNotFoundException;
import me.chowlong.userservice.jwt.JwtService;
import me.chowlong.userservice.jwt.refreshToken.RefreshToken;
import me.chowlong.userservice.jwt.refreshToken.RefreshTokenService;
import me.chowlong.userservice.user.User;
import me.chowlong.userservice.user.UserService;
import me.chowlong.userservice.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        try {
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
            responseData.put("accessToken", accessToken);
            return ResponseHandler.generateResponse("User logged-in successfully.", HttpStatus.OK, responseData);
        }
        catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.BAD_REQUEST, null);
        }
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<Object> generateNewTokens(@RequestHeader("Authorization") String authHeader) {
        try {
            String accessToken = authHeader.substring(7);

            if (!this.jwtService.isTokenExpiredAllowExpired(accessToken)) {
                throw new AccessTokenNotExpiredException();
            }
            if (!this.refreshTokenService.refreshTokenExistsByAccessToken(accessToken)) {
                throw new AccessTokenNotFoundException();
            }

            String userId = this.jwtService.extractUserIdAllowExpired(accessToken);
            User user = this.userService.getUserById(userId);
            Map<String, Object> responseData = new HashMap<>();

            RefreshToken refreshToken = this.refreshTokenService.getRefreshTokenByAccessToken(accessToken);
            this.refreshTokenService.deleteRefreshToken(refreshToken);

            String newAccessToken = this.jwtService.generateAccessToken(user);
            String newRefreshToken = this.jwtService.generateRefreshToken(user);
            this.refreshTokenService.createRefreshToken(newAccessToken, newRefreshToken);

            responseData.put("newAccessToken", newAccessToken);
            return ResponseHandler.generateResponse("Tokens successfully refreshed.", HttpStatus.OK, responseData);
        }
        catch(Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.BAD_REQUEST, null);
        }
    }
}
