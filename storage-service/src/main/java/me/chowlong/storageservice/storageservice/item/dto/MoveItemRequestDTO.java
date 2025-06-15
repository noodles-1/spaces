package me.chowlong.storageservice.storageservice.item.dto;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.Getter;

@Getter
public class MoveItemRequestDTO {
    @Nonnull
    private String itemId;
    @Nullable
    private String sourceParentId;
    @Nullable
    private String destinationParentId;
}
