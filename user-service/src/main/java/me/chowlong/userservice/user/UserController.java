package me.chowlong.userservice.user;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import me.chowlong.userservice.principals.UserPrincipal;
import me.chowlong.userservice.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @RateLimiter(name = "USER-SERVICE")
    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", userPrincipal.getUser());
        return ResponseHandler.generateResponse("Fetched current user successfully", HttpStatus.OK, responseData);
    }
}
