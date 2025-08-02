package me.chowlong.storageservice.storageservice.userPermission;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import me.chowlong.storageservice.storageservice.jwt.JwtService;
import me.chowlong.storageservice.storageservice.jwt.cookie.CookieService;
import me.chowlong.storageservice.storageservice.userPermission.dto.NewUserPermissionRequestDTO;
import me.chowlong.storageservice.storageservice.userPermission.dto.UpdateUserPermissionRequestDTO;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/permissions")
public class UserPermissionController {
    private final UserPermissionService userPermissionService;
    private final CookieService cookieService;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;

    public UserPermissionController(
            UserPermissionService userPermissionService,
            CookieService cookieService,
            JwtService jwtService,
            ModelMapper modelMapper
    ) {
        this.userPermissionService = userPermissionService;
        this.cookieService = cookieService;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/ancestors/{descendantId}")
    public ResponseEntity<Object> getUserPermissionsFromAncestorsByDescendantId(@PathVariable("descendantId") String descendantId) {
        List<UserPermission> userPermissions = this.userPermissionService.getUserPermissionsFromAncestorsByDescendantId(descendantId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("permissions", userPermissions);
        return ResponseHandler.generateResponse("Fetched user permissions successfully.", HttpStatus.OK, responseData);
    }

    @GetMapping("/public/permission/{descendantId}")
    public ResponseEntity<Object> checkHighestAvailableUserPermissionOfDescendantId(
            @NonNull HttpServletRequest request,
            @PathVariable("descendantId") String descendantId
    ) {
        Map<String, Object> responseData = new HashMap<>();

        try {
            String accessToken = this.cookieService.getSessionCookie(request);
            String userId = this.jwtService.extractUserId(accessToken);
            UserPermission userPermission = this.userPermissionService.checkExistsUserPermissionFromAncestorsByDescendantIdAndUserId(descendantId, userId);
            if (userPermission == null) {
                throw new Exception();
            }
            else {
                responseData.put("permission", userPermission);
            }
        }
        catch (Exception e) {
            UserPermission publicViewPermission = this.userPermissionService.checkExistsUserPermissionFromAncestorsByDescendantIdAndUserId(descendantId, "EVERYONE");
            responseData.put("permission", publicViewPermission);
        }

        return ResponseHandler.generateResponse("Fetched permission successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createUserPermission(@Valid @RequestBody NewUserPermissionRequestDTO newUserPermissionRequestDTO) {
        this.userPermissionService.createUserPermission(newUserPermissionRequestDTO);
        return ResponseHandler.generateResponse("Created new user permission successfully.", HttpStatus.OK, null);
    }

    @PatchMapping("/update")
    public ResponseEntity<Object> updateUserPermission(@Valid @RequestBody UpdateUserPermissionRequestDTO updateUserPermissionRequestDTO) {
        this.userPermissionService.updateUserPermission(updateUserPermissionRequestDTO);
        return ResponseHandler.generateResponse("Updated user permission successfully.", HttpStatus.OK, null);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteUserPermission(@PathVariable("id") String id) {
        this.userPermissionService.deleteUserPermission(id);
        return ResponseHandler.generateResponse("Deleted user permission successfully.", HttpStatus.OK, null);
    }
}
