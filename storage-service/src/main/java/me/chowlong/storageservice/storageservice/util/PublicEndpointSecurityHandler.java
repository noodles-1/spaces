package me.chowlong.storageservice.storageservice.util;

import jakarta.servlet.http.HttpServletRequest;
import me.chowlong.storageservice.storageservice.exception.userPermission.InsufficientPermissionException;
import me.chowlong.storageservice.storageservice.item.Item;
import me.chowlong.storageservice.storageservice.item.ItemService;
import me.chowlong.storageservice.storageservice.jwt.JwtService;
import me.chowlong.storageservice.storageservice.jwt.cookie.CookieService;
import me.chowlong.storageservice.storageservice.userPermission.UserPermission;
import me.chowlong.storageservice.storageservice.userPermission.UserPermissionService;

public class PublicEndpointSecurityHandler {
    private final UserPermissionService userPermissionService;
    private final ItemService itemService;
    private final CookieService cookieService;
    private final JwtService jwtService;

    public PublicEndpointSecurityHandler(
            UserPermissionService userPermissionService,
            ItemService itemService,
            CookieService cookieService,
            JwtService jwtService
    ) {
        this.userPermissionService = userPermissionService;
        this.itemService = itemService;
        this.cookieService = cookieService;
        this.jwtService = jwtService;
    }

    public void handlePublicEndpoint(HttpServletRequest request, String itemId) throws InsufficientPermissionException {
        try {
            String accessToken = this.cookieService.getSessionCookie(request);
            String userId = this.jwtService.extractUserId(accessToken);
            Item userRoot = this.itemService.getItemUserRootById(itemId);

            if (userRoot.getName().equals(userId)) {
                return;
            }

            UserPermission userPermission = this.userPermissionService.checkExistsUserPermissionFromAncestorsByDescendantIdAndUserId(itemId, userId);

            if (userPermission == null) {
                throw new Exception();
            }
        }
        catch (Exception e) {
            UserPermission publicViewPermission = this.userPermissionService.checkExistsUserPermissionFromAncestorsByDescendantIdAndUserId(itemId, "EVERYONE");

            if (publicViewPermission == null) {
                throw new InsufficientPermissionException();
            }
        }
    }
}
