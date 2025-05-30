package me.chowlong.userservice.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import me.chowlong.userservice.auditLog.AuditLogDto;
import me.chowlong.userservice.aws.AwsService;
import me.chowlong.userservice.exception.user.CustomUsernameInvalidException;
import me.chowlong.userservice.exception.user.InvalidImageFileException;
import me.chowlong.userservice.exception.user.UserNotFoundException;
import me.chowlong.userservice.jwt.JwtService;
import me.chowlong.userservice.jwt.cookie.CookieService;
import me.chowlong.userservice.kafka.KafkaService;
import me.chowlong.userservice.principal.UserPrincipal;
import me.chowlong.userservice.user.dto.UpdateCustomUsernameDTO;
import me.chowlong.userservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final CookieService cookieService;
    private final JwtService jwtService;
    private final AwsService awsService;
    private final KafkaService kafkaService;

    public UserController(
            UserService userService,
            CookieService cookieService,
            JwtService jwtService,
            AwsService awsService,
            KafkaService kafkaService
    ) {
        this.userService = userService;
        this.cookieService = cookieService;
        this.jwtService = jwtService;
        this.awsService = awsService;
        this.kafkaService = kafkaService;
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", userPrincipal.getUser());
        return ResponseHandler.generateResponse("Fetched current user successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<Object> getUserInfo(@PathVariable("userId") String userId) throws UserNotFoundException {
        User user = this.userService.getUserById(userId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", user);
        return ResponseHandler.generateResponse("Fetched user information successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/custom-username-exists/{customUsername}")
    public ResponseEntity<Object> checkUserExistsByCustomUsername(@PathVariable("customUsername") String customUsername) {
        boolean userExists = this.userService.userExistsByCustomUsername(customUsername);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userExists", userExists);
        return ResponseHandler.generateResponse("Checked if user exists by custom username successfully.", HttpStatus.OK, responseData);
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

        AuditLogDto auditLogDto = new AuditLogDto();
        auditLogDto.setUserId(userId);
        auditLogDto.setAction("Updated profile picture");
        auditLogDto.setEndpoint("/me/update-profile-picture");
        auditLogDto.setMethod("POST");
        auditLogDto.setTimestamp(ZonedDateTime.now().toInstant());
        this.kafkaService.produceLog(auditLogDto);

        return ResponseHandler.generateResponse("Profile picture updated successfully.", HttpStatus.OK, null);
    }

    @PostMapping("/me/update-custom-username")
    public ResponseEntity<Object> updateCustomUsername(
            @NonNull HttpServletRequest request,
            @Valid @RequestBody UpdateCustomUsernameDTO updateCustomUsernameDto
    ) throws Exception {
        String newCustomUsername = updateCustomUsernameDto.getNewCustomUsername();
        if (newCustomUsername.length() < 4 || 20 < newCustomUsername.length()) {
            throw new CustomUsernameInvalidException();
        }

        Pattern customUsernamePattern = Pattern.compile("^[a-zA-Z0-9]+$");
        if (!customUsernamePattern.matcher(newCustomUsername).matches()) {
            throw new CustomUsernameInvalidException();
        }

        String accessToken = this.cookieService.getSessionCookie(request);
        String userId = this.jwtService.extractUserId(accessToken);
        User user = this.userService.getUserById(userId);

        this.userService.updateCustomUsername(user, newCustomUsername);
        return ResponseHandler.generateResponse("Custom username updated successfully.", HttpStatus.OK, null);
    }

    @PostMapping("/me/update-setup-done")
    public ResponseEntity<Object> updateSetupDone(
            @NonNull HttpServletRequest request
    ) throws Exception {
        String accessToken = this.cookieService.getSessionCookie(request);
        String userId = this.jwtService.extractUserId(accessToken);
        User user = this.userService.getUserById(userId);

        this.userService.updateSetupDone(user);
        return ResponseHandler.generateResponse("User setup has been accomplished successfully.", HttpStatus.OK, null);
    }
}
