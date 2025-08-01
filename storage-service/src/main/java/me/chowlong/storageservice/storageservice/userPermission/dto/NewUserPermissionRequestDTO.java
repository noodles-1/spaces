package me.chowlong.storageservice.storageservice.userPermission.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import me.chowlong.storageservice.storageservice.enums.UserPermissionType;

@Getter
public class NewUserPermissionRequestDTO {
    @Nonnull
    private String userId;
    @Nonnull
    private UserPermissionType type;
    @Nonnull
    private String itemId;
}
