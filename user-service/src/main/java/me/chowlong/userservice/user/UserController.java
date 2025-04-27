package me.chowlong.userservice.user;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import me.chowlong.userservice.aws.AwsService;
import me.chowlong.userservice.exception.user.InvalidImageFileException;
import me.chowlong.userservice.jwt.JwtService;
import me.chowlong.userservice.jwt.cookie.CookieService;
import me.chowlong.userservice.principal.UserPrincipal;
import me.chowlong.userservice.util.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RateLimiter(name = "user-controller")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private CookieService cookieService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AwsService awsService;

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", userPrincipal.getUser());
        return ResponseHandler.generateResponse("Fetched current user successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/user-exists/{providerEmail}")
    public ResponseEntity<Object> checkUserExists(@PathVariable("providerEmail") String providerEmail) {
        boolean userExists = this.userService.userExistsByProviderEmail(providerEmail);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userExists", userExists);
        return ResponseHandler.generateResponse("Checked if user exists successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/me/update-profile-picture")
    public ResponseEntity<Object> updateProfilePicture(
            @NonNull HttpServletRequest request,
            @NonNull @RequestParam("file") MultipartFile file
    ) throws Exception {
        if (file.isEmpty()) {
            throw new FileNotFoundException();
        }

        String accessToken = this.cookieService.getSessionCookie(request);
        String userId = this.jwtService.extractUserId(accessToken);
        User user = this.userService.getUserById(userId);

        if (user.getProfilePictureUrl() != null) {
            String profilePictureFileName = user.getProfilePictureUrl().split("//")[1].split("/")[2];
            String profilePictureKeyName = String.format("%s/%s", user.getId(), profilePictureFileName);
            this.awsService.deleteFile(profilePictureKeyName);
        }

        String fileName = UUID.randomUUID().toString();
        String contentType = Objects.requireNonNull(file.getContentType());

        if (!(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
            throw new InvalidImageFileException();
        }

        long contentLength = file.getSize();
        InputStream inputStream = file.getInputStream();

        String keyName = String.format("%s/%s", user.getId(), fileName);
        String profilePictureUrl = this.awsService.uploadFile(keyName, contentType, contentLength, inputStream);
        this.userService.updateProfilePicture(user, profilePictureUrl);
        return ResponseHandler.generateResponse("Profile picture updated successfully.", HttpStatus.OK, null);
    }
}
