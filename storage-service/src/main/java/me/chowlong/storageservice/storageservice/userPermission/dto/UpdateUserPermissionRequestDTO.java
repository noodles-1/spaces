package me.chowlong.storageservice.storageservice.userPermission.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import me.chowlong.storageservice.storageservice.enums.UserPermissionType;

@Getter
public class UpdateUserPermissionRequestDTO {
    @Nonnull
    private String id;
    @Nonnull
    private UserPermissionType type;
}
