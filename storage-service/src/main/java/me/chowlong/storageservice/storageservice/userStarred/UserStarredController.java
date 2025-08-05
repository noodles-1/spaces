package me.chowlong.storageservice.storageservice.userStarred;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import me.chowlong.storageservice.storageservice.item.Item;
import me.chowlong.storageservice.storageservice.jwt.JwtService;
import me.chowlong.storageservice.storageservice.jwt.cookie.CookieService;
import me.chowlong.storageservice.storageservice.principal.UserPrincipal;
import me.chowlong.storageservice.storageservice.userStarred.dto.ToggleStarRequestDTO;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/starred")
public class UserStarredController {
    private final UserStarredService userStarredService;
    private final CookieService cookieService;
    private final JwtService jwtService;

    public UserStarredController(
            UserStarredService userStarredService,
            CookieService cookieService,
            JwtService jwtService
    ) {
        this.userStarredService = userStarredService;
        this.cookieService = cookieService;
        this.jwtService = jwtService;
    }

    @GetMapping("/public/check-exists/{itemId}")
    public ResponseEntity<Object> checkItemStarredExists(
            @NonNull HttpServletRequest request,
            @PathVariable("itemId") String itemId
    ) {
        Map<String, Object> responseData = new HashMap<>();

        try {
            String accessToken = this.cookieService.getSessionCookie(request);
            String userId = this.jwtService.extractUserId(accessToken);
            responseData.put("exists", this.userStarredService.checkItemStarredExists(userId, itemId));
        }
        catch (Exception e) {
            responseData.put("exists", false);
        }

        return ResponseHandler.generateResponse("Checked item starred exists.", HttpStatus.OK, responseData);
    }

    @PostMapping("/toggle")
    public ResponseEntity<Object> toggleItemStarred(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ToggleStarRequestDTO toggleStarRequestDTO
    ) {
        this.userStarredService.toggleItemStarred(userPrincipal.getUserId(), toggleStarRequestDTO.getItemId());
        return ResponseHandler.generateResponse("Toggled item starred.", HttpStatus.OK, null);
    }
}
