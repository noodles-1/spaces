package me.chowlong.storageservice.storageservice.userStarred;

import jakarta.validation.Valid;
import me.chowlong.storageservice.storageservice.item.Item;
import me.chowlong.storageservice.storageservice.principal.UserPrincipal;
import me.chowlong.storageservice.storageservice.userStarred.dto.ToggleStarRequestDTO;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/starred")
public class UserStarredController {
    private final UserStarredService userStarredService;

    public UserStarredController(UserStarredService userStarredService) {
        this.userStarredService = userStarredService;
    }

    @GetMapping("/items")
    public ResponseEntity<Object> getAllStarredItemsOfUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Item> children = this.userStarredService.getAllStarredItemsOfUser(userPrincipal.getUserId());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("children", children);
        return ResponseHandler.generateResponse("Fetched current user's starred items.", HttpStatus.OK, responseData);
    }

    @GetMapping("/public/check-exists/{itemId}")
    public ResponseEntity<Object> checkItemStarredExists(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("itemId") String itemId
    ) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("exists", this.userStarredService.checkItemStarredExists(userPrincipal.getUserId(), itemId));
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
